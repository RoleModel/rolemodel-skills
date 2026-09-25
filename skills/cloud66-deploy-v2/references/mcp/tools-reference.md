# MCP tool reference


## How to read this page

Each tool lists the **arguments** it takes and the **scope** its token needs. Tools your token isn't
scoped for don't appear in your agent's tool list at all — see
[Permissions and scopes](../mcp/permissions-and-scopes.md).

A few conventions apply throughout:

- **Every tool except `list_accounts` requires `account_id`.** Call `list_accounts` first to get one.
- **IDs are UIDs**, not database numbers. Get them from the corresponding `list_` tool.
- **"Applications"** are what the API and dashboard also call stacks.
- **List tools are paginated.** They all accept `limit` (default 25, maximum 100), `starting_after`,
  `ending_before` and `sort_direction` (`asc` or `desc`). Cursors come from the previous response's
  `next_cursor` / `previous_cursor`.
- **Approval-gated tools** pause until you confirm them in your browser. See
  [Approving sensitive actions](../mcp/approving-sensitive-actions.md).

---

## Accounts and identity

### `list_accounts`

Lists every Cloud 66 account you belong to. This is the starting point for everything else.

- **Arguments:** pagination only
- **Scope:** `account:list`

### `get_account`

Returns the details of one account.

- **Arguments:** `account_id`
- **Scope:** `account:get`

### `get_me`

Returns your own user profile.

- **Arguments:** `account_id`
- **Scope:** `me:list`

---

## Applications

### `list_applications`

Lists the applications in an account, optionally filtered.

- **Arguments:** `account_id`; optional `environment` (for example `production`), `name`, pagination
- **Scope:** `application:list`

### `get_application`

Returns the details of one application.

- **Arguments:** `account_id`, `application_id`
- **Scope:** `application:get`

### `delete_application`

Permanently deletes an application and all its resources. This cannot be undone.

- **Arguments:** `account_id`, `application_id`
- **Scope:** `application:delete`
- **Requires browser approval with two-factor authentication**

---

## Deployments

### `list_deployments`

Lists recent deployments for an application, with their status.

- **Arguments:** `account_id`, `application_id`; optional pagination
- **Scope:** `deployment:list`

### `get_deployment`

Returns the details of one deployment.

- **Arguments:** `account_id`, `deployment_id`
- **Scope:** `deployment:get`

### `get_deployment_logs`

Returns log entries for a deployment, with timestamps and severity levels.

- **Arguments:** `account_id`, `deployment_id`; optional `include_children` (default `true`),
  pagination
- **Scope:** `deployment:get`

### `create_deployment`

Deploys an application. Either name a deployment profile, or pass individual deployment parameters —
not both.

- **Arguments:** `account_id`, `application_id`; optional `deployment_profile` (mutually exclusive
  with the parameters below), `git_ref` (branch, tag or commit SHA — not for container
  applications), `services` (container applications only, as `name` or `name:tag`),
  `deploy_strategy`, `rollout_strategy`, `canary_percentage` (0–100, canary rollouts only)
- **Scope:** `deployment:post`
- **Asynchronous.** Returns an operation handle; poll it with `get_operation`.

---

## Deployment profiles

### `list_deployment_profiles`

Lists the deployment profiles defined on an application.

- **Arguments:** `account_id`, `application_id`; optional pagination
- **Scope:** `deployment_profile:list`

### `get_deployment_profile`

Returns the details of one deployment profile.

- **Arguments:** `account_id`, `deployment_profile_id`
- **Scope:** `deployment_profile:get`

### `create_deployment_profile`

Creates a deployment profile on an application.

- **Arguments:** `account_id`, `application` (the application UID), `name` (unique within the
  application); optional `deploy_strategy`, `rollout_strategy`, `canary_percentage`,
  `git_reference`, `builds` and `publishes` (container applications only), and the deploy toggles
  `apply_security_upgrades`, `apply_infrastructure_upgrades`, `force_infrastructure_upgrades`,
  `auto_update_docker_versions`, `pause_and_unpause_jobs`, `run_deploy_command`, `reboot_servers`,
  `take_server_snapshots`
- **Scope:** `deployment_profile:post`

### `update_deployment_profile`

Updates an existing deployment profile. The default profile can't be modified.

- **Arguments:** `account_id`, `deployment_profile_id`; the same optional fields as
  `create_deployment_profile`, plus `name` to rename it (`canary_percentage` here is 1–99)
- **Scope:** `deployment_profile:put`

### `delete_deployment_profile`

Deletes a deployment profile. The default profile can't be deleted.

- **Arguments:** `account_id`, `deployment_profile_id`
- **Scope:** `deployment_profile:delete`
- **Requires browser approval with two-factor authentication**

---

## Servers

### `list_servers`

Lists the servers belonging to an application.

- **Arguments:** `account_id`, `application_id`; optional pagination
- **Scope:** `server:list`

### `get_server`

Returns the details of one server.

- **Arguments:** `account_id`, `server_id`
- **Scope:** `server:get`

### `list_server_groups`

Lists an application's server groups — the roles servers are organised by, such as web, database or
process.

- **Arguments:** `account_id`, `application_id`; optional pagination
- **Scope:** `server_group:list`

### `get_server_group`

Returns the details of one server group.

- **Arguments:** `account_id`, `server_group_id`
- **Scope:** `server_group:get`

---

## Clouds

### `list_clouds`

Lists the cloud provider credentials registered on an account.

- **Arguments:** `account_id`; optional pagination
- **Scope:** `cloud:list`

### `get_cloud`

Returns the details of one cloud.

