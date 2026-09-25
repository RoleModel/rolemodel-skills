# containers stop


Stops a specific container on a given stack by container ID or name (supports partial IDs and names).

```shell
$ cx containers stop --stack <application name> <container ID>|<container name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of your application |
| `<container ID>` | either\or | — | The ID of the container to stop |
| `<container name>` | either\or | — | The name of the container to stop |

#### Examples

```shell
$ cx containers stop -s mystack 2844142cbfc064123777b6be765b3914e43a9e083
$ cx containers stop -s mystack 2844142c
$ cx containers stop -s mystack web.pro-active-quick-witted-dinosaur
$ cx containers stop -s mystack web
```