# processes scale


Starts `<count>` processes from the given process definition. `<count>` can be an absolute value like `2` or a relative value like `[+2]` or `[-3]` If server is provided, will start `<count>` processes on that server. If server is not provided, will start `<count>` processes on every server. NOTE: the square brackets are required for relative count values.

```shell
$ cx processes scale --stack <application name> [--server <server name>] [--name <process name>] [<count>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Full or partial name of the application |
| `--server <server name>` | no | — | The name of the server on which to scale the process |
| `--name <process name>` | yes | — | The name of a process |
| `<count>` | yes | — | Specifies either an absolute count of processes (3), or a relative change ([+4] or ([-2]) |

#### Examples

```shell
$ cx processes scale -s mystack --server backend1 --name worker [+5]
$ cx processes scale -s mystack --server backend2 --name worker [-5]
$ cx processes scale -s mystack --server backend3 --name worker 15
$ cx processes scale -s mystack --name worker 2
```