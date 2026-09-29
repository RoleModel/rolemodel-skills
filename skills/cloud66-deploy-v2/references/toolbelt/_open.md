# open


Opens the default web browser and opens the web end-point of a given application.

```shell
$ cx open --stack <application name> <server name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Full or partial name of the application |
| `<server name>` | no | — | The name of the web server to query |

#### Examples

```shell
$ cx open lion
$ cx open -s mystack
$ cx open -s mystack lion
```