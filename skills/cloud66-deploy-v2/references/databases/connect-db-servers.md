# Connecting to database servers


There are two ways to connect to your databases:

* Accessing the server directly via SSH and then logging in using terminal commands
* Using a desktop database client

    You can connect your databases using any database client.

If you need help connecting your application code to your database via a connection string, consult our [database management guide](../databases/database-management.md).

## Via SSH

You can connect directly into your database server and invoke a database console from there. To do that, please refer to our [SSH guide](../servers/ssh-to-server.md) documentation.

You can find your database's usernames and passwords on the database server page. [See below](#finding-database-credentials) for more details on how to find that page.

## With a client

To use a database client, you will first need to add a firewall rule to allow traffic from your desktop to your Cloud 66 application. You can [follow our guide](../security/firewall-rule.md) on the subject.

Once the firewall is open you can use a database client from your local computer to access the public IP address of the server hosting the database. See the next section for more details.

## Finding database credentials

All of your database usernames and passwords as well as its public IP address can be found on the server pages in your Cloud 66 Dashboard. To find the credentials for a database:

1. Log into your [Cloud 66 Dashboard](https://app.cloud66.com/)
2. Click on the name of your application
3. Click *Data Sources* in the left-hand nav
4. Click the name of database group in the sub-nav
5. Click on the name of an individual database server to see all its details
6. You can select the *Show* checkbox to reveal the passwords, or use the clipboard icon to copy them directly.

### Root credentials

1. Head to the **Clusters** section on the dashboard and click on the name of the cluster your database is in.
2. Click on the **Data Sources** on the left-hand nav.
3. There you can see the Username and Password for this database in a hidden state, click to reveal them.

### Application credentials
1. Head to the **Application** section on the dashboard and click on the name of the application your database is in.
2. Click on the application you need the credentials for.
2. Click on the **Data Sources** on the left-hand nav.
3. Click on *Connection Info* to see all the details of the database server.

## Connecting from your apps

To connect to your database from any application, you can use environment variables. Cloud 66 creates a few of these for you and populates them with the necessary connection details.

### Database name

If your chosen database type supports named databases (like Postgres), a random database name will be generated for you. You can change this via the UI where you view your database connection information. This value is for your information only and is used in helpful connection strings and environment variables, but not used by Cloud 66.

### Readonly environment variables

For each deployed database on your cluster, we create a set of readonly environment variables that point to that specific database and its credentials. These variables are named in a consistent format, with the database name as a suffix.

For example, if you add a Postgres database, you’ll see variables like:

```
POSTGRESQL_MARS_ADDRESS   -> The address of your database service within the cluster
POSTGRESQL_MARS_USERNAME  -> A username your application can use to connect
POSTGRESQL_MARS_PASSWORD  -> A password your application can use to connect
POSTGRESQL_MARS_DATABASE  -> The database name (see above)
POSTGRESQL_MARS_URL       -> A full DSN (connection string) including all of the above
```

### Default editable placeholders

Most programming frameworks and libraries have standardized naming conventions for database connection strings. For example, in Rails, the MySQL database name is typically named `MYSQL_DATABASE`. To make it easier for your applications to connect to the database, we also create standard names for each of the variables and point them to the readonly version. This way you can change the variable name or override the value, if you need, while keeping the original variable values also accessible. This also helps in cases of switching databases from one to another.

```
POSTGRESQL_ADDRESS  => POSTGRESQL_MARS_ADDRESS
POSTGRESQL_USERNAME => POSTGRESQL_MARS_USERNAME
POSTGRESQL_PASSWORD => POSTGRESQL_MARS_PASSWORD
POSTGRESQL_DATABASE => POSTGRESQL_MARS_DATABASE
POSTGRESQL_URL      => POSTGRESQL_MARS_URL
```

Right now, these environment variables are only created during the initial creation of a new application. If you add/remove database connections from an existing application you will need to amend these variables yourself.