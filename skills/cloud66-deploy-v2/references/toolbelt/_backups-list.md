# backups list


Lists all the managed backups of an application grouped by their database type and/or backup schedule.

```shell
$ cx backups list --stack <application name> --latest
```

#### Options

| Arguments | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | The name of the application |
| `--dbtypes <type>` | no | — | Database type to be listed. (all, mysql, postgresql, mongodb, redis) |
| `--latest, -l` | yes | — | List the latest backup |

#### Examples

```shell
$ cx backups list -s "My Awesome App" --dbtypes mysql --latest
```