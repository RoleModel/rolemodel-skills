# backups download


Download a managed database backup via the command line. If the backup spans multiple files, the command will automatically concatenate them into a single file.

```shell
$ cx backups download --stack <application name> [--download <download directory>] <backup id>
```

#### Options

| Arguments | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | The name of the application |
| `--directory, -d <download directory>` | no | — | The local directory in which to save the downloaded file |
| `<backup ID>` | yes | — | The backup ID (you can get this using the backup list command) |

#### Examples

```shell
$ cx backups download -s mystack -d /tmp/backups 23212
```

This command only applies to managed backups and not the unmanaged ones.