# Multi Database Support


## Overview

Multi Database Support allows you to attach multiple **database groups** to an application. A database group is a collection of one or more databases of the *same* type (e.g. MySQL). Different groups can have different database types, allowing a single app to use multiple types of databases (e.g. Postgres *and* Redis), or they can have the same type (e.g. two *separate* groups of MySQL servers).

Database Groups allow you to attach multiple databases to a single application. A database group is a collection of one or more databases of the *same* type (e.g. MySQL). Different groups can have different database types, allowing a single app to use multiple types of databases (e.g. Postgres *and* Redis), or they can have the same type (e.g. two *separate* groups of MySQL servers).

If you’d prefer to add another i.e. the tables & data structures rather than the "physical" database server ([full definition](../databases/adding-database.md#logical-databases-vs-physical-databases) to an existing database group rather than creating a new database group, please read [our guide on the subject](../databases/adding-database.md). This guide only deals with adding additional physical databases to your application in the form of database groups.

If you are using the **native** Rails multiDB feature (i.e. multiple databases with Active Record) then please read our [Rails MultiDB guide](https://help.cloud66.com/deploy/2/databases/rails-multidb). (The feature actually uses Database Groups, but does so via another method).

## Understanding database groups

Database groups are discrete groups ("clusters") of database servers of the same type. If your application already has a database, you already have your first "group". 

Database groups allow you to have two or more completely separate sources of data for your application - either of the same type (e.g. two MySQL groups) or of different types (e.g. one MySQL group and one Postgres group). 

Adding a database to an existing group ([scaling up](../databases/database-management.md)) does not require you to use database groups. Groups are only needed if your data sources need to be distinct. 

## Adding a database group to an app

To add a database group to an application, you need to first deploy your application using Cloud 66 (here's [a guide to get you started](../getting-started/deploy-your-first-app.md)).

To add a new database group to an existing application using the Dashboard:

1. Open the **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav and then *Add Source* in the sub-nav
3. Click the green *+ Add Data Source* button and select a database engine
4. A drawer will open from the left, with configuration options for the server.
5. Give your new database group a name 
6. Click *Add Server* to start the process

We will now build your new database server and alert you when it is ready.

To control the **name, engine version, or other configuration** of the new group, see [Specifying database groups via manifest](#specifying-database-groups-via-manifest) below.

## Specifying database groups via manifest

If you need more control over the configuration of your database groups (for example which version of a database engine to use) you can specify the database groups for an application using your Manifest file. 

For example you could set up three groups of MySQL databases as follows:

```yaml
mysql:
 groups:
  default:
   configuration:
	 engine: percona
     version: "8.0"
  upgrade:
   configuration:
	 engine: percona
     version: "8.1"
  legacy:
   configuration:
	 operating_system: ubuntu2204
     version: "5.6"
```

If you are using your Manifest file to build an application from scratch, it will build all your database groups according to these specifications (only when you have the "servers" parts of your groups fully defined). 

If you are adding a new database group (or server) to an **existing application** it will use *either* the specifications in your Manifest file *or*, if no specification exists, the most recent version supported by Cloud 66. So, if you need to add a new group with a specific version, you should first add the group to your Manifest and then use the same name when you add the group via your Dashboard (see above).

Simply adding or removing configurations from your Manifest will not add or remove the associated database servers or groups from your application. Please read our [full guide](../manifest/what-is-a-manifest-file.md) to understand how best to use the Manifest file.

## Connecting applications to database groups

You can connect applications to different database groups using environment variables. For each kind of database (i.e. each database engine), one group will be set as the "default group" (see below for more details). This default group will use the default env vars for that database type (e.g. `MYSQL_ADDRESS`), while the rest of the groups will use specific env vars derived from their group name - for example `MYSQL_VENUS_ADDRESS`.

To find the environment variables for a database group: 

1. Open your application via the Dashboard
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on *Environment Variables* in the sub-nav  
4. Scroll through the list of env vars until you find the variables for the chosen database group 
4. Use these env vars in your application's database connection configuration

This allows your application to use two or more database groups simultaneously. We recommend extra caution if your application has two or more groups that use the same database type, as it is easy to become confused. 

### Understanding default database groups

When you have multiple database groups of the same type (e.g. multiple MySQL groups), one of those groups will be set as your default group (normally it is the first group created).

This means that the root level environment variables that we create for that database type will redirect to the environment variables of the **default group**. The rest of the groups will use specific env vars derived from their group name (e.g. `MYSQL_VENUS_ADDRESS`).

For example if the group named "Default" set as your **default MySQL group** then the env vars are mapped as follows:

`MYSQL_ADDRESS` &rarr; `MYSQL_DEFAULT_ADDRESS`

`MYSQL_PASSWORD` &rarr; `MYSQL_DEFAULT_PASSWORD`

At any point you can set another group to be your default group, which will change the root level environment variables for that database type to point at new values. For example if you set the group named "upgrade" as your default:

`MYSQL_ADDRESS` &rarr; `MYSQL_UPGRADE_ADDRESS`

`MYSQL_PASSWORD` &rarr; `MYSQL_UPGRADE_PASSWORD`

To set a new default group in your Dashboard: 
1. Click *Data Sources* in the left-hand nav of your Dashboard
2. Click the name of the database group in the sub-nav
3. Click the **Make Default** button at the top of the main panel 

**We will not apply any changes in env vars to your application immediately.** They will only be applied when you next redeploy your stack (we recommend you do this immediately or as soon as possible).

If your replica lives in its own database group, *Make Default* is the recommended way to promote it: your environment variables repoint at the new group on next deploy, the old primary stays untouched, and you can switch back at any time. This is the modern alternative to the [`cx databases promote-replica`](../toolbelt/_databases-promote-replica.md) toolbelt command — that command is one-way and destructive, and only applies to in-group replicas.

This pattern also applies to the **service networking addresses** of your Cloud 66 components. For more details please read our [full guide on the subject](../databases/database-management.md#service-names-for-database-groups).

 You can choose to use the **group-specific environment variables** in your app configuration, rather than using the root level environment variables. So if, for example, your current default group is named "Upgrade" you can still use `MYSQL_UPGRADE_ADDRESS` rather than `MYSQL_ADDRESS`. 

## Moving data between database groups

You can import data to a new database group from any existing database group of the same type in any application you control. To do this:

1. Set up [managed backups](../databases/database-backups.md) on the source database (from which you plan to import the data) and ensure the first backup has been completed
2. Add a new database group to an application and wait for the master server to be set up
3. Click on **Data Sources** in the left-hand nav 
4. Click on the name of the **target** database group in the sub-nav
5. Click the down arrow next to the target database server and select **Import Database**
6. Choose the source database and click *Import*

If you can't see the source database in the import list, ensure that you've set up managed backups on the source database and that they use the correct format. 

For MySQL and Postgres databases, only text backups can be restored **between different applications**. Binary backups will only allow restoring within the same application. Bear in mind that text backups only contain the default i.e. the tables & data structures rather than the "physical" database server ([full definition](#logical-databases-vs-physical-databases)  for a database group.

Import Database is refused on any server that is currently a replica — including a cascading intermediate. The import would either be silently overwritten by ongoing replication or fail outright due to read-only restrictions. Disable replication on the target server first, then import, then re-enable replication.

## Replicating data between database groups

You can set up replication between database groups of the **same type and compatible version**. You replicate between groups in the same application, or between applications. 

Replication between groups follows these rules:

- A primary in one group **can** also be a replica of another group. This creates a [cascading replication chain](../databases/database-replication.md#cascading-replication) — group A's primary streams to group B's primary, which in turn streams to group B's own replicas.
- Cycles are not allowed: a server cannot end up replicating from one of its own downstream replicas.
- The maximum chain depth is **16 hops**.
- Cascading is supported for **MySQL, Postgres and Redis only**. MongoDB groups can be replicated but not cascaded.

When you scale up a group whose primary is itself a replica of another group, the new server is automatically added as a downstream replica of that primary, extending the chain.

To set up replication *between* database groups:

1. Open your application via the Dashboard
2. Click on **Data Sources** in the left-hand nav 
3. Click on the (intended) replica database group in the sub-nav
3. Click the down arrow next to the target database server and select **Configure replication**
4. Choose the **source** database to replicate from and click *Ok*

Replication will now be set up. It may take some time for data to sync between your databases. For large databases we recommend importing a (recent) backup from the **source** before enabling replication. 

For more details on replication please read our [full How-To Guide](../databases/database-replication.md).