# Approving sensitive MCP actions


## Why there's a second step

Scopes decide what an agent is *allowed* to do. For a small number of tools that isn't enough — a
mistaken or manipulated prompt shouldn't be able to delete an application or attach a cloud provider
account. Those tools are **approval-gated**: every single call is paused until you confirm it in
your browser.

| Tool | What it does | Confirmation |
|---|---|---|
| `delete_application` | Permanently deletes an application and its resources | Approve in browser, with 2FA |
| `delete_deployment_profile` | Deletes a deployment profile | Approve in browser, with 2FA |
| `create_cloud` | Registers a cloud provider account | Enter the provider credentials in your browser |

Approval is enforced by the server, not by the agent. There is no prompt, tool argument or client
setting that can skip it.

## What the flow looks like

1. **You ask the agent to do something destructive** — for example, *"delete the old staging app"*.
2. **Your agent shows a prompt** containing a one-time Cloud 66 URL, and waits.
3. **You open the URL.** Cloud 66 shows exactly what's about to happen: the client that asked, the
   action, the account, the resource's friendly name, the IP address the request came from, and a
   countdown.
4. **You confirm.** For the delete tools you click **Approve** and complete two-factor
   authentication. For `create_cloud` you fill in the provider credential form.
5. **The agent's tool call resumes** and reports the result.

If you click **Deny**, close the browser tab, or let the countdown run out, the action doesn't
happen and the agent is told it wasn't approved.

Approve based on what the Cloud 66 page says, not what the agent told you it was doing. The page is
rendered by Cloud 66 from the actual tool arguments and is the authoritative description of the
action.

## The five-minute window

Approval prompts expire **five minutes** after they're created. The page shows a live countdown.
Once it expires the agent gets a "prompt expired" error and has to ask again — nothing is left in a
half-applied state.

You can have at most **five pending approvals** at once. Resolve some before asking for more.

## Registering a cloud provider

`create_cloud` works differently from the delete tools, because the sensitive part isn't the
decision — it's the credentials.

The agent supplies only a **name** and a **provider type** (AWS, DigitalOcean, Google Cloud, Azure,
Linode, Vultr or Hetzner). Cloud 66 then sends you to a browser form to enter the provider
credentials yourself. The keys go straight from your browser to Cloud 66; the agent never sees them
and cannot supply them.

Because provisioning a cloud takes time, the tool is asynchronous: once you submit the form, the
agent receives an **operation handle** and polls it with `get_operation`. The new cloud's ID appears
when the operation succeeds.

No Cloud 66 tool ever asks for cloud provider keys as a tool argument. If an agent asks you to paste
credentials into the conversation, stop — that isn't how this works.

## Requirements

**Your MCP client must support elicitation.** This is the part of the MCP standard that lets a
server ask the user a question mid-call. Without it, Cloud 66 has no way to deliver the approval
prompt and approval-gated tools fail immediately with a clear message. Claude Desktop and Claude
Code support elicitation; some other clients don't yet.

**You must have two-factor authentication enabled** for the delete tools. The approval page requires
a fresh 2FA check, so an account with no TOTP or security key can never complete one. If you don't
have 2FA set up, the tool fails straight away and points you at
[Enabling two-factor authentication](../account/two-factor-authentication.md).
`create_cloud` doesn't require 2FA, because the credential form is its own confirmation.

## Things that cancel an approval

An in-flight approval is abandoned — safely, without running the action — if:

- You deny it, or the five-minute window expires.
- You close the agent's prompt, or the agent cancels the request.
- The MCP session ends (you disconnect the connector, or the client sends a session termination).
- Your access token is revoked while the approval is pending.
- The Cloud 66 MCP server restarts. The agent is told to retry.

In every case the agent gets an explicit error rather than silence, and the outcome is recorded in
your [audit log](../account/audit-logs.md).

## Everything else

Tools that aren't in the table above run immediately, subject to your token's scopes and your role
permissions. That includes tools that change things — `create_deployment`,
`update_deployment_profile`, `create_csv3_cluster` and `create_csv3_application`. If you'd rather an
agent couldn't do those at all, don't grant the corresponding scopes when you
[authorize it](../mcp/permissions-and-scopes.md).