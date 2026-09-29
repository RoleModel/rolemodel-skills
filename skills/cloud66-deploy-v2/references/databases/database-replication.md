# Configuring database replication


## Overview

Database replication involves configuring a master and replica database architecture, whereby the replica is an exact copy of the master at all times. This feature is supported for MySQL, Postgres, Redis and MongoDB.

For MySQL, Postgres and Redis you can also build a [cascading topology](#cascading-replication) where a replica streams from another replica rather than directly from the master.

Database replication can be set up for a single application, between applications, or between database groups with various benefits:

### For a single application with one DB group

- Improved read performance: The replica server only allows reads and is ideal for use with reporting tools, and any database backups are taken from the replica rather than the master.
- Improved application reliability: Having a second server with your data, in case of hardware issues (no single point of failure).

### For multiple database groups

- Improved redundancy: Allows a single application to have multiple database clusters
- Data migration: Makes it easier to migrate your data with minimal downtime.

### For multiple applications

- Improved redundancy: Allows you to have a failover application in a different region.
- Data migration: Makes it easy to migrate your application with minimal downtime.

Replication between different applications is not supported for MongoDB. 

## How it works

When you start replicating your database, the Cloud 66 will do the following:

1. Take a full backup of the master database server in your source application.
2. Configure a secondary database to be a replica of the source database
3. Configure the source database to act as the replication master of the secondary database
4. Update the relevant environment variables for use in your code and scripts

In the case of a single application, we create a secondary database server in your cloud and restore a backup to it. For databases that span applications, we restore your backup on the database server of the second application. For **database groups** you need to set up the new group first, and then set up replication once it is in place.

If you enable replication, all data on the target server (i.e. the replica) will be deleted - including i.e. the tables & data structures rather than the "physical" database server ([full definition](#logical-databases-vs-physical-databases) and users. 

Similarly, when you disable replication, we do the following:

1. We disable replication on your master database, and configure it to be a standalone database server
2. The secondary database server is removed as a replica from the master database server on the source
3. The source database server is configured as a standalone database server
4. The relevant environment variables are updated for use in your code and scripts

## Environment Variables

Cloud 66 generates and maintains a number of environment variables automatically on your servers, including those that hold the address for your database server.

When you enable database replication, we will generate additional environment variables for your replica server(s). The value of these variables will change when you enable or disable replication.

In the case that an environment variable contains multiple values, such as IP addresses, these are separated by comma.

## Enable database replication

There are two ways to set up replication on Cloud 66, and the choice has real consequences for what you can do later.

Enabling database replication will disrupt the database serving your application during the replication configuration process. The disruption time depends entirely on your database type and size, and different databases may require a restart and/or a complete backup in order to warm-up the new server. This disruption will occur every time you scale your servers. 

### Recommended: replicate between database groups

Create a new [database group](../databases/attaching-multiple-databases.md) with one server and configure it as a replica of an existing group. The two groups can live in the same application or in different applications.

This is the recommended approach for almost every use case, because it gives you:

- **Enable and disable replication on demand** — replication is a relationship between two groups, not a structural property of one of them.
- **Safe, reversible promotion via *Make Default*** — switching which group is the default just repoints your root environment variables (e.g. `MYSQL_ADDRESS`) at the new group. Nothing is destroyed and you can switch back at any time. See [setting a default group](../databases/attaching-multiple-databases.md#understanding-default-database-groups).
- **[Cascading chains](#cascading-replication)** — A &rarr; B &rarr; C topologies are built from between-group hops.
- **Independent versions and configuration** — each group can run a different engine version (use a [manifest file](../databases/attaching-multiple-databases.md#specifying-database-groups-via-manifest) to control name, version, and engine).

The full walkthrough — including the manifest snippet for naming and versioning a new group — lives in the [database groups guide](../databases/attaching-multiple-databases.md#replicating-data-between-database-groups). The short version:

1. Open the application that will contain the replica from your [Dashboard](https://app.cloud66.com/dashboard).
2. Click on **Data Sources** in the left-hand nav and add a new database group (or select an existing single-server group).
3. Click the down arrow next to the database server and select **Configure Replication**.
4. Choose the **source** database to replicate from and click *Ok*.

### Legacy: scale a server group to add an in-group replica

When you click **+ Add Replica** on an existing database group, the new server joins that group as a replica of the group's primary. This was the only mechanism Cloud 66 offered before multiple database groups of the same type were supported, and it remains available — but it has trade-offs you should understand before choosing it.

- **You cannot disable replication on an in-group replica** — replication is part of the group's structure, not a relationship you can switch off.
- **Promoting an in-group replica is destructive and one-way.** It requires the [`cx databases promote-replica`](../toolbelt/_databases-promote-replica.md) toolbelt command, after which the existing primary **and any other replicas in the same group are no longer usable** and must be removed.
- **You cannot make one in-group replica the "default"** — there's only one group, so the *Make Default* mechanism doesn't apply.

If your goal is read scaling, an in-group replica is fine. If you're using replication for failover, migration, version upgrades, or anything you might want to reverse, prefer the between-groups approach above.

To add an in-group replica:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard).
2. Click on **Data Sources** in the left-hand nav.
3. Click on the name of the database group you want to scale.
4. Click the *+ Add Replica* button.
5. Choose a size for the new server.
6. Click *Create Server*.

## Secure multi-cloud replication

You can securely replicate data between databases hosted by different cloud providers over your [Application Private Network](https://help.cloud66.com/docs/security/using-application-private-networks). This allows you to stream data over the public internet without exposing it to malicious actors. 

Secure multi-cloud replication via APN is only available for [between-group replication](#recommended-replicate-between-database-groups). It is not available for [in-group replicas](#legacy-scale-a-server-group-to-add-an-in-group-replica) created with *+ Add Replica*, because those replicas live alongside the primary in the same group and cloud.

To enable replication via APN:

1. Log into your Dashboard an open the app that contains (or will contain) the replica DB (i.e. the target of the replication)
2. Click on Data Sources in the left-hand navigation and select the database group that will contain the replica (you can also add a data source at this point)
3. Click the small down arrow to the right of the database server that will be your replica and select *Configure Replication*
4. Select your Source database in the configuration panel that opens 
5. Make sure the "Use Application Private Network for replication” option is checked
6. Click *Set Up Replication* 

You can enable replication via APN for existing replicas by following the same steps and making sure you check the box in step 5.

## Cascading replication

For **MySQL, Postgres and Redis** you can build a *cascading* replication topology — also called a chain — where a replica streams from another replica rather than directly from the primary. The simplest cascading chain has three servers: A &rarr; B &rarr; C, where B is both a replica of A and the source for C.

MongoDB replica sets manage replication internally and cannot be cascaded through the Cloud 66 Dashboard.

### Why cascading?

- **Reduces load on the primary.** If you have many replicas, only one of them needs to stream directly from the primary; the others can stream from an intermediate.
- **Geographic distribution.** Place an intermediate in each region so local replicas stream from it instead of repeatedly crossing regions.
- **Tiered read replicas.** Group reporting or analytics replicas behind a dedicated intermediate so heavy queries don't compete with the primary's workload.

### How to build a chain

A cascading chain is built one hop at a time. To create A &rarr; B &rarr; C:

1. Enable replication from A to B (the standard *Add Replica* or *Configure Replication* flow).
2. Wait for the A &rarr; B replication to come up healthy.
3. Enable replication on C, choosing **B** as the source database.

When you enable replication on a server whose source is itself a replica, Cloud 66 automatically configures the chain — no extra setup is required on the intermediate server.

You can also turn an existing flat primary into a cascading intermediate. Open the **Configure Replication** menu on a primary that already has its own downstream replicas and pick an upstream source: the existing replicas stay attached and the primary becomes a cascading intermediate.

### Choosing a source database

When you configure replication on a target server, the **Source Database** picker includes any eligible replica from another group as well as primaries. Selecting an existing replica as the source extends the chain through that server.

### Limits

- **Maximum chain depth: 16 hops.** Cloud 66 refuses to enable replication that would create a chain longer than 16 servers.
- **No cycles.** A server cannot become a replica of one of its own downstream replicas.
- **PostgreSQL 12 or later is required for cascading.** Older PostgreSQL versions are blocked at validation time. MySQL and Redis have no version restriction beyond what Cloud 66 already supports.

### Stopping an intermediate from being a replica

To take an intermediate out of a chain (for example B in A &rarr; B &rarr; C), [disable replication](#disable-database-replication) on it. B is detached from its upstream A and reconfigured as an independent primary. The downstream subtree is preserved — C continues replicating from B without any manual intervention.

To dismantle a whole chain, work from the leaf upward: disable replication on C first, then B.

You don't need the [`cx databases promote-replica`](../toolbelt/_databases-promote-replica.md) toolbelt command to stop an intermediate from being a replica — *Disable replication* in the Dashboard is enough, and it's chain-aware. `cx promote-replica` is a separate, destructive operation intended for in-group replicas; it doesn't apply here.

You cannot [import a backup](../databases/attaching-multiple-databases.md#moving-data-between-database-groups) into a server that is currently a replica or a cascading intermediate — the imported data would either be overwritten by ongoing replication or fail outright due to read-only restrictions. Disable replication on the target server first, then import, then re-enable replication.

## Disable database replication

To disable replication between applications: 

1. Open the application for the secondary application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on **Data Sources** in the left-hand nav 
3. Click on the replica database group in the sub-nav
4. Select *Disable replication* and confirm to commence the disabling process.

If you are disabling replication on a cascading intermediate, see [Disabling replication on a cascading intermediate](#disabling-replication-on-a-cascading-intermediate) above for the resulting topology.

## Re-synchronizing replica with master

From time-to-time your replica database may go out of sync with its master. You can re-synchronize a replica in two ways:

- Via the Dashboard (click through to the detail page for the replica and then click Resync Replica)
- Via the Cloud 66 Toolbelt's [database management commands](../toolbelt/_databases-promote-replica.md).

If your managed backups are set to run on your replica server, you will not be able to automatically resync your replica from that backup. You will need to disable this option and run the backup on your master server before you can resync.