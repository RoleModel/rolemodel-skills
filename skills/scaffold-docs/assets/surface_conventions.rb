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
  ENTRY = %r{\A-\s*\[.*?\]\(conventions/([\w-]+)\.md\)\s*—\s*(.*)\z}
  PATHS_COMMENT = /<!--\s*paths:\s*(.*?)\s*-->/

  def self.load(project_root)
    index = File.join(project_root, 'docs', 'CONVENTIONS.md')
    return [] unless File.exist?(index)

    File.readlines(index, encoding: 'UTF-8').filter_map { |line| parse(line.strip) }
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

  private_class_method :parse, :globs_in, :description_in
end

class SurfacedOnce
  def initialize(session_id)
    @marker_dir = File.join(Dir.tmpdir, "claude-conventions-#{sanitize(session_id)}")
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

payload = hook_payload
edited_file = payload.dig('tool_input', 'file_path').to_s
exit 0 if edited_file.empty?

root = root_containing(edited_file, payload)
exit 0 unless root

relative_path = edited_file.delete_prefix("#{root}/")
applicable = ConventionIndex.load(root).select { |convention| convention.applies_to?(relative_path) }
exit 0 if applicable.empty?

fresh = SurfacedOnce.new(payload['session_id']).claim(applicable)
exit 0 if fresh.empty?

emit(<<~CONTEXT.chomp)
  📐 Convention docs that apply to `#{relative_path}`. Read the relevant one(s) before editing:
  #{fresh.map(&:pointer).join("\n")}
CONTEXT
