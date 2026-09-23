# failover-groups list


Lists the Failover Groups for a Cloud 66 account. Info includes the Failover Group ID, address, attached applications and current active application.

```shell
$ cx failover-groups list [--output <view>]
```

#### Options

| Arguments | Required? | Default | Description |
| --- | --- | --- | --- |
| `--output, -o <view>` | no | standard | Tailor the output view (standard or wide) |

#### Examples

```shell
$ cx failover-groups list -o wide
```