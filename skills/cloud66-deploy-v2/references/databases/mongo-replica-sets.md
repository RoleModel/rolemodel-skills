# Scaling MongoDB with replica sets


This guide assumes that you have added MongoDB using your Cloud 66 dashboard or Manifest file. If you have configured the service manually then this will not apply 

Before scaling MongoDB, it's vital that you **understand how replica sets work and how to use them**, or you will risk downtime.

There is a lot of excellent material about [MongoDB replica sets](https://docs.mongodb.org/manual/replication/) available online, which we won't repeat here. We will focus on how Cloud 66 scales your MongoDB servers and how you can use them in your code.

## Configure a MongoDB replica set

When you scale up MongoDB using Cloud 66, we perform the following steps:

- Back up your database
- Create two more servers in your cloud (MongoDB replica sets require an odd number of servers)
- Deploy and configure MongoDB on the new servers
- Restore the backup on the new servers
- Configure all MongoDB instances in the application to act as a single replica set
- Generate appropriate environment variables with the addresses of the replica set servers

It is important for backups to keep their referential integrity, otherwise different parts of the database might be backed up at different times, affecting database performance.

 Database replication will disrupt your live database during the backup and configuration steps of the process. 

## Using a MongoDB replica set in your code

All MongoDB drivers support replica sets, which means that you can pass the list of MongoDB servers in your replica set to them and they will adapt. However, switching from a single MongoDB to a replica set is something you need to test and be sure about. You shouldn't make such a change to your application infrastructure with the click of a button!

This is why we won't touch your configuration files after you scale your MongoDB up. This allows you to configure the client the way you see fit and go live with your replicated database backend when you are ready.

 We stop automatically modifying your MongoDB client configuration files after replication is enabled. 

## Environment variables

Without replica sets, you can connect to your MongoDB using environment variables that are available on all of your servers:

* MONGODB\_ADDRESS
* MONGODB\_ADDRESS\_INT
* MONGODB\_ADDRESS\_EXT
* MONGODB\_URL
* MONGODB\_URL\_INT
* MONGODB\_URL\_EXT

`MONGODB_ADDRESS` contains the IP address of your MongoDB. In Mongoid for example, it can be used in your mongoid.yml with `host` (mongoid 
 3).

`MONGODB_ADDRESS_INT` and `MONGODB_ADDRESS_EXT` contain the internal and external network addresses for the same server. You usually want to connect to the internal address to avoid paying for traffic between your web servers and database servers. `MONGODB_ADDRESS` is configured with the internal address `{{MONGODB_ADDRESS_INT}}`, but you can [change that](../build-and-config/env-vars.md) if you need.

`MONGODO_URL_INT` contains a MongoDB client friendly URL to the server with its internal address. It usually looks like this:

```shell
mongodb://192.168.12.34:27017/my_database
```

`MONGODO_URL_EXT` contains a MongoDB client friendly URL to the server with its external address. It usually looks like this:

```shell
mongodb://50.45.87.46:27017/my_database
```

`MONGODB_URL` is pointing to  `{{MONGODB_URL_INT}}` by default.

Once replication is enabled, this environment variable is populated:

* MONGODB\_ADDRESSES

`MONGODB_ADDRESSES` contains a comma separated list of all server names of the replica set. This usually looks like something like this:

```shell
lion.myapp.c66.me,tiger.myapp.c66.me
```

Once you have replica set enabled by scaling your MongoDB backend up, you will need to modify your client configuration accordingly. Your deployment might not work and your application might stop functioning if you don't do that.

 Deployments might fail after replica sets are enabled if you don't change your client configuration to use the replica set.