#!/usr/bin/env bash
set -euo pipefail
# sentry-api.sh — Query the Sentry REST API for issue details and events.
#
# Provides the data-access layer the fixer skill needs without requiring a Sentry MCP server.
# Uses SENTRY_AUTH_TOKEN and curl, matching the pattern of the sentry-top-issue scripts.
#
# Usage:
#   bash sentry-api.sh --org <slug> --region <url> --short-id <ID> --mode <mode> [options]
#
# Modes:
#   issue          Print issue summary JSON (id, title, culprit, status, counts, permalink, metadata)
#   latest-event   Fetch latest event, write to --output file, print summary line
#   events-list    Print JSON array of the 5 most recent events (id, dateCreated, release, environment)
#   tags           Print tag key/value distributions for the issue
#   summary        Write a markdown summary file (used by CI to surface results in job summary)
#
# Required for all modes:
#   SENTRY_AUTH_TOKEN env var
#   --org <slug>       Sentry organization slug
#   --short-id <id>    Sentry short ID (e.g. PROJECT-F)
#
# Optional:
#   --region <url>     Sentry region URL (default: https://sentry.io)
#   --output <path>    File path for latest-event and summary modes (default: /tmp/sentry-latest-event.json)
#   --summary-text <text>  Body text for summary mode (e.g. "already resolved in codebase")
#   --status <status>  Summary outcome: fixed (PR created), info (no action needed), warn (needs attention, default)
#
# Output: JSON on stdout (except latest-event which writes to a file and prints a summary).
# Exit codes: 0 success, 1 API/network error, 2 invalid args, 3 shortId resolution failed.

for cmd in curl jq; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "$cmd is required" >&2; exit 2; }
done

[[ -z "${SENTRY_AUTH_TOKEN:-}" ]] && { echo "SENTRY_AUTH_TOKEN is not set" >&2; exit 2; }

ORG=""
REGION="https://sentry.io"
SHORT_ID=""
MODE=""
OUTPUT="/tmp/sentry-latest-event.json"
SUMMARY_TEXT=""
STATUS="warn"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --org)           ORG="$2"; shift 2 ;;
    --region)        REGION="$2"; shift 2 ;;
    --short-id)      SHORT_ID="$2"; shift 2 ;;
    --mode)          MODE="$2"; shift 2 ;;
    --output)        OUTPUT="$2"; shift 2 ;;
    --summary-text)  SUMMARY_TEXT="$2"; shift 2 ;;
    --status)        STATUS="$2"; shift 2 ;;
    *)               echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

[[ -z "$ORG" ]]      && { echo "--org is required" >&2; exit 2; }
[[ -z "$SHORT_ID" ]] && { echo "--short-id is required" >&2; exit 2; }
[[ -z "$MODE" ]]     && { echo "--mode is required" >&2; exit 2; }

BASE_URL="${REGION%/}"
AUTH_HEADER="Authorization: Bearer ${SENTRY_AUTH_TOKEN}"

_api_get() {
  local url="$1"
  local response http_code body
  response=$(curl -s -w '\n%{http_code}' -H "$AUTH_HEADER" "$url" 2>/dev/null) \
    || { echo "curl request failed for $url" >&2; return 1; }
  http_code=$(tail -n 1 <<< "$response")
  body=$(sed '$d' <<< "$response")
  if [[ "$http_code" -lt 200 || "$http_code" -ge 300 ]]; then
    local detail
    detail=$(jq -r '.detail // empty' <<< "$body" 2>/dev/null || true)
    [[ -z "$detail" ]] && detail="HTTP $http_code"
    echo "Sentry API error ($http_code): $detail" >&2
    return 1
  fi
  printf '%s' "$body"
}

# Resolve shortId -> numeric group ID
RESOLVE_BODY=$(_api_get "${BASE_URL}/api/0/organizations/${ORG}/shortids/${SHORT_ID}/") \
  || { echo "could not resolve shortId ${SHORT_ID}" >&2; exit 3; }
