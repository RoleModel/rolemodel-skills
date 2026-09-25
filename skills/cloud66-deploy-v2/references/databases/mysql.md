# Add MySQL to your application


## Add MySQL to your application

To add a MySQL group (instance) to your application:

1. Open the **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav 
3. Click on *Add Source* in the sub-nav
4. Click the green *+ Add Data Source* button and select MySQL
5. A drawer will open from the left, with configuration options for the server.
6. Click *Add Server* to start the process

## Choosing a MySQL version

Cloud 66 supports MySQL **5.7**, **8.0**, and **8.4**. You can pin the version for your application using a [manifest file](../manifest/what-is-a-manifest-file.md).

For the database group named **`default`** (the group Cloud 66 creates when you first add MySQL to an application):

```yaml
production:
    mysql:
        configuration:
            version: "8.4"
```

For any other database group, use the `groups:` block and refer to the group by name:

```yaml
production:
    mysql:
        groups:
            <your-group-name>:
                configuration:
                    version: "8.4"
```

The top-level `mysql: configuration:` form applies **only** to the group named `default` — it is not a fallback for groups that don't have an explicit configuration. Each group must be configured under its own name in the `groups:` block.

If you don't specify a version, Cloud 66 uses the most recent version it supports.

## Replicating data between MySQL versions

When you initiate replication between two MySQL databases on Cloud 66, we set up streaming replication between the primary and replica servers. Streaming replication relies on a compatible binary log format between the two servers, which generally isn't possible between two servers running vastly different versions of MySQL.

As such, we cannot establish replication between servers running different major release levels (e.g. 5.7 and 8.0). Replication between different minor release levels (e.g. 8.0.32 and 8.0.36) should work, but you should run matching versions wherever possible.

## Cascading replication for MySQL

Cloud 66 supports [cascading replication](../databases/database-replication.md#cascading-replication) (A &rarr; B &rarr; C chains) for MySQL. The intermediate server is both a replica of the upstream primary and a streaming source for its own downstream replicas. See the [cascading replication guide](../databases/database-replication.md#cascading-replication) for setup steps, limits, and the behaviour of promote and disable on a chain.

Two MySQL-specific operational notes:

- **File/position-based replication.** Cloud 66 uses MySQL's classic file-and-position replication for cascading chains, not GTID-based replication. If you debug a chain manually, expect `SHOW REPLICA STATUS` (or `SHOW SLAVE STATUS` on older versions) to report `Source_Log_File` and `Read_Source_Log_Pos` rather than GTID sets.
- **Binary log retention is 10 days.** Each server in a chain retains its binary logs for 10 days by default. Under heavy write load on a deep chain, a downstream replica that falls more than 10 days behind its immediate upstream cannot be brought back into sync from binlog alone — it will need a full resync. Watch replication lag on the deepest replicas if your write volume is high.

## Uninstalling MySQL

To uninstall MySQL from your servers, see our [guide to uninstalling MySQL](../databases/uninstall-mysql.md).