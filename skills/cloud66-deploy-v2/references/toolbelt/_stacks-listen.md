# stacks listen


Acts like a `tail` for all the deployment logs for an application (to tail a specific log file, see the function below).

```shell
$ cx stacks listen --stack <application name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | The application name |

#### Examples

```shell
$ cx stacks listen -s my-app
```