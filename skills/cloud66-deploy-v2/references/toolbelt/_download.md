# download


Use this command to download a copy of file from the remote server to your local computer. If you don't specify a target directory, the file will be downloaded to your current local directory.

```shell
$ cx download --stack <application name> --server <server name> <path to source file> [<target directory>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of your application |
| `--server <server name>` | yes | — | Name of the server which contains the file |
| `<path to source file>` | yes | — | The path to the file on the server |
| `<target directory>` | no | — | The path to the local directory in which the file will be saved |

#### Examples

```shell
$ cx download -s "My Awesome App" --server web /tmp/file.txt /tmp/file.txt
```