# env-vars upload


Set the environment variables for an application based on a file in either `dotenv` or `json` format.

You must specify an `apply-strategy` for your upload process. They can either be applied `immediately` or on the next `deployment`.

```shell
$ cx env-vars upload --stack <application name> --file <filename> --file-type <type> [--apply-strategy <strategy>] [--delete]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Full or partial name of the application |
| `--file-type <type>` | yes | — | The format of the source file containing the list of environment variables (dotenv or json) |
| `--file <filename>` | yes | — | The filename of the file being uploaded |
| `--apply-strategy <strategy>` | no | — | Sets when uploaded changes will be applied (immediately, deployment) |
| `--delete` | no | — | Delete any user-generated variables that don’t appear in file |

#### Examples

```shell
$ cx env-vars upload -s mystack --file environment_variables_dotenv --file-type dotenv --apply-strategy deployment --delete
$ cx env-vars upload -s my_other_stack --file environment_variables_json --file-type json --apply-strategy immediately
```