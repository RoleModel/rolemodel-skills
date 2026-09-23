# MCP permissions and scopes


## Two layers of permission

An agent's access is the **intersection** of two things:

1. **The scopes on its token** — what you ticked on the consent screen.
2. **Your own Cloud 66 permissions** — the role you have in the account.

Scopes can only narrow what you can already do. Granting `application:delete` to an agent does not
let it delete an application you have no permission to delete; the tool call fails with a permission
error. Conversely, being an account owner doesn't help an agent whose token lacks the scope — the
tool won't even appear in its tool list.

The server only advertises tools your token is scoped for. An agent with read-only scopes genuinely
cannot see that `delete_application` exists.

## Scope format

Scopes are written `resource:action`, using the same vocabulary as the Cloud 66 API:

| Action | Meaning |
|---|---|
| `list` | List records of this type |
| `get` | Read a single record's details |
| `post` | Create a record |
| `put` | Update a record |
| `delete` | Delete a record |

For example, `deployment:post` allows triggering a deployment, and `server:list` allows listing
servers.

## Default scopes

If your MCP client doesn't ask for anything specific, Cloud 66 requests a **read-only** default set:

```
account:list      account:get
application:list  application:get
server:list       server:get
deployment:list   deployment:get
```

That's enough for an agent to explore your account, inspect applications and servers, and report on
deployments — but not to change anything.

Clients that need more (for example, to deploy) request additional scopes, and those appear on the
consent screen for you to approve or untick.

## Scopes used by the MCP tools

| Scope | Unlocks |
|---|---|
| `account:list` | `list_accounts` |
| `account:get` | `get_account` |
| `me:list` | `get_me` |
| `application:list` | `list_applications` |
| `application:get` | `get_application` |
| `application:post` | `create_csv3_application` |
| `application:delete` | `delete_application` |
| `server:list` | `list_servers` |
| `server:get` | `get_server` |
| `server_group:list` | `list_server_groups` |
| `server_group:get` | `get_server_group` |
| `server_pool:list` | `list_server_pools` |
| `deployment:list` | `list_deployments` |
| `deployment:get` | `get_deployment`, `get_deployment_logs` |
| `deployment:post` | `create_deployment` |
| `deployment_profile:list` | `list_deployment_profiles` |
| `deployment_profile:get` | `get_deployment_profile` |
| `deployment_profile:post` | `create_deployment_profile` |
| `deployment_profile:put` | `update_deployment_profile` |
| `deployment_profile:delete` | `delete_deployment_profile` |
| `cloud:list` | `list_clouds` |
| `cloud:get` | `get_cloud`, `list_cloud_regions`, `list_cloud_sizes` |
| `cloud:post` | `create_cloud` |
| `cluster:list` | `list_clusters` |
| `cluster:get` | `get_cluster` |
| `cluster:post` | `create_csv3_cluster` |
| `cluster_database:list` | `list_cluster_databases` |
| `dns_provider:list` | `list_dns_providers` |
| `dns_provider:get` | `get_dns_provider` |
| `operation:get` | `get_operation` |

The server accepts the wider Cloud 66 API scope vocabulary (backups, databases, firewall rules,
environment variables, SSL certificates and so on), so scopes you approve today will keep working as
more tools are added. Only the scopes above map to a tool right now.

## Choosing scopes on the consent screen

The consent screen groups permissions by resource and pre-ticks everything the client asked for.
Before approving:

- **Untick anything the agent doesn't need.** You can always re-authorize later with more.
- **Be deliberate about `post`, `put` and `delete`.** These create, change and remove real
  infrastructure.
- **Check the client name.** It's supplied by the client during registration, so treat it as a hint,
  not proof of identity. Only approve a flow you started yourself.

You must approve at least one scope; approving none cancels the request.

## Reviewing and revoking access

To see which agents have access:

1. Click your avatar at the top right of your Dashboard and choose **Account Settings**.
2. Open **Access Tokens**, then the **AI agent access** tab.

For each connected client you can:

- **View its scopes** — exactly what that token can do.
- **Revoke** — kill the token immediately. The agent's next tool call fails and it must
  re-authorize to reconnect.

If you're unsure about an agent's activity, revoke its access. Revocation takes effect immediately —
even for a tool call that's mid-approval — and you can always reconnect afterwards.

## Token lifetime

Access tokens expire **7 days** after they're issued, and re-authorizing a client revokes its
previous token. Authorization codes are single-use and expire after 10 minutes.

Your MCP client can also revoke its own token at
`https://app.cloud66.com/mcp/oauth/token/revoke`; well-behaved clients do this when you remove the
connector.

## Auditing

Authorizations, denials, approval requests and their outcomes are all written to your
[account audit log](../account/audit-logs.md), along with the IP address the agent
called from.