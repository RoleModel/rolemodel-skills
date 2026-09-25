# stacks configuration apply


Applies the latest configuration to an application. You can find all the types of configuration available on your application using the `stacks configuration list` function.

```shell
$ cx stacks configuration apply --stack <application name> --type <config type>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--type, -t <config type>` | yes | — | Type of configuration to apply |

#### Examples

```shell
$ cx stacks configuration apply -s my-application -t nginx
```