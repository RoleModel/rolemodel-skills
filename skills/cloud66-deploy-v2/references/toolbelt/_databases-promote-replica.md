# databases promote-replica


Promotes the specified replica database server to a standalone primary. The replica will be reconfigured as the new primary. Providing the database type is optional and is only necessary for shared servers where we can't automatically determine the target database type.

This command is for **in-group replicas** (created with *+ Add Replica* on an existing database group). If your replica lives in its own database group instead, use the [Make Default](../databases/attaching-multiple-databases.md#understanding-default-database-groups) button on the Dashboard — it repoints your environment variables at the new group on next deploy, leaves the old primary untouched, and is fully reversible. See [Enable database replication](../databases/database-replication.md#enable-database-replication) for the trade-offs between the two approaches.

This action could result in application downtime, it is advisable to choose a low traffic time to perform this action, and to place your application in maintenance mode.

When you promote a flat replica (one that has no downstream replicas of its own), the existing primary and other replicas will need to be removed after the process — the new configuration will have only a single database. You can reconfigure replication afterwards by scaling up new servers.

When you promote an intermediate replica in a [cascading chain](../databases/database-replication.md#cascading-replication) (for example B in A &rarr; B &rarr; C), the downstream subtree is preserved: B is detached from its old upstream A and reconfigured as an independent primary, and C continues replicating from B unchanged.

In the case of any servers not being accessible during this time, those servers will remain unchanged. It is therefore important to stop/shut down those servers in this case (or to manually stop the DB service on those servers) as having multiple primaries in a cluster could cause problems throughout the cluster.

```shell
$ cx databases promote-replica --stack <stack name> [--dbtype <database type>] <replica server name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <stack name>` | yes | — | Name of your application |
| `--dbtype <database type>` | no | — | The database type (`mysql`,`postgresql`,`redis`) |
| `<replica server name>` | yes | — | Name of replica server to promote to master |

#### Examples

```shell
$ cx databases promote-replica -s My_Awesome_App my_redis_replication_replica
$ cx databases promote-replica --stack My_Awesome_App --dbtype=mysql my_replica_server_name
```