# processes resume


Resumes all paused processes on the given service and/or server.

```shell
$ cx processes resume --stack <application name> [--server <server name>] <process name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Full or partial name of the application |
| `--server <server name>` | no | — | The name of the server to query |
| `<process name>` | no | — | The name of a process |

#### Examples

```shell
$ cx processes resume -s mystack a_backend_process
$ cx processes resume -s mystack --server my_server
$ cx processes resume -s mystack --server my_server a_backend_process
```