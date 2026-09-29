# Add MongoDB to your application


## Add MongoDB to your application

To add a MongoDB instance to your application: 

1. Open the **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav 
3. Click on *Add Source* in the sub-nav
4. Click the green *+ Add Data Source* button and select MongoDB
5. A drawer will open from the left, with configuration options for the server.
6. Click *Add Server* to start the process

If you need more help, please read our [how-to guide on managing databases in Cloud 66](../databases/database-management.md).

## Managing users in MongoDB

We support MongoDB authentication by default, and so we will generate a database user and admin user along with passwords. 

All instances of MongoDB managed by Cloud 66 have an additional i.e. the tables & data structures rather than the "physical" database server ([full definition](#logical-databases-vs-physical-databases)  named `admin`. All the users for any logical databases added to a physical MongoDB database group (via Cloud 66’s interfaces) are added to (and queried from) `admin`.

For the **database user**, we set the following roles inside MongoDB:

`["readWriteAnyDatabase", "dbAdminAnyDatabase"]`

For the **admin user**, we set the following roles inside MongoDB:

`["root", { role: "dbAdmin", db: "local" }, { role: "dbAdmin", db: "config" }]`

The admin user can only access the database via `127.0.0.1` so it cannot be used via external IP addresses.

### Logging into a secondary logical database

When you connect to a logical MongoDB database, MongoDB will assume you are using a “local” user (i.e. a user whose credentials are stored in the database to which you are connecting). As such if you need to connect to such a database, you will need to add the following flag to the database URL: `?authSource=admin`

For example: 

```bash
mongodb://USERNAME:PASSWORD@hellogoose.com:27017/DATABASE?authSource=admin
```