- **Arguments:** `account_id`, `cloud_id`
- **Scope:** `cloud:get`

### `list_cloud_regions`

Lists the regions available for a cloud, from the local catalogue — no call is made to the provider.
Use it to pick a `region` for `create_csv3_cluster`.

- **Arguments:** `account_id`, `cloud_id`
- **Scope:** `cloud:get`

### `list_cloud_sizes`

Lists the server sizes available for a cloud in a given region, from the local catalogue. Use it to
pick sizes for `create_csv3_cluster` server templates.

- **Arguments:** `account_id`, `cloud_id`, `region`
- **Scope:** `cloud:get`

### `create_cloud`

Registers a cloud provider account. The agent supplies only a name and a provider type — you enter
the credentials in your browser.

- **Arguments:** `account_id`, `name` (3–60 characters, unique per provider within the account),
  `type` (one of `aws`, `digitalocean`, `googlecloud`, `azure_rm`, `linode`, `vultr`, `hetzner`)
- **Scope:** `cloud:post`
- **Requires the browser credential handoff.** Asynchronous — returns an operation handle to poll
  with `get_operation`; the new cloud's ID appears when the operation succeeds.

---

## DNS providers

### `list_dns_providers`

Lists the DNS providers configured on an account.

- **Arguments:** `account_id`; optional pagination
- **Scope:** `dns_provider:list`

### `get_dns_provider`

Returns the details of one DNS provider. Requires account ownership.

- **Arguments:** `account_id`, `dns_provider_id`
- **Scope:** `dns_provider:get`

---

## Clusters

The cluster tools work with
[Cloud 66 Deploy v3](../getting-started/deploy-v2-vs-v3.md) native Kubernetes
clusters.

### `list_clusters`

Lists the Kubernetes clusters in an account.

- **Arguments:** `account_id`; optional pagination
- **Scope:** `cluster:list`

### `get_cluster`

Returns the details of one cluster.

- **Arguments:** `account_id`, `cluster_id`
- **Scope:** `cluster:get`

### `list_server_pools`

Lists a cluster's server pools (its node pools).

- **Arguments:** `account_id`, `cluster_id`; optional pagination
- **Scope:** `server_pool:list`

### `list_cluster_databases`

Lists the managed databases running on a cluster.

- **Arguments:** `account_id`, `cluster_id`; optional pagination
- **Scope:** `cluster_database:list`

### `create_csv3_cluster`

Creates a new k3s cluster on an existing cloud.

- **Arguments:** `account_id`, `name` (3–60 characters, unique within the account for the
  environment), `cloud_id` (a DigitalOcean, Vultr or Hetzner cloud), `region` (a provider region ID
  from `list_cloud_regions`), `availability`, `server_templates`, `servers`; optional `environment`
  (default `production`) and cluster-level `vendor.config.network_identifier` to place the cluster
  in an existing private network (DigitalOcean and Hetzner only)
- **Scope:** `cluster:post`
- **Asynchronous.** Returns an operation handle; poll it with `get_operation`.

Node pools are described by two linked arrays:

- `server_templates[]` — named hardware specs, each `{ name, vendor: { type, config: { size } } }`.
  Sizes come from `list_cloud_sizes` for that cloud and region.
- `servers[]` — the pools themselves, each `{ role, template, count, name? }`, where `template`
  names a `server_templates[]` entry.

Every template must be used by at least one pool, and every pool must name a real template. Topology
depends on `availability`:

| `availability` | Rules |
|---|---|
| `reduced_availability` | Exactly one worker pool, no manager pool, single control-plane node |
| `high_availability` (recommended) | One or more worker pools, plus at most one manager pool with a count of 3, 5 or 7 and no name; worker sizes must be at least 2 vCPU / 2 GB |

Total worker nodes across all worker pools must be between 1 and 15. Worker pool names are lowercase
letters, digits and hyphens, and must be unique; manager pools must not have a name.

### `create_csv3_application`

Creates an application on an existing, deployed cluster — defining its services, databases and
environment variables — and then triggers a deployment.

- **Arguments:** `account_id`, `cluster_id`, `application_name` (max 60 characters); optional
  `environment` (`development`, `staging` or `production`, default `production`), `services`,
  `databases`, `environment_variables`
- **Scope:** `application:post`
- **Asynchronous.** Returns an operation handle; poll it with `get_operation`.

Each entry in `services[]` needs a `name` and a `source_type`:

- `source_type: "image"` — supply `image`.
- `source_type: "git"` — supply `git_repo`, `git_branch`, `build_root` and `dockerfile_path`.

Services also accept `command`, `desired_count`, `daemon_set`, `server_pool_ids`, `ports[]`
(`internal_port`, optional `external_port`, and `protocol` — `http`, `https`, `tcp`, `tcp_over_tls`
or `udp`) and `volume_mounts[]` (`mount_path`, and either `empty_dir` or a `storage_size_gb` plus
`storage_class_name`).

Each entry in `databases[]` either attaches an existing database by `existing_database_id` (from
`list_cluster_databases`), or creates a new one with `type`, `version`, `storage_size_gb`,
`storage_class_name` and optional `server_pool_ids`. Both forms accept `migration_command` and
`migration_service_name`.

---

## Operations

### `get_operation`

Returns the status of an asynchronous operation. Use it to follow deployments, cluster builds, cloud
registration and any other long-running work.

- **Arguments:** `account_id`, `operation_id`
- **Scope:** `operation:get`

Tools that return an operation handle tell the agent to poll this one, so in practice you'll see it
used automatically whenever you ask for something that takes time.