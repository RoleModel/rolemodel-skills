# Connecting your AI agent


## Before you start

You need:

- A Cloud 66 account, and membership of at least one team account you want the agent to work with.
- An MCP client that supports **remote (HTTP) MCP servers** with OAuth. Claude Desktop, Claude Code
  and most current MCP clients do.
- [Two-factor authentication](../account/two-factor-authentication.md) enabled on your
  Cloud 66 account, if you want the agent to be able to run destructive tools. Read-only use doesn't
  require it.

The server endpoint is:

```
https://app.cloud66.com/mcp
```

## Connect Claude Code

From a terminal:

```bash
claude mcp add --transport http cloud66 https://app.cloud66.com/mcp
```

Then start Claude Code and run `/mcp`. Claude will prompt you to authenticate; approving opens the
Cloud 66 consent screen in your browser.

## Connect Claude Desktop

1. Open **Settings** → **Connectors**.
2. Click **Add custom connector**.
3. Name it `Cloud 66` and set the URL to `https://app.cloud66.com/mcp`.
4. Click **Add**, then **Connect**. Your browser opens the Cloud 66 consent screen.

## Connect any other MCP client

The server implements the standard remote-MCP discovery chain, so a spec-compliant client needs
nothing beyond the endpoint URL. If your client asks for details explicitly:

| Setting | Value |
|---|---|
| Transport | Streamable HTTP |
| Server URL | `https://app.cloud66.com/mcp` |
| Protocol version | `2025-06-18` |
| Authorization | OAuth 2.1, authorization code + PKCE (`S256`) |
| Protected resource metadata | `https://app.cloud66.com/.well-known/oauth-protected-resource/mcp` |
| Authorization server metadata | `https://app.cloud66.com/.well-known/oauth-authorization-server/mcp/oauth` |
| Authorization endpoint | `https://app.cloud66.com/mcp/oauth/authorize` |
| Token endpoint | `https://app.cloud66.com/mcp/oauth/token` |
| Revocation endpoint | `https://app.cloud66.com/mcp/oauth/token/revoke` |
| Registration endpoint | `https://app.cloud66.com/mcp/oauth/register` |

The server supports Dynamic Client Registration (RFC 7591), so your client registers itself the
first time it connects. There is nothing to create in the Cloud 66 dashboard beforehand.

## What happens when you connect

1. Your client calls the MCP endpoint without a token and gets a `401` telling it where to find the
   authorization server.
2. Your client registers itself (if it hasn't already) and opens the Cloud 66 **consent screen** in
   your browser.
3. You sign in to Cloud 66 if you aren't already, review the requested permissions, untick anything
   the agent shouldn't have, and click **Approve permissions**.
4. Cloud 66 redirects back to your client with an authorization code, which it exchanges for an
   access token.
5. Your client connects, and the agent can see the tools your token is scoped for.

Re-authorizing the same client revokes its previous token. If you connect the same agent on a second
machine, the first machine's connection stops working and needs to reconnect.

## First steps after connecting

Cloud 66 organises everything under **accounts**, so almost every tool needs an account ID. Ask your
agent to list your accounts first:

> *"List my Cloud 66 accounts."*

The agent calls `list_accounts`, and uses the returned account ID for everything after that. A good
opening prompt to check the connection end-to-end:

> *"List my Cloud 66 accounts, then show me the applications in the first one."*

## Keeping the connection healthy

- Access tokens last **7 days**. When one expires, your client re-runs the authorization flow — you
  approve once in the browser and carry on.
- You can revoke access at any time from **Account Settings → AI agent access**. See
  [Permissions and scopes](../mcp/permissions-and-scopes.md).
- If the agent needs to run a destructive tool, it needs an **open MCP session** with elicitation
  support so Cloud 66 can send the approval prompt. Most clients handle this automatically; see
  [Approving sensitive actions](../mcp/approving-sensitive-actions.md).

If something goes wrong, see [Troubleshooting](../mcp/troubleshooting.md).