# services pause


Pauses all the containers for the given service. The list of available  services can be obtained through the `list services` command. If `<server name>` is provided it will query only the specified server.

```shell
$ cx services pause --stack <application name> [--server <server name>] <service name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--server <server name>` | no | — | The name of a server to query |
| `<service name>` | yes | — | The service to pause |

#### Examples

```shell
$ cx services pause -s mystack my_web_service
$ cx services pause -s mystack a_backend_service
$ cx services pause -s mystack --server my_server my_web_service
```