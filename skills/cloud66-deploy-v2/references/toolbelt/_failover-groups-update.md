# failover groups update


Updates an existing Failover Group on a Cloud 66 account.

```shell
$ cx failover-group update --uid <failover UID> [--primary <primary app>] [--secondary <secondary app>] [--current <app pointer>] [--no-primary] [--no-secondary]
```

#### Options

| Argument | Required? | Default | Description |
| --- | --- | --- | --- |
| `--uid <failover UID>` | yes | — | The UID of the Failover Group to be updated. |
| `--primary, -p <primary app>` | either/or | — | The name of the application which should be set as "primary" in the Failover Group. (The current value will not be updated if this is not specified) |
| `--secondary, -s <secondary app>` | either/or | — | The name of the application which should be set as "secondary" in the Failover Group. (The current value will not be updated if this is not specified) |
| `--current <current app>` | no | — | Sets the Failover Group to point at either the `primary` app - or the `secondary` app |
| `--no-primary` | no | — | Remove the current primary application from the Failover Group |
| `--no-secondary` | no | — | Remove the current secondary application from the Failover Group |

#### Examples

```shell
$ cx failover-group update --uid "5999b763474b0eafa5fafb64bff0ba80" -p my-main-app -s my-backup-app --current 2
```