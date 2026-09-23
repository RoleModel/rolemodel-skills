# databases resync-replica


Re-syncs the specified replica database server with its source. From time-to-time your replica database may go out of sync with its source. This action attempts to re-sync your specified replica server. This can happen depending on many factors (such as DB size, frequency of change, networking between servers etc).

The server provided must have already been configured as a replication replica via the Cloud 66 UI. Providing the database type is optional and is only necessary for shared servers where we can’t automatically determine the target database type.

For replicas in a [cascading chain](../databases/database-replication.md#cascading-replication), resync runs against the **immediate upstream** — not the root primary. For example, in A &rarr; B &rarr; C, resyncing C streams a fresh snapshot from B.

```shell
$ cx databases resync-replica --stack <application name> --dbtype <database type> <replica server name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of your application |
| `<replica server name>` | yes | — | Name of replica server to be resynced with master |
| `--dbtype <database type>` | no | — | The database type (`mysql`,`postgresql`) |

#### Examples

```shell
$ cx databases resync-replica -s My_Awesome_App my_replica_server_name
$ cx databases resync-replicas -s My_Awesome_App --dbtype=postgresql my_replica_server_name
```