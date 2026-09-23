# stacks configure download


Download configuration files such as a *service.yml* or *manifest.yml*. (containerized apps only)

```shell
$ cx stacks configure download --file <filename> --stack <application name> --output <output path>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--file, -f <filename>` | yes | — | Name of the config file. Accepted values: `service.yml`,`manifest.yml` |
| `--output, -o <output path>` | no | — | Full path of the output file. |

#### Examples

```shell
$ cx stacks configure download -f service.yml -s myapp -o /c66/config-files/service.yml
```