# stacks configuration upload


Updates the content of the specified configuration type on the stack and (optionally) applies it. You can find all the types of configuration available on your application using the `stacks configuration list` function.

```shell
$ cx stacks configuration upload --stack <application name> --type <config type> --source <source file> --no-apply --commit-message <message>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--type, -t <config type>` | yes | — | Type of configuration to upload |
| `--source <source file>` | yes | — | The source file containing the configuration you wish to upload |
| `--no-apply` | no | — | Do not automatically apply the configuration changes to your servers (default behaviour is to apply changes immediately) |
| `--commit-message <message>` | no | — | A message to associate with the configuration update |

#### Examples

```shell
$ cx stacks configuration upload -s my-app -t nginx --source nginx.conf --no-apply --commit-message "changes to error pages"
```