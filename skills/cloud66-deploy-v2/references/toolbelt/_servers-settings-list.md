# servers settings list


Lists all the settings applicable to the given server. It also shows the key, value and the readonly flag for each setting. Settings can be a list of multiple `<setting>` arguments. To change each server setting, use the server-set command.

```shell
$ cx servers settings list --stack <application name> --server <server name> <setting>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--server <server name>` | yes | — | The name of the server to query |
| `<setting>` | no | — | The specific setting(s) to fetch (supports multiples) |

#### Examples

```shell
$ cx servers settings list -s mystack --server lion
server.name lion readonly
disk.space.alert.threshold  80  read/write

$ cx servers settings list -s mystack --server db server.name
server.name tiger readonly
```