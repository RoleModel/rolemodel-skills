# services resume


Resumes all the containers from the given service that were previously paused. The list of available  services can be obtained through the `list services` command. If `<server name>` is provided it will query only the specified server.

```shell
$ cx services resume --stack <application name> [--server <server name>] <service name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--server <server name>` | no | — | The name of a server to query |
| `<service name>` | yes | — | The service to resume |

#### Examples

```shell
$ cx services resume -s mystack my_web_service
$ cx services resume -s mystack a_backend_service
$ cx services resume -s mystack --server my_server my_web_service
```