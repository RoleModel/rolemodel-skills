# containers list


Lists all the containers running on an application or server (depending on your parameters).

```shell
$ cx containers list --stack <application name> [--server <server name>][--environment <environment name>][--verbose]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of your application |
| `--server <server name>` | no | — | The server to query |
| `--environment <environment name>` | no | — | The application environment |
| `--verbose` | no | — | Show more detailed information about each container |

#### Examples

```shell
$ cx containers list -s mystack
$ cx containers list -s mystack --server orca
$ cx containers list -s mystack --verbose --server orca
```