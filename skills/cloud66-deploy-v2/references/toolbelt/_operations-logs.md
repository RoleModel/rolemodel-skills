# operations logs


Fetches log output for any async operation (deployment, SSL setup, load balancer changes, archive/restore, etc.) by its operation `uid`. The same command is also available as the top-level alias `cx logs <uid>`.

```shell
$ cx operations logs <uid> [--min-severity <level>] [--include-children] [--format text|json]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `<uid>` | yes | — | The operation uid to fetch logs for |
| `--min-severity, -m <level>` | no | — | Minimum severity to include. Accepts a name (`trace`, `debug`, `info`, `notice`, `warn`, `error`) or an integer `0..5`. When omitted, all severities are returned. |
| `--include-children` | no | `false` | Aggregate logs from any child operations spawned by the parent operation. When enabled, the text format adds an operation-uid column and indents nested entries by echelon. |
| `--format <format>` | no | `text` | Output format. `text` is human-readable; `json` emits a single-line array suitable for piping into tools like `jq`. |

#### Output

In `text` mode each line is rendered as:

```
<RFC3339 timestamp>  [<SEVERITY>]  [<operation uid>  | ]<message>
```

The severity label is right-aligned to 6 characters (the width of `NOTICE`). When `--include-children` is enabled, each row also shows the operation uid that produced the entry — root-level entries fall back to the uid you supplied. When `--include-children` is **off**, the uid column and pipe separator are dropped entirely and no indentation is applied.

In `json` mode, each entry has `severity` (lowercase name), `message`, `timestamp`, `echelon`, and — only when `--include-children` is on — `operation_uid`.

#### Examples

```shell
$ cx operations logs c4dc7c9f53d44856adba9c
$ cx operations logs c4dc7c9f53d44856adba9c --include-children
$ cx operations logs c4dc7c9f53d44856adba9c --include-children -m warn
$ cx operations logs c4dc7c9f53d44856adba9c --format json
$ cx operation logs c4dc7c9f53d44856adba9c    # singular alias
$ cx logs c4dc7c9f53d44856adba9c              # flat top-level alias
```