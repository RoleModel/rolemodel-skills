# processes pause


Pauses all processes for the given service and/or server.

```shell
$ cx processes pause --stack <application name> [--server <server name>] [<process name>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Full or partial name of the application |
| `--server <server name>` | no | — | The name of the server to query |
| `<process name>` | no | — | The name of a specific process to be paused |

#### Examples

```shell
$ cx processes pause -s mystack a_backend_process
$ cx processes pause -s mystack --server my_server
$ cx processes pause -s mystack --server my_server a_backend_process
```