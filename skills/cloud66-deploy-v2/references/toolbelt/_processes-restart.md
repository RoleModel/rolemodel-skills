# processes restart


Restarts all processes on the given service and/or server.

```shell
$ cx processes restart --stack <application name> [--server <server name>] [<process name>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Full or partial name of the application |
| `--server <server name>` | no | — | The name of the server to use |
| `<process name>` | no | — | The name of a process |

#### Examples

```shell
$ cx processes restart -s mystack a_backend_process
$ cx processes restart -s mystack --server my_server
$ cx processes restart -s mystack --server my_server a_backend_process
```