# services scale


Starts `<count>` containers for the given service across the stack. If `<count>` is an absolute value like `2`, then that will be the total of `<count>` containers across the application. If `<count>` is a relative value like `[+2]` or `[-3]`, then the current total count of containers across the application will be changed by `<count>`. NOTE: the square brackets are required for relative count values.

```shell
$ cx services scale --stack <application name> <service name> <count>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `<service name>` | yes | — | The service to restart |
| `<count>` | yes | — | Specifies either an absolute count of containers (3), or a relative change ([+4] or ([-2]) |

#### Examples

```shell
$ cx services scale -s mystack my_web_service 1
$ cx services scale -s mystack a_backend_service [+5]
$ cx services scale -s mystack a_backend_service [-2]
```