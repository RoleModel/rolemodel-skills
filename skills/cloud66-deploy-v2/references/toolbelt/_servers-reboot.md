# servers reboot


Reboot a specific server.

```shell
$ cx servers reboot --stack <application name> --server <server name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--server <server name>` | yes | — | The name of the server to reboot |

#### Examples

```shell
$ cx server reboot --stack my-app --server lion
```