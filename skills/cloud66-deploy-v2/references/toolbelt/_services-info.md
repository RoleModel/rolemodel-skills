# services info


Get info for given the service. The list of available services can be obtained through the `services list` command. If the server is provided it will only query the specified server.

```shell
$ cx services info --stack <application name> [--server <server name>] <service name> 
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--server <server name>` | no | — | The name of a server to query |
| `<service name>` | yes | — | The service to query |

#### Examples

```shell
$ cx services info -s mystack my_web_service
$ cx services info -s mystack a_backend_service
$ cx services info -s mystack --server my_server my_web_service
```