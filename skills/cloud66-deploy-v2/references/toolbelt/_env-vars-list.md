# env-vars list


Prints environment variables (both keys and values) for your application to terminal. If environment variable keys are specified, the list will be limited to those keys. The `--history` option lists any recent changes to each variable.

```shell
$ cx env-vars list --stack <application name> <environment variables> [--history]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of your application |
| `<environment variables>` | yes | — | A space separated list of environment variable keys |
| `--history` | no | — | Displays a list of recent changes to each variable |

#### Examples

```shell
$ cx env-vars list -s mystack
$ cx env-vars list -s mystack RAILS_ENV
$ cx env-vars list -s mystack RAILS_ENV ANOTHER_VARIABLE --history
```