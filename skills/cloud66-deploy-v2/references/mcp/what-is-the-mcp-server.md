# The Cloud 66 MCP server


## Overview

[MCP (Model Context Protocol)](https://modelcontextprotocol.io) is an open standard that lets AI
assistants call tools on external systems. Cloud 66 runs an MCP server, so an MCP-capable AI client
— Claude Desktop, Claude Code, or any other client that speaks the protocol — can work with your
Cloud 66 account on your behalf.

Once connected, you can ask your agent things like:

- *"Which of my applications haven't been deployed in the last month?"*
- *"Deploy the `main` branch of my staging app and tell me when it's done."*
- *"Why did the last deployment of my API fail?"*
- *"Create a new cluster on my Hetzner cloud with three worker nodes."*

The agent answers by calling Cloud 66 tools, not by guessing. Everything it does runs as **you**,
with your account permissions, and appears in your account's audit log.

The Cloud 66 MCP server lives at `https://app.cloud66.com/mcp`. Most clients only need this one URL —
authorization is discovered and completed automatically. See
[Connecting your AI agent](../mcp/connecting-your-ai-agent.md).

## What the agent can do

The server exposes 33 tools, covering:

| Area | What the agent can do |
|---|---|
| **Accounts** | List the accounts you belong to and read their details |
| **Applications** | List and inspect applications, and delete them (with approval) |
| **Deployments** | List deployments, read a deployment and its logs, and trigger new deployments |
| **Deployment profiles** | List, read, create, update and delete deployment profiles |
| **Servers** | List and inspect servers and server groups |
| **Clouds** | List and inspect cloud provider credentials, browse regions and server sizes, and register new clouds (with approval) |
| **Clusters** | List and inspect clusters, their databases and server pools, and create new clusters and applications on them |
| **DNS providers** | List and inspect DNS providers |
| **Operations** | Poll the status of long-running work such as deployments and cluster builds |

The full list, with arguments and required permissions, is in the
[Tool reference](../mcp/tools-reference.md).

The cluster and cluster-application tools (`create_csv3_cluster`, `create_csv3_application`,
`list_server_pools`, `list_cluster_databases`) build and manage
[Cloud 66 Deploy v3](../getting-started/deploy-v2-vs-v3.md) native Kubernetes
clusters. The remaining tools work across all Cloud 66 products.

## How access works

Access is granted by you, in your browser, and is limited in three independent ways:

1. **OAuth authorization.** Your agent never sees your password. It gets an access token through a
   standard OAuth 2.1 flow with PKCE, which you approve on a Cloud 66 consent screen.
2. **Scopes.** On that consent screen you choose exactly which permissions the agent gets — for
   example read-only access to applications and deployments, but nothing that can delete. Tools the
   token isn't scoped for don't even appear in the agent's tool list. See
   [Permissions and scopes](../mcp/permissions-and-scopes.md).
3. **Your own role permissions.** Scopes can only ever narrow what you can already do. If your
   Cloud 66 role doesn't let you deploy an application, neither can your agent.

On top of that, the most sensitive actions — deleting an application, deleting a deployment profile,
and registering a cloud provider — require a **second, in-browser confirmation** every single time
they're called. See [Approving sensitive actions](../mcp/approving-sensitive-actions.md).

## What the agent never sees

- **Your password.** Authorization happens in your browser, against Cloud 66.
- **Your cloud provider credentials.** When you ask an agent to register a cloud, it can't accept
  the keys. Cloud 66 sends you to a browser form to enter them, and only the resulting operation
  handle goes back to the agent.
- **Other people's accounts.** Every tool call is scoped to an account you're a member of. Requests
  for anything else return "not found".

## Auditing

Every MCP action is written to your account's [audit log](../account/audit-logs.md)
with a source of `mcp`, including approval requests and their outcomes. Authorizing or denying an
MCP client is logged too.

## Limits

| Limit | Value |
|---|---|
| Access token lifetime | 7 days |
| Authorization code lifetime | 10 minutes |
| Approval prompt lifetime | 5 minutes |
| Concurrent MCP sessions per user | 10 |
| Pending approvals per user | 5 |
| Results per page (list tools) | 25 by default, 100 maximum |

## Next steps

- [Connect your AI agent](../mcp/connecting-your-ai-agent.md)
- [Choose permissions and scopes](../mcp/permissions-and-scopes.md)
- [Understand the approval flow](../mcp/approving-sensitive-actions.md)
- [Browse the tool reference](../mcp/tools-reference.md)