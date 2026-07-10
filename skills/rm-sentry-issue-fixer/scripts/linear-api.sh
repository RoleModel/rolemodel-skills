#!/usr/bin/env bash
set -euo pipefail
# linear-api.sh — Create Linear issues for Sentry fixes via the Linear GraphQL API.
#
# Required env: LINEAR_API_KEY (personal API key or OAuth token)
# Required tools: curl, jq
#
# Modes:
#   create-issue   Create a Linear issue and return its branch name, identifier, and URL.
#     --team-key <KEY>        Linear team key (e.g., "ENG", "PLATFORM")
#     --title <text>          Issue title
#     --description <text>    Issue description (markdown; optional)
#     Output: {"id":"uuid","identifier":"ENG-123","branchName":"...","url":"https://linear.app/..."}
#
#   update-state   Transition an issue to a named workflow state.
#     --issue-id <UUID>       Linear issue UUID (from create-issue output)
#     --team-key <KEY>        Team key (to look up workflow states)
#     --state-name <name>     Target state name (e.g., "In Progress")
#     Output: {"success":true,"state":"In Progress"}
#
# Exit codes: 0 success, 1 API error, 2 invalid args

LINEAR_API_URL="https://api.linear.app/graphql"

for cmd in curl jq; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "$cmd is required by linear-api.sh" >&2; exit 2
  }
done

MODE=""
TEAM_KEY=""
TITLE=""
DESCRIPTION=""
ISSUE_ID=""
STATE_NAME=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)        MODE="$2"; shift 2 ;;
    --team-key)    TEAM_KEY="$2"; shift 2 ;;
    --title)       TITLE="$2"; shift 2 ;;
    --description) DESCRIPTION="$2"; shift 2 ;;
    --issue-id)    ISSUE_ID="$2"; shift 2 ;;
    --state-name)  STATE_NAME="$2"; shift 2 ;;
    *)             echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

[[ -z "$MODE" ]] && { echo "--mode required" >&2; exit 2; }
[[ -z "${LINEAR_API_KEY:-}" ]] && {
  echo "LINEAR_API_KEY environment variable required" >&2; exit 2
}

graphql() {
  local query="$1"
  local variables="${2:-{\}}"

  local response
  response="$(curl -sS --fail-with-body -X POST "$LINEAR_API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: $LINEAR_API_KEY" \
    -d "$(jq -cn --arg q "$query" --argjson v "$variables" '{query:$q,variables:$v}')")" || {
    echo "Linear API request failed (HTTP error)" >&2
    exit 1
  }

  local errors
  errors="$(echo "$response" | jq -r 'if .errors then (.errors | map(.message) | join("; ")) else empty end')"
  if [[ -n "$errors" ]]; then
    echo "Linear API error: $errors" >&2
    exit 1
  fi

  echo "$response"
}

case "$MODE" in
  create-issue)
    [[ -z "$TEAM_KEY" ]] && { echo "--team-key required for create-issue" >&2; exit 2; }
    [[ -z "$TITLE" ]]    && { echo "--title required for create-issue" >&2; exit 2; }

    TEAM_RESPONSE="$(graphql '
      query($key: String!) {
        teams(filter: { key: { eq: $key } }) {
          nodes { id name key }
        }
      }
    ' "$(jq -cn --arg key "$TEAM_KEY" '{key:$key}')")"

    TEAM_ID="$(echo "$TEAM_RESPONSE" | jq -r '.data.teams.nodes[0].id // empty')"
    [[ -z "$TEAM_ID" ]] && {
      echo "no Linear team found for key: $TEAM_KEY" >&2; exit 1
    }

    CREATE_VARS="$(jq -cn \
      --arg teamId "$TEAM_ID" \
      --arg title "$TITLE" \
      --arg desc "$DESCRIPTION" \
      '{teamId:$teamId, title:$title, description:$desc}')"

    ISSUE_RESPONSE="$(graphql '
      mutation($teamId: String!, $title: String!, $description: String) {
        issueCreate(input: {
          teamId: $teamId
          title: $title
          description: $description
        }) {
          success
          issue {
            id
            identifier
            branchName
            url
          }
        }
      }
    ' "$CREATE_VARS")"

    SUCCESS="$(echo "$ISSUE_RESPONSE" | jq -r '.data.issueCreate.success')"
    if [[ "$SUCCESS" != "true" ]]; then
      echo "Linear issue creation failed" >&2
      exit 1
    fi

    echo "$ISSUE_RESPONSE" | jq -c '{
      id: .data.issueCreate.issue.id,
      identifier: .data.issueCreate.issue.identifier,
      branchName: .data.issueCreate.issue.branchName,
      url: .data.issueCreate.issue.url
    }'
    ;;
  update-state)
    [[ -z "$ISSUE_ID" ]]   && { echo "--issue-id required for update-state" >&2; exit 2; }
    [[ -z "$TEAM_KEY" ]]   && { echo "--team-key required for update-state" >&2; exit 2; }
    [[ -z "$STATE_NAME" ]] && { echo "--state-name required for update-state" >&2; exit 2; }

    TEAM_RESPONSE="$(graphql '
      query($key: String!) {
        teams(filter: { key: { eq: $key } }) {
          nodes { id }
        }
      }
    ' "$(jq -cn --arg key "$TEAM_KEY" '{key:$key}')")"

    TEAM_ID="$(echo "$TEAM_RESPONSE" | jq -r '.data.teams.nodes[0].id // empty')"
    [[ -z "$TEAM_ID" ]] && {
      echo "no Linear team found for key: $TEAM_KEY" >&2; exit 1
    }

    STATES_RESPONSE="$(graphql '
      query($teamId: ID!) {
        workflowStates(filter: { team: { id: { eq: $teamId } } }) {
          nodes { id name type }
        }
      }
    ' "$(jq -cn --arg teamId "$TEAM_ID" '{teamId:$teamId}')")"

    STATE_ID="$(echo "$STATES_RESPONSE" | jq -r \
      --arg name "$STATE_NAME" \
      '.data.workflowStates.nodes[] | select(.name == $name) | .id' | head -1)"
    [[ -z "$STATE_ID" ]] && {
      AVAILABLE="$(echo "$STATES_RESPONSE" | jq -r '.data.workflowStates.nodes[].name' | paste -sd', ' -)"
      echo "no workflow state named '$STATE_NAME' for team $TEAM_KEY. Available: $AVAILABLE" >&2
      exit 1
    }

    UPDATE_RESPONSE="$(graphql '
      mutation($issueId: String!, $stateId: String!) {
        issueUpdate(id: $issueId, input: { stateId: $stateId }) {
          success
          issue { state { name } }
        }
      }
    ' "$(jq -cn --arg issueId "$ISSUE_ID" --arg stateId "$STATE_ID" \
        '{issueId:$issueId, stateId:$stateId}')")"

    SUCCESS="$(echo "$UPDATE_RESPONSE" | jq -r '.data.issueUpdate.success')"
    if [[ "$SUCCESS" != "true" ]]; then
      echo "Linear issue state update failed" >&2
      exit 1
    fi

    echo "$UPDATE_RESPONSE" | jq -c '{
      success: true,
      state: .data.issueUpdate.issue.state.name
    }'
    ;;
  *)
    echo "unknown mode: $MODE (expected: create-issue, update-state)" >&2
    exit 2
    ;;
esac
