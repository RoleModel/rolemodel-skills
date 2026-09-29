#!/usr/bin/env ruby
# frozen_string_literal: true

# Re-downloads the Cloud 66 Deploy v2 documentation into references/ and
# rebuilds INDEX.md. Run it from anywhere:
#
#   ruby .agents/skills/cloud66-deploy-v2/scripts/refresh.rb
#
# Every help.cloud66.com page is published as clean Markdown at the same URL
# with `.md` appended, so this fetches those rather than scraping HTML.

require "net/http"
require "uri"
require "fileutils"
require "set"
require "tmpdir"

SITEMAP = URI("https://help.cloud66.com/sitemap.xml")
PREFIX = "https://help.cloud66.com/deploy/2/"
SKILL_ROOT = File.expand_path("..", __dir__)
REFERENCES = File.join(SKILL_ROOT, "references")
THREADS = 6

# The published Markdown links between pages with a router template rather than
# a real path, e.g. `/:product/:version?/manifest/what-is-a-manifest-file`.
LINK_TEMPLATE = %r{\(/(?::product|deploy)/:version\?/([\w\-/]+)([^)]*)\)}

SECTION_TITLES = {
  "getting-started" => "Getting Started",
  "cloud-66-101" => "Cloud 66 101",
  "account" => "Account",
  "auto-scaling" => "Auto Scaling",
  "build-and-config" => "Build & Config",
  "custom-config" => "Custom Config",
  "databases" => "Databases",
  "deploy-hooks" => "Deploy Hooks",
  "deployment" => "Deployment",
  "failover-groups" => "Failover Groups",
  "integrations" => "Integrations",
  "load-balancers" => "Load Balancers",
  "manifest" => "Manifest File",
  "networking" => "Networking",
  "security" => "Security",
  "servers" => "Servers",
  "specs-and-policies" => "Specs & Policies",
  "mcp" => "MCP Server",
  "toolbelt" => "Toolbelt (cx CLI)"
}.freeze

def get(uri)
  Net::HTTP.get_response(URI(uri)).then do |response|
    raise "#{response.code} for #{uri}" unless response.is_a?(Net::HTTPSuccess)

    response.body.force_encoding(Encoding::UTF_8)
  end
end

def page_urls
  get(SITEMAP)
    .scan(%r{<loc>([^<]+)</loc>})
    .flatten
    .select { |url| url.start_with?(PREFIX) }
    .uniq
end

def download(urls, references_dir)
  queue = Queue.new
  urls.each { |url| queue << url }
  failures = Queue.new

  THREADS.times.map {
    Thread.new do
      while (url = queue.pop(true) rescue nil)
        begin
          write_page(url, get("#{url}.md"), references_dir)
        rescue StandardError => e
          failures << "#{url}: #{e.message}"
        end
      end
    end
  }.each(&:join)

  Array.new(failures.size) { failures.pop }
end

def write_page(url, body, references_dir)
  path = File.join(references_dir, "#{url.delete_prefix(PREFIX)}.md")
  FileUtils.mkdir_p(File.dirname(path))
  File.write(path, body)
end

# Every page lives at references/<section>/<page>.md, so a link to another
# mirrored page is always one directory up. Pages the v2 sitemap does not list
# (cross-product and unlisted pages) keep their canonical URL instead.
def rewrite_links(urls, references_dir)
  mirrored = urls.map { |url| url.delete_prefix(PREFIX) }.to_set

  Dir.glob(File.join(references_dir, "**", "*.md")).each do |path|
    body = File.read(path, encoding: Encoding::UTF_8)
    File.write(path, body.gsub(LINK_TEMPLATE) {
      page, suffix = $1, $2
      mirrored.include?(page) ? "(../#{page}.md#{suffix})" : "(#{PREFIX}#{page}#{suffix})"
    })
  end
end

def build_index(urls, references_dir, index_path)
  sections = urls.group_by { |url| url.delete_prefix(PREFIX).split("/").first }

  index = +<<~HEAD
    # Cloud 66 Deploy v2 — Documentation Index

    Every page of the Cloud 66 Deploy **v2** documentation, mirrored from
    <#{PREFIX}> as Markdown. Find the page you need here, then read that one file.

    #{urls.size} pages. Grep `references/` when a title alone does not tell you
    where something lives.

  HEAD

  sections.each do |section, section_urls|
    index << "## #{SECTION_TITLES.fetch(section) { section.tr("-", " ").capitalize }}\n\n"
    section_urls.each do |url|
      relative = "#{url.delete_prefix(PREFIX)}.md"
      index << "- [#{title_of(relative, references_dir)}](references/#{relative}) — <#{url}>\n"
    end
    index << "\n"
  end

  File.write(index_path, index)
end

def title_of(relative, references_dir)
  body = File.read(File.join(references_dir, relative), encoding: Encoding::UTF_8)
  body[/^#\s+(.+)$/, 1]&.strip || File.basename(relative, ".md").tr("-", " ")
end

urls = page_urls
abort "No Deploy v2 pages found in the sitemap — has the URL scheme changed?" if urls.empty?

Dir.mktmpdir("cloud66-deploy-v2-", SKILL_ROOT) do |tmp_root|
  staged_references = File.join(tmp_root, "references")
  staged_index = File.join(tmp_root, "INDEX.md")

  failures = download(urls, staged_references)
  abort "Failed to download #{failures.size} page(s):\n#{failures.join("\n")}" if failures.any?

  rewrite_links(urls, staged_references)
  build_index(urls, staged_references, staged_index)

  FileUtils.rm_rf(REFERENCES)
  FileUtils.mv(staged_references, REFERENCES)
  FileUtils.mv(staged_index, File.join(SKILL_ROOT, "INDEX.md"))
end

puts "Downloaded #{urls.size} pages into #{REFERENCES} and rebuilt INDEX.md"
