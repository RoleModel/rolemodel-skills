# services list


List all the services and running containers of a whole application or a specific server.

```shell
$ cx services list --stack <application name> [--server <server name>] [<service name>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--server <server name>` | no | — | The name of a server to query |
| `<service name>` | no | — | The service to query |

#### Examples

```shell
$ cx services list -s mystack
$ cx services list -s mystack --server orca
$ cx services list -s mystack --server orca --service web
$ cx services list -s mystack --service web
```