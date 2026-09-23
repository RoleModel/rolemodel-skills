# Add Postgres to your application


## Add Postgres to your application

To add a Postgres group (instance) to your application: 

1. Open the **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav 
3. Click on *Add Source* in the sub-nav
4. Click the green *+ Add Data Source* button and select Postgres
5. A drawer will open from the left, with configuration options for the server.
6. Click *Add Server* to start the process

## Managing users in Postgres

Whenever a database user creates any object (e.g. a table) in Postgres, that user becomes the owner of that object. From then on, only that user or a superuser can edit or delete that object. 

As such, if you delete a user from any logical Postgres database managed by Cloud 66, we will automatically reassign any objects owned by that user to the default superuser named `postgres` that exists on all instances of Postgres.

If you need to add custom users to a Postgres database group, follow [this guide](../databases/adding-database.md#adding-users-to-logical-databases) on the subject. 

## Specifying the Postgres version

You can pin the version of Postgres to install for your application using a [manifest file](../manifest/what-is-a-manifest-file.md).

For the database group named **`default`** (the group Cloud 66 creates when you first add Postgres to an application):

```yaml
production:
    postgresql:
        configuration:
            version: 18
```

For any other database group, use the `groups:` block and refer to the group by name:

```yaml
production:
    postgresql:
        groups:
            <your-group-name>:
                configuration:
                    version: 18
```

The top-level `postgresql: configuration:` form applies **only** to the group named `default` — it is not a fallback for groups that don't have an explicit configuration. Each group must be configured under its own name in the `groups:` block.

## Replicating data between Postgres versions

When you initiate replication between two Postgres databases on Cloud 66, we setup [streaming replication](https://wiki.postgresql.org/wiki/Streaming_Replication) between the master and replica servers. Streaming replication is based on [log shipping](https://www.postgresql.org/docs/current/warm-standby/) between servers, which generally isn't possible between two servers running vastly different versions of Postgres.

As such, we cannot establish replication between servers running different major release levels (e.g. 16 and 18). Though running replication between different minor release levels (e.g. 18.0 and 18.1) should work (because Postgres has a policy not to make changes to disk formats between minor releases), there are also cases where this won't work.

For example, if you setup replication between a master (on 16) and a replica (18), you may see this error on the replica server:

```bash
FATAL:  database files are incompatible with server
DETAIL:  The data directory was initialized by Postgres version 16, which is not compatible with this version 18.x.
```

In this case, you need to upgrade the data and libraries of the master server (16) with [pg_upgrade](https://www.postgresql.org/docs/current/pgupgrade.html) before starting the replication.

## Cascading replication for Postgres

Cloud 66 supports [cascading replication](../databases/database-replication.md#cascading-replication) (A &rarr; B &rarr; C chains) for Postgres. The intermediate server (B) is both a replica of the upstream primary and a streaming source for its downstream replicas.

Cascading replication is only supported on **Postgres 12 and above**. On older versions Cloud 66 will refuse to enable a cascading topology at validation time. The flat primary/replica setup remains supported on all Postgres versions Cloud 66 still supports.

Postgres has supported cascading natively since version 9.1; the version floor here reflects the configuration mechanics Cloud 66 uses (`postgresql.auto.conf` + `standby.signal`) rather than a Postgres limitation.

## Changing the Postgres data directory

We use the default data folder when installing Postgres on your server, which is  `/usr/local/pgsql/data`.
To change this folder, follow the instructions below.

1; Connect to your servers via [SSH](../servers/ssh-to-server.md).

2; Stop the Postgres service by issuing the following command:
```shell
$ (sudo -u postgres pg_ctl stop -D /usr/local/pgsql/data -m i -t 5 || true) && sudo stop postgresql 
```

3; Make sure that Postgres is no longer running:
```shell
$ ps aux | grep pgsql
```	
This command must not return any running Postgres processes. 

4; Make a new directory for your data:
```shell
$ mkdir /new/path/folder
```

5; Make sure that your new folder is only accessible by the Postgres user:
```shell	
$ chown postgres /new/path/folder
$ chmod 700 /new/path/folder
```

6; Move your data from the old folder to new one:
```shell
$ mv /usr/local/pgsql/data /new/path/folder
```

7; Create a symlink to your new folder from the old one:
```shell
$ ln -s /new/path/folder/data /usr/local/pgsql/data
```

8;  Start the Postgres service again:
```shell
$ sudo start postgresql
```

Your Postgres service should now be working with new data folder.