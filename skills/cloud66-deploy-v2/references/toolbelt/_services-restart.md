# services restart


Restarts all the containers for the given service. The list of available  services can be obtained through the `list services` command. If `<server name>` is provided it will query only the specified server.

```shell
$ cx services restart --stack <application name> [--server <server name>] <service name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--server <server name>` | no | — | The name of a server to query |
| `<service name>` | yes | — | The service to restart |

#### Examples

```shell
$ cx services restart -s mystack my_web_service
$ cx services restart -s mystack a_backend_service
$ cx services restart -s mystack --server my_server my_web_service
```