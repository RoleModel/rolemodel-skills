# stacks configure upload


Upload configuration files such as a *service.yml* or *manifest.yml*. (containerized apps only)

```shell
$ cx stacks configure upload --file <filename> --stack <application name> --comments <comment>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--file, -f <filename>` | yes | — | Name of the config file. Accepted values: `service.yml`,`manifest.yml` |
| `--comments, -c <comment>` | yes | — | A brief description of your changes |

#### Examples

```shell
$ cx stacks configure upload -f service.yml -s myapp -c "updates to ports"
```