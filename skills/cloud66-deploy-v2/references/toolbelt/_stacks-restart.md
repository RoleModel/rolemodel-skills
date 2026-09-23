# stacks restart


Sends a restart signal to all application components. This means different things for different components. For a web server, it means a restart of nginx. For an application server, this might be a restart of the worker processes.

```shell
$ cx stacks restart --stack <application name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | The application name |

#### Examples

```shell
$ cx stacks restart -s my-app
```