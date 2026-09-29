# containers restart


Restarts a particular container on a given stack by container ID or name (supports partial IDs and names).

```shell
$ cx containers restart --stack <application name> <container ID>|<container name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of your application |
| `<container ID>` | either\or | — | The ID of the container to restart |
| `<container name>` | either\or | — | The name of the container to restart |

#### Examples

```shell
$ cx containers restart -s mystack 2844142cbfc064123777b6be765b3914e43a9e083afce4e4348b5979127c220c
$ cx containers restart -s mystack 2844142c
$ cx containers restart -s mystack web.pro-active-quick-witted-dinosaur
$ cx containers restart -s mystack web
```