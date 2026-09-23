# processes list


List the details of the processes running on an application or a server.

```shell
$ cx processes list --stack <application name> [--server <server name>] [--name <process name>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Full or partial name of the application |
| `--server <server name>` | no | — | The name of the server to query |
| `--name <process name>` | no | — | The name of a process |

#### Examples

```shell
$ cx processes list -s mystack
$ cx processes list -s mystack --server orca
$ cx processes list -s mystack --name worker
$ cx processes list -s mystack --server orca --name worker
```