ISSUE_ID=$(jq -r '.groupId // .group.id // empty' <<< "$RESOLVE_BODY")
if [[ -z "$ISSUE_ID" ]]; then
  echo "could not extract groupId from shortId resolution response" >&2
  echo "$RESOLVE_BODY" >&2
  exit 3
fi

case "$MODE" in
  issue)
    _api_get "${BASE_URL}/api/0/organizations/${ORG}/issues/${ISSUE_ID}/" \
      | jq '{id, shortId, title, culprit, level, status, count, userCount, firstSeen, lastSeen, permalink, platform, type, metadata}'
    ;;

  latest-event)
    _api_get "${BASE_URL}/api/0/organizations/${ORG}/issues/${ISSUE_ID}/events/latest/" > "$OUTPUT"
    EVENT_ID=$(jq -r '.id // .eventID // "unknown"' "$OUTPUT" 2>/dev/null)
    FILE_SIZE=$(wc -c < "$OUTPUT" | tr -d ' ')
    echo "wrote ${OUTPUT} (${FILE_SIZE} bytes), eventId=${EVENT_ID}"
    ;;

  events-list)
    _api_get "${BASE_URL}/api/0/organizations/${ORG}/issues/${ISSUE_ID}/events/" \
      | jq '[.[:5][] | {
          id: (.id // .eventID),
          dateCreated,
          release: (.release // null),
          environment: (first((.tags // [])[] | select(.key=="environment") | .value) // null)
        }]'
    ;;

  tags)
    _api_get "${BASE_URL}/api/0/organizations/${ORG}/issues/${ISSUE_ID}/tags/" \
      | jq '[.[] | {key, totalValues, topValues: [(.topValues // [])[:3][] | {value, count}]}]'
    ;;

  summary)
    ISSUE_JSON=$(_api_get "${BASE_URL}/api/0/organizations/${ORG}/issues/${ISSUE_ID}/") || exit 1
    TITLE=$(jq -r '.title // "Unknown"' <<< "$ISSUE_JSON")
    PERMALINK=$(jq -r '.permalink // ""' <<< "$ISSUE_JSON")
    COUNT=$(jq -r '.count // "?"' <<< "$ISSUE_JSON")
    USER_COUNT=$(jq -r '.userCount // "?"' <<< "$ISSUE_JSON")
    FIRST_SEEN=$(jq -r '.firstSeen // "?"' <<< "$ISSUE_JSON")
    LAST_SEEN=$(jq -r '.lastSeen // "?"' <<< "$ISSUE_JSON")

    [[ -z "$SUMMARY_TEXT" ]] && SUMMARY_TEXT="Investigation complete."

    case "$STATUS" in
      fixed) HEADING="### ✅ Sentry Issue Fixed: ${SHORT_ID}" ;;
      info)  HEADING="### ℹ️ Sentry Issue: ${SHORT_ID}" ;;
      *)     HEADING="### ⚠️ Sentry Issue: ${SHORT_ID}" ;;
    esac

    SUMMARY_DIR="$(dirname "$OUTPUT")"
    mkdir -p "$SUMMARY_DIR"

    cat > "$OUTPUT" <<SUMMARY_EOF
${HEADING}

**${TITLE}**

${SUMMARY_TEXT}

| Detail | Value |
|--------|-------|
| Issue | [${SHORT_ID}](${PERMALINK}) |
| Events | ${COUNT} |
| Users | ${USER_COUNT} |
| First seen | ${FIRST_SEEN} |
| Last seen | ${LAST_SEEN} |

👉 [**Open in Sentry**](${PERMALINK})
SUMMARY_EOF

    echo "wrote summary to ${OUTPUT}"
    ;;

  *)
    echo "unknown mode: $MODE (expected: issue, latest-event, events-list, tags, summary)" >&2
    exit 2
    ;;
esac
