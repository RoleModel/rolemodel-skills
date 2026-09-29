# Troubleshooting the MCP server


## Connection problems

### The client can't connect, or keeps asking me to log in

Check the URL is exactly `https://app.cloud66.com/mcp`, with no trailing slash or path. If your
client offers a transport choice, pick **Streamable HTTP** (not SSE, and not stdio).

If the browser window opens but the connection never completes, the redirect back to your client
was blocked. Try again in your default browser rather than a private window.

### `Bearer token required` (HTTP 401)

Your client has no valid token — usually because the token expired (they last 7 days) or was
revoked. Reconnect the connector and approve the consent screen again.

If it happens right after you connected a *second* copy of the same client, that's expected:
re-authorizing a client revokes its previous token. Reconnect the machine that stopped working.

### `Session not found; please re-initialize.` (HTTP 404)

Your session expired or was served by a different server instance. Well-behaved clients recover on
their own by starting a new session; if yours doesn't, disconnect and reconnect the connector.

### `Server temporarily busy. Retry shortly.` (HTTP 503)

The MCP server is shedding load. Clients retry automatically — wait a few seconds and ask again.

### HTTP 429 when connecting

You have too many MCP sessions open at once (the limit is 10 per user). Close some connectors, or
wait for stale sessions to age out, then retry.

### `Unsupported MCP-Protocol-Version`

Your client is pinned to a protocol revision the server doesn't speak. The server supports
`2025-06-18`. Update your MCP client.

---

## Missing or failing tools

### The agent says it can't see a Cloud 66 tool

Tools are hidden unless your token carries the matching scope. Check what you approved under
**Account Settings → Access Tokens → AI agent access**. If the scope is missing, disconnect and
reconnect the connector, and tick the permission on the consent screen.

The [tool reference](../mcp/tools-reference.md) lists the scope each tool needs.

### `Token missing scope: <resource>:<action>`

Same cause as above, for a tool the agent could see but not run. Reconnect and approve the scope.

### `Missing required argument: account_id`

Every tool except `list_accounts` needs an account. Ask the agent to list your accounts first, then
retry.

### `Account not found or access denied`

The account ID doesn't belong to you, or the agent invented it. Ask it to call `list_accounts` and
use a real ID.

### `The caller does not have permission to …`

Your token's scopes are fine, but *your* Cloud 66 role doesn't allow the action on that resource.
Scopes can never grant more than you already have. Ask an account owner to adjust your permissions,
or have them run the action.

### `Application not found` / `Cluster not found` / `Deployment not found`

The UID doesn't exist in the account you passed. Agents sometimes reuse an ID from an earlier,
different account — ask it to re-list the resources for the account you're working in.

### `Validation failed: …`

The arguments didn't satisfy the underlying Cloud 66 contract. The message names the offending
field; tell the agent what to correct. Common cases are cluster topologies that break the
[availability rules](../mcp/tools-reference.md) and cloud sizes or regions that
aren't offered by the chosen cloud.

---

## Approval problems

### `this tool requires an MCP client with elicitation support`

Destructive tools need a client that can show a server-initiated prompt. Your client doesn't support
elicitation, so Cloud 66 can't ask you to confirm. Use a client that does (Claude Desktop and Claude
Code both do), or perform the action from the Cloud 66 dashboard.

### `This action requires a browser 2FA confirmation, but this account has no two-factor authentication set up`

Deleting an application or a deployment profile requires a fresh two-factor check. Enable
[two-factor authentication](../account/two-factor-authentication.md) on your account,
then retry.

### `Open GET /mcp before calling destructive tools so the server can deliver the approval prompt`

The server had nowhere to send the approval prompt because your client isn't holding an open MCP
session. Reconnect the connector and retry.

### `The browser approval prompt expired before the user responded`

Approvals live for five minutes. Retry and complete the browser step within the countdown.

### `You accepted the elicitation, but the user did not complete the 2FA confirmation in the browser`

You clicked OK in the agent, but never finished the browser page. Retry the tool call — you'll get a
fresh prompt — and complete the approval in the browser this time.

### `Too many pending approvals; resolve some before requesting another`

You can only have five approvals outstanding at once. Approve, deny or wait out the existing ones.

### The approval page says the request is gone (HTTP 410)

The approval was already resolved, denied or expired. Ask the agent to try again.

### `Session was terminated; the destructive action was not performed`

The MCP session ended while the approval was pending — usually because the connector was removed or
the client restarted. Nothing happened. Reconnect and retry if you still want the action.

### `OAuth token was revoked during approval; please re-authenticate`

Access was revoked mid-approval. The action did not run. Reconnect the connector.

### `Server is restarting; please retry`

The MCP server was restarted while your approval was pending. Nothing happened — just retry.

---

## Behaviour that isn't a bug

### The agent got an operation handle instead of a result

Deployments, cluster creation, cluster applications and cloud registration are asynchronous. The
tool returns an operation ID and the agent polls `get_operation` until it finishes. Ask the agent to
check the operation's status.

### The agent only returned 25 results

That's the default page size. Ask for more (up to 100 per page) or ask it to fetch the next page —
list tools return a cursor for exactly this.

### The agent can't paste my cloud credentials

By design. `create_cloud` never accepts provider keys as an argument; you enter them in a Cloud 66
browser form. See
[Approving sensitive actions](../mcp/approving-sensitive-actions.md).

---

## Still stuck?

Check your [audit log](../account/audit-logs.md) — MCP activity is recorded there with
a source of `mcp`, including approval requests and their outcomes, which is often the quickest way
to see what the agent actually attempted. If you still need help, contact Cloud 66 support with the
approximate time of the failure and the tool name.