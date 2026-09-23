# failover groups delete


Deletes an existing Failover Group from a Cloud 66 account.

```shell
$ cx failover-groups delete --uid <failover UID>
```

#### Options

| Arguments | Required? | Default | Description |
| --- | --- | --- | --- |
| `--uid <failover UID>` | yes | — | The UID of the Failover Group to be deleted. |

#### Examples

```shell
$ cx failover-groups delete --uid "5999b763474b0eafa5fafb64bff0ba80"
```