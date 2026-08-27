#!/usr/bin/env ruby
# frozen_string_literal: true

# PreToolUse hook (Edit|Write): points Claude at the docs/conventions/*.md that
# govern the file being edited. Always exits 0 and emits only additionalContext,
# never a permissionDecision, so the permission flow is untouched.
#
# Hooks run in a non-login shell that usually has no LANG, making
# Encoding.default_external US-ASCII. Every string crossing into this script —
# stdin, the index file, paths from ENV and Dir.pwd — is pinned to UTF-8, or the
# first em dash in the index raises Encoding::CompatibilityError.

require 'json'
require 'tmpdir'
require 'fileutils'

GLOB_FLAGS = File::FNM_PATHNAME | File::FNM_EXTGLOB

Convention = Struct.new(:slug, :description, :globs, keyword_init: true) do
  def applies_to?(relative_path)
    globs.any? { |glob| File.fnmatch?(glob, relative_path, GLOB_FLAGS) }
  end

  def pointer
    "  • docs/conventions/#{slug}.md — #{description}"
  end
end

module ConventionIndex
  # - [Title](conventions/<slug>.md) — <description> <!-- paths: glob, glob -->
  # The separator accepts an en dash or hyphen as well: the template asks for an
  # em dash, and a hand-typed substitute should not silently stop matching.
  ENTRY = %r{\A-\s*\[.*?\]\(conventions/([\w-]+)\.md\)\s*[—–-]\s*(.*)\z}
  PATHS_COMMENT = /<!--\s*paths:\s*(.*?)\s*-->/

  def self.load(project_root)
    index = File.join(project_root, 'docs', 'CONVENTIONS.md')
    return [] unless File.exist?(index)

    entries = File.readlines(index, encoding: 'UTF-8').filter_map { |line| parse(line.strip) }
    # An index entry outlives a renamed or deleted convention file. Pointing an
    # agent at a file that isn't there is worse than surfacing nothing, so an
    # entry that no longer resolves drops out instead.
    entries.select { |convention| File.exist?(file_for(project_root, convention)) }
  end

  def self.file_for(project_root, convention)
    File.join(project_root, 'docs', 'conventions', "#{convention.slug}.md")
  end

  def self.parse(line)
    slug, remainder = ENTRY.match(line)&.captures
    return unless slug

    Convention.new(slug: slug, description: description_in(remainder), globs: globs_in(remainder))
  end

  def self.globs_in(remainder)
    remainder[PATHS_COMMENT, 1].to_s.split(',').map(&:strip).reject(&:empty?)
  end

  def self.description_in(remainder)
    remainder.sub(PATHS_COMMENT, '').strip.delete_suffix('.')
  end

  private_class_method :parse, :globs_in, :description_in, :file_for
end

class SurfacedOnce
  MARKER_GLOB = 'claude-conventions-*'
  STALE_AFTER = 24 * 60 * 60

  def initialize(session_id)
    @marker_dir = File.join(Dir.tmpdir, "claude-conventions-#{sanitize(session_id)}")
    sweep_stale_sessions
    FileUtils.mkdir_p(@marker_dir)
  end

  def claim(conventions)
    conventions.reject { |convention| already_surfaced?(convention) }
  end

  private

  def already_surfaced?(convention)
    marker = File.join(@marker_dir, convention.slug)
    return true if File.exist?(marker)

    File.write(marker, '')
    false
  end

  def sanitize(session_id)
    cleaned = session_id.to_s.gsub(/[^\w-]/, '')
    cleaned.empty? ? 'default' : cleaned
  end

  # One marker dir per session, otherwise kept forever. A session outliving the
  # sweep window keeps its dir: writing a marker refreshes the mtime.
  def sweep_stale_sessions
    cutoff = Time.now - STALE_AFTER
    Dir.glob(File.join(Dir.tmpdir, MARKER_GLOB)).each do |dir|
      FileUtils.rm_rf(dir) if File.mtime(dir) < cutoff
    end
  rescue SystemCallError
    nil
  end
end

def hook_payload
  JSON.parse($stdin.set_encoding('UTF-8').read)
rescue JSON::ParserError, EncodingError
  {}
end

# A worktree moves the payload's `cwd` while CLAUDE_PROJECT_DIR stays on the
# original checkout, so the root holding the file is the root holding its docs.
def root_containing(edited_file, payload)
  [payload['cwd'], ENV.fetch('CLAUDE_PROJECT_DIR', nil), Dir.pwd]
    .compact
    .map { |root| root.dup.force_encoding(Encoding::UTF_8) }
    .find { |root| edited_file.start_with?("#{root}/") }
end

def emit(context)
  puts JSON.generate(
    hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: context }
  )
end

def surface_conventions
  payload = hook_payload
  edited_file = payload.dig('tool_input', 'file_path').to_s
  return if edited_file.empty?

  root = root_containing(edited_file, payload)
  return unless root

  relative_path = edited_file.delete_prefix("#{root}/")
  applicable = ConventionIndex.load(root).select { |convention| convention.applies_to?(relative_path) }
  return if applicable.empty?

  fresh = SurfacedOnce.new(payload['session_id']).claim(applicable)
  return if fresh.empty?

  emit(<<~CONTEXT.chomp)
    📐 Convention docs that apply to `#{relative_path}`. Read the relevant one(s) before editing:
    #{fresh.map(&:pointer).join("\n")}
  CONTEXT
end

begin
  surface_conventions
rescue StandardError => e
  # An unreadable index, a full disk, a tmpdir this user can't write — none of
  # that is worth interrupting an edit over. One stderr line, no backtrace: the
  # exit stays 0, and a hook that's silently broken is still findable in
  # `claude --debug`.
  warn "surface_conventions: #{e.class}: #{e.message}"
end

exit 0
