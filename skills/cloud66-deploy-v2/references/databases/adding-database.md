# Adding a database to your application


## Overview

Cloud 66 natively supports the following databases:

* MySQL
* Postgres
* Redis
* MongoDB
* InfluxDB

It's perfectly feasible to manually install and use other database engines or datastores as part of your Cloud 66 application. We've simply automated management of the engines listed above because they are the most popular choices. 

There are two main routes to add a database to a Cloud 66 application:

1. As part of the [initial build and deploy process](../getting-started/deploy-your-first-app.md)
2. After the app has already been deployed 

This guide deals with the second of these cases. For the first, please consult our [Getting Started](../getting-started/deploy-your-first-app.md) guide.

## Tutorial

### What you'll need

Before you start, please check you have the following:

* **A Cloud 66 Account** &mdash; If you don't already have one, [sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up). Your first server is free, no credit card required.
* **An existing application set up in Cloud 66** &mdash; To make the most of this tutorial you need to have an app already set up in Cloud 66. Follow our [Getting Started guide](../getting-started/deploy-your-first-app.md) if you're not sure how to do this.

### Adding a database to an existing app

Let's assume that your application was previously completely stateless, but now requires a data layer. As such you've decided to add a database.

There are two ways to add a database to an existing app:
1. Via the Cloud 66 Dashboard
2. Building a new completely new version of the app, and adding the database [during the build process](../getting-started/deploy-your-first-app.md#adding-a-data-source).

Although option 2 might seem extreme, it follows the principle of "immutability". It is always more reliable and more manageable to deploy an updated application as though it were new, rather than trying to patch an existing flawed setup. 

### Configure a database via the Dashboard

To add a database to your existing application:

1. Open your **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav and then *Add Source* in the sub-nav
3. Click the green *+ Add Data Source* button and select a database engine
4. A drawer will open from the left, with configuration options for the server.
5. Click *Add Server* to start the process

You can now watch the logs, as usual to see the progress of the process.

### Testing your new database

Once your database has been deployed, you can test it by logging directly into the server on which it is running via SSH. [Cloud 66 Toolbelt](../toolbelt/using-cloud66-toolbelt.md#access-your-servers-via-toolbelt) is the quickest way to do this. 

You can also use this opportunity to log into your database. You can find the username and password for your server by clicking on the name of any server listed under **Data Sources**.

You now have a fully functional database running as part of your application. 

## Adding logical databases to a server

By default Cloud 66 allocates one i.e. the tables & data structures rather than the "physical" database server ([full definition](../databases/adding-database.md#logical-databases-vs-physical-databases)  per server (or cluster) but it is possible to add additional logical databases to a physical database server (or cluster). 

Additional logical databases can be useful if you need to separate storage of and access to portions of your data but don’t want to add more servers.

To add a logical database to an existing database group:

1. Open your application via the Dashboard
2. Click on ***Data Sources*** in the left-hand nav
3. Click on the name of the Database group you wish to use
4. Click on the *Databases* tab at the top of the main panel
5. Click the *+ Add a Database* button at the top right of the **Databases** panel
6. In the drawer which opens from the left, give your new database a name and assign users to it
7. Click Save

Your new logical database will now be added to your existing server or cluster. You can now log into it via terminal or a database client, and connect it to your application. 

All the logical databases in a physical database group will share the same set of database users. Although users are shared, *permissions* are not. You can still grant or deny access per user to a logical database. You can set user permissions at a database level but not at a table level ([see below](#adding-users-to-logical-databases)).

### Logical databases vs physical databases

In this context a “logical database” is the data itself - the tables and other data structures - rather than the “physical” server(s) and disk(s) on which the database engine is running (which we call “physical databases” to distinguish them).

If a new logical database is added to a database group with multiple servers, then it will exist on all of the servers.

### Adding users to logical databases

Cloud 66 provides two default users for every database:

1. Normal (read / write)
2. Admin 

The two exceptions are:

- Postgres only has an admin user
- MongoDB has a Local Admin (i.e. admin privileges but can only be accessed via localhost) rather than a standard Admin

If you need more users for any of your logical databases (including your default logical database) follow the instructions below to create and assign them. 

You can add custom users to a logical database as follows:

1. Open your application via the Dashboard
2. Click on *Data Sources* in the left-hand nav
3. Click on the name of the Database group you wish to use
4. Click on the *Databases* tab at the top of the main panel
5. Click the *+ Add User*  button at the top right of the **Users** panel
6. In the drawer which opens from the left, enter a user name, assign it to databases and set a level of permission (r/w or admin)
7. Click Save

Your new user will now appear under the **Users** panel. You can click the *Show* link to reveal its password. You can now use these credentials to connect your application (or other client) to the associated logical databases. 

If you create users directly on your database server (e.g. via command line or a database client), we will not be able to display the password in your dashboard.

### Backing up logical databases

If you enable [managed database backups](../databases/database-backups.md), you should be aware of the following:

- Managed binary backups will include **all of your logical databases** and your **database users**. If you restore a version of your database *after* adding users to a later version these new users will effectively be lost (overwritten) by your previous users.
- Managed text backups only include **your primary (default) logical database**. Text backups do not include users.