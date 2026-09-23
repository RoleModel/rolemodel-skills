---
name: cloud66-deploy-v2
description: The full Cloud 66 Deploy v2 documentation, mirrored locally as Markdown. Use whenever a task touches Cloud 66 — deploying, provisioning servers or clusters, `service.yml` or `manifest.yml`, deploy hooks, the `cx` toolbelt, databases, load balancers, firewalls, SSL, env vars, build minutes, the Cloud 66 API or MCP server — or when the user mentions Cloud 66, c66, cx, BuildGrid, or asks how a Cloud 66 feature behaves. Read from here instead of recalling Cloud 66 behavior from memory or fetching help.cloud66.com.
---

# Cloud 66 Deploy v2

All 300 pages of <https://help.cloud66.com/deploy/2/>, mirrored as Markdown so
you can read them without a network round trip.

**This is v2, not v3.** The two versions differ in architecture — v2 clusters
are coupled to their servers; v3 is Kubernetes-native with node pools and
RA/HA cluster types. Confirm which version an application runs on before
relying on this. See
[Deploy v2 vs v3](references/getting-started/deploy-v2-vs-v3.md). Anything a v3
page says may not hold here.

## How to use it

1. Open [INDEX.md](INDEX.md) and find the page by title. It lists all 300 pages
   grouped into the documentation's own sections, each with its local path and
   its canonical URL.
2. Read that one file. Pages cross-link to each other with relative paths, so
   you can follow a link straight to the next file.
3. If no title matches, grep `references/` for the term — the manifest and
   toolbelt sections in particular name their pages after the key or command
   they document (`references/manifest/_database-groups.md`,
   `references/toolbelt/_containers-list.md`).

Cite the canonical URL, not the local path, when answering the user.

## Where to look first

| Question | Section |
| --- | --- |
| What a `service.yml` key does | `references/build-and-config/` |
| What a `manifest.yml` key does | `references/manifest/` |
| A `cx` command's flags | `references/toolbelt/` |
| Deploy hooks syntax and lifecycle | `references/deploy-hooks/` |
| Servers, clusters, scaling, tagging | `references/servers/` |
| Postgres, backups, replicas | `references/databases/` |
| Firewalls, SSL, network config | `references/security/`, `references/networking/` |
| Rate limits, supported versions, SLAs | `references/specs-and-policies/` |

## The repo you are in

These pages describe what Cloud 66 supports, not what a given project does with
it. For that, read the project's own `.cloud66/` directory (`service.yml`,
`manifest.yml`, `deploy_hooks.yml`) and any Cloud 66 wrapper scripts or docs it
ships. Where the two disagree, the repo wins — it is the deployed
configuration.

## Refreshing

Cloud 66 publishes every documentation page as Markdown at the same URL with
`.md` appended. To re-mirror the set:

```bash
ruby ~/.agents/skills/cloud66-deploy-v2/scripts/refresh.rb
```

It reads the sitemap, downloads every `/deploy/2/` page, rewrites the
documentation's internal router links (`/:product/:version?/...`) to relative
paths, and rebuilds `INDEX.md`.
