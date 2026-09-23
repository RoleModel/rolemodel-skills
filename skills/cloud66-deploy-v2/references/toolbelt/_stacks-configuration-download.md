# stacks configuration download


Gets the content of the specified configuration file from the given application and either prints it to screen or saves it as a file. You can find all the types of configuration available on your application using the `stacks configuration list` function.

```shell
$ cx stacks configuration download --stack <application name> --type <config type> --output <filename>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--type, -t <config type>` | yes | — | Type of configuration to download |
| `--output, -o <filename>` | no | stdout | Save configuration output to a local file |

#### Examples

```shell
$ cx stacks configuration download -s my-application -t nginx -o nginx.conf
```