# Add Redis to your application


## Add Redis to your application
To add a Redis instance to your application: 

1. Open the **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav 
3. Click on *Add Source* in the sub-nav
4. Click the green *+ Add Data Source* button and select Redis
5. A drawer will open from the left, with configuration options for the server.
6. Click *Add Server* to start the process

## Redis replication

Cloud 66 supports both standard primary/replica and [cascading replication](../databases/database-replication.md#cascading-replication) (A &rarr; B &rarr; C chains) for Redis. Redis chains its replication streams natively via `REPLICAOF`, so an intermediate replica forwards its upstream's stream to its own downstream replicas without any additional configuration.

For setup, limits, and the behaviour of promote/disable on a chain, see the [database replication guide](../databases/database-replication.md#cascading-replication).