# Migrating your application between servers


## Step by step guide

1. Set up a [Failover Group](../failover-groups/failover-groups.md)
2. Add the IP address of the Failover Group to your DNS record (allow 24 hours to propogate)
3. Set up a [managed backup](../databases/database-backups.md) for your database 
4. [Clone your application](../cloud-66-101/adding-updating-deleting.md#clone-an-application) to the new server
5. [Add databases](../databases/adding-database.md) as required to the clone
6. Set up a [replication](../databases/database-replication.md) between to the clone databases
7. Add the cloned application to the failover group as the secondary application
8. Put the primary site into [maintenance mode](../deployment/using-maintenance-mode.md)
9. [Promote](../toolbelt/_databases-promote-replica.md) the cloned databases to masters
10. Switch the Failover Group to the new application
11. [OPTIONAL] Switch your DNS record to the new application

This method can be used to migrate applications between regions as well.