# backups new


Creates a new database backup task for an application.

```shell
cx backups new --stack <application name> --dbtypes postgresql --frequency <schedule> --gzip <bool> --exclude-tables <table name> --run-on-replica <bool> --backup-type <type>
```

#### Options

| Parameter | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | Yes | — | Name of your application |
| `--dbtypes <type>` | No | `all` | Comma separated list of Database types which need backup tasks. (`all`, `mysql`, `postgresql`, `mongodb`, `redis`) |
| `--frequency <schedule>` | No | `0 */1 * * *` | Frequency of backup task in cron schedule format |
| `--keep <number>` | No | `100` | Number of previous backups to keep |
| `--gzip <bool>` | No | `true` | Compress your backups with gzip |
| `--exclude-tables <table name>` | No | — | Tables that must be excluded from the backup |
| `--run-on-replica <bool>` | No | `true` | Run backup task on replica server if available |
| `--backup-type <type>` | No | `text` | Specify the type of backup to perform. Acceptable values are `binary` and `text`. |

#### Examples

```shell
$ cx backups new -s mystack	--dbtypes postgresql --frequency="0 */1 * * *" --gzip true --exclude-tables my_log_table --run-on-replica false --backup-type text
```

This command only applies to managed backups and not the unmanaged ones.