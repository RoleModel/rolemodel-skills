#!/usr/bin/env ruby
# frozen_string_literal: true

# PreToolUse hook (Edit|Write|MultiEdit): when the file being edited matches a
# convention's declared paths, inject a pointer to that docs/conventions/*.md so
# the conventions-first rule in AGENTS.md is reinforced automatically instead of
# relying on the model remembering to scan the index.
#
# Fully data-driven: the slug, description, and trigger paths all come from
# docs/CONVENTIONS.md. This script has NO hardcoded list of conventions — adding
# a convention is just a new index line (with an optional `<!-- paths: ... -->`
# comment) and the hook picks it up automatically. A line with no paths comment
# simply never path-triggers.
#
# Non-blocking: emits only `additionalContext` (no permissionDecision), so the
# normal permission flow is unchanged. Each convention is surfaced at most once
# per session to avoid repeating the same pointer on every edit.

require 'json'
require 'tmpdir'
require 'fileutils'

# `- [Title](conventions/<slug>.md) — <description> <!-- paths: g1, g2 -->`
INDEX_LINE = %r{\A-\s*\[.*?\]\(conventions/([\w-]+)\.md\)\s*—\s*(.*)\z}
PATHS_COMMENT = /<!--\s*paths:\s*(.*?)\s*-->/

def emit(context)
  puts JSON.generate(
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      additionalContext: context
    }
  )
end

# Parse docs/CONVENTIONS.md into [{ slug:, description:, globs: [] }, ...].
def conventions(project_dir)
  index = File.join(project_dir, 'docs', 'CONVENTIONS.md')
  return [] unless File.exist?(index)

  File.readlines(index).filter_map do |line|
    m = line.strip.match(INDEX_LINE)
    next unless m

    slug = m[1]
    rest = m[2]
    globs = (rest[PATHS_COMMENT, 1] || '').split(',').map(&:strip).reject(&:empty?)
    description = rest.sub(PATHS_COMMENT, '').strip.sub(/\.\z/, '')
    { slug: slug, description: description, globs: globs }
  end
end

input = begin
  JSON.parse($stdin.read)
rescue StandardError
  {}
end
file_path = input.dig('tool_input', 'file_path').to_s
exit 0 if file_path.empty?

project_dir = ENV.fetch('CLAUDE_PROJECT_DIR', Dir.pwd)
rel = file_path.sub(%r{\A#{Regexp.escape(project_dir)}/?}, '')

flags = File::FNM_PATHNAME | File::FNM_EXTGLOB
matched = conventions(project_dir).select do |conv|
  conv[:globs].any? { |glob| File.fnmatch?(glob, rel, flags) }
end
exit 0 if matched.empty?

# Surface each convention at most once per session.
session_id = input['session_id'].to_s
session_id = 'default' if session_id.empty?
marker_dir = File.join(Dir.tmpdir, "claude-conventions-#{session_id}")
FileUtils.mkdir_p(marker_dir)

fresh = matched.reject do |conv|
  marker = File.join(marker_dir, conv[:slug])
  if File.exist?(marker)
    true
  else
    File.write(marker, '')
    false
  end
end
exit 0 if fresh.empty?

lines = fresh.map { |conv| "  • docs/conventions/#{conv[:slug]}.md — #{conv[:description]}" }
emit("📐 Convention docs that apply to `#{rel}`. Read the relevant one(s) before editing:\n#{lines.join("\n")}")
