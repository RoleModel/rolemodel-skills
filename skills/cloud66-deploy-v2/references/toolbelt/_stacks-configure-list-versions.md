# stacks configure list versions


List the versions of configuration files such as a *service.yml* or *manifest.yml*. (containerized apps only)

```shell
$ cx stacks configure list-versions --file <filename> --stack <application name> --version <file version type>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--file, -o <filename>` | yes | — | Name of the config file. Accepted values: `service.yml`, `manifest.yml` |
| `--version, -v <file version type>` | no | — | Full or partial file version |

#### Examples

```shell
$ cx stacks configure list-versions -o service.yml -s myapp
```