# logs


Top-level alias for [`cx operations logs`](../toolbelt/_operations-logs.md). Fetches log output for any async operation (deployment, SSL setup, load balancer changes, archive/restore, etc.) by its operation `uid`.

```shell
$ cx logs <uid> [--min-severity <level>] [--include-children] [--format text|json]
```

This command shares its flags, behaviour, and output formats with `cx operations logs`. See the [`operations logs` reference](../toolbelt/_operations-logs.md) for the full option table and output description.

#### Examples

```shell
$ cx logs c4dc7c9f53d44856adba9c
$ cx logs c4dc7c9f53d44856adba9c --include-children
$ cx logs c4dc7c9f53d44856adba9c --include-children -m warn
$ cx logs c4dc7c9f53d44856adba9c --format json
```