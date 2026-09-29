# Managing databases


## Overview

We currently support the following databases, with no need for additional configuration after deployment.

* MySQL (or Percona if [configured via Manifest](../manifest/_mysql.md)
* Postgres
* MongoDB
* Redis
* InfluxDB
* SQLite (only in development environments)

## How to deploy databases with Cloud 66

For Rack-based stacks, Cloud 66 automatically detects whether your application relies on a database or not during your code analysis. This is based on a combination of your Gemfile and your `database.yml` or `mongoid.yml` files.

When creating a Cloud 66 application, you can add as many databases as you need in your [service configuration](../build-and-config/docker-service-configuration.md#database-configurations) during the application build.

After you have analyzed your code, ensure that your desired database type is displayed in the _About your app_ section of the analysis results.

Cloud 66 supports multiple databases for Rails (i.e. multiple databases with Active Record). Please read our [MultiDB for Rails guide](https://help.cloud66.com/deploy/2/databases/rails-multidb) to learn how to configure this feature.

### Adding databases after initial deployment

You can add databases to an existing application either by using [Database Groups](../databases/attaching-multiple-databases.md) for physical databases, or by [adding](../databases/adding-database.md#adding-logical-databases-to-a-server) i.e. the tables & data structures rather than the "physical" database server ([full definition](#logical-databases-vs-physical-databases)  to your existing physical database(s)

## Database authentication

When we deploy a database we automatically generate the required users and passwords to allow authentication. You can find these values via your Dashboard in the [detail page of any database server](../databases/connect-db-servers.md#finding-database-credentials). They will be available as environment variables and your application will be configured to use them.

**MySQL** and **Postgres** databases managed by Cloud 66 automatically have the following users created:

- a Database Application user
- a Database Admin user
- a Database Replication user (where replication is required)

The Application and Replication users always have **the same password**. The associated Linux users for these will differ depending on database type.

If you switch to managing your passwords manually, be sure to update all of these users whenever you change passwords. Remember that the Application and Replication users must use the same password.

If you'd prefer to manage your users and password manually (i.e. your config files), you can [prevent your configs from being modified](https://help.cloud66.com/deploy/2/databases/tamper-with-yaml).

The info above **does not apply** to external (self-managed) databases. See the [dedicated section below](#migrating-to-an-external-database) for more details.

### Managing YAML configs

A Rails app must have either a `config/database.yml` file or `config/mongoid.yml` in order to work on Cloud 66. We will create these files automatically if they don't exist. We will update any existing files with new values (for example passwords) as required. You can [turn this feature off](https://help.cloud66.com/deploy/2/databases/tamper-with-yaml) if needed. (See [below](#environment-variables-during-deployment) for more on env vars)

If you want to specify a different DB config per environment, you can name the files `config/database.yml.environment-name` (e.g. `config/database.yml.dev`)

If you don't want to use the standard config setup, you can also add a `config/database.yml.cloud66` or `config/mongoid.yml.cloud66` file instead.

We will prioritise these configs as follows:

1. Files ending `.cloud66`
2. Files ending with a `.environment-name`
3. The standard YAML config file

 The info above **does not apply** to external (self-managed) databases. See the [dedicated section below](#migrating-to-an-external-database) for more details.

### External databases

If you are using an external database (i.e. one not managed by Cloud 66), then we **won’t** set any of the database variables (such as username and password) the way we would normally do. You will need to set these yourself - either in your YAML config file, or by manually adding environment variables (see below).

If your `database.yml` file has a `url` defined, we will assume that you are using an external (self-managed) database, and will follow that URL accordingly.

External databases **do not** natively support multiple database config files (e.g. per environment), or files with the `.cloud66` suffix. If you need to maintain separate config files for your external databases, you can achieve the same thing using a [deploy hook](../deploy-hooks/deploy-hooks.md). For example:

```yaml
after_checkout:
- command: mv $STACK_PATH/config/database.yml.cloud66 $STACK_PATH
  config/database.yml
  target: rails
  run_on: all_servers
  execute: true
```

This hook simply overwrites the standard config file with the config file of your choice at the start of the deployment process. Please read our [full guide to deploy hooks](../deploy-hooks/deploy-hooks.md) to learn how to implement this hook.

### Environment variables during deployment

When you set up an application on Cloud 66, we detect its database type(s) (from your code) and generate a set of variables for things like `username` and `password` and `URL`. We only generate these "analyzed variables" **after** you have confirmed that we will be managing the database(s).

You can see a list of these variables during application creation by clicking on the *Add Environment Variables* button (in the yellow **Review your Rails application** box) . You will see the list of analyzed variables for your database(s) at the top of the panel.

For databases that we manage, we will generate all of these variables, and replace any existing variables you have in your YAML config files unless you [turn the auto-replacement feature off](https://help.cloud66.com/deploy/2/databases/tamper-with-yaml). (You can also override the values of these variables manually, one by one, if you wish - see below)

If your application uses an externally hosted (self-managed) database, **we will not generate any of the analysed variables**. If your config files rely on environment variables, you will need to set these manually before you deploy, or we will not be able to connect to your database.

### Setting variables manually (overriding)

To add your own values to the analyzed variables, click on the *Add Environment Variables* button and then click the *Override* link next to each of the variables you wish to update. Remember, for **external databases**, we will discard any variables which do not have values set manually.

## Connecting your container to your DB

Databases in Cloud 66 run as separate components and aren't containerized. Even though they may be running on the same private network as your cluster servers, you will not be able to connect to them via localhost because of the nature of containers (which are, by definition, abstracted from operating the system).

Instead, we we automatically create a Kubernetes services for each DB that connects out from your cluster to the database server(s). To see these on your cluster, you can list the namespaces and then select your namespace and list the services associated with it with the following commands:

```bash
$ kubectl get namespaces
$ kubectl -n <your-namespace> get svc
```

This will show you all the services running, some of which will be your databases.

### Service names for database groups

If your application has two or more [database groups](../databases/attaching-multiple-databases.md), your Kubernetes database services will inherit those names. For example, if you have three MySQL database groups named `main`, `spare` and `archive` then the Kubernetes services will be named:

- mysql-main
- mysql-spare
- mysql-archive

If one of these groups is set as your "[primary](../databases/attaching-multiple-databases.md#understanding-primary-database-groups)" then it will use the default service name (`mysql`) instead of its group-specific name.

### Connection strings

A typical connection string might have:

- The protocol
- The username and password (where required)
- The name of the Kubernetes service, including database groups (e.g. `mongodb-spare`)
- The name of the DB server (e.g. `mongo_production_1`)

So to connect to a MongoDB server named `mongo_production_1` and running in your app namespace as `mongodb-spare` you would use something like:

```shell
$ mongodb://mongodb-spare/mongo_production_1
```

A similar setup for a Postgres server would look something like this:

```shell
$ postgresql://username:password@service_name/database
```

## Connecting your app to your DB in Cloud 66 Container Service V1

To connect to a database in Version 1 of Cloud 66 Container Management Service (CSv1), you should use its ElasticDNS address. Please read our [full guide on ElasticDNS](/deploy/1/networking/service-network-configuration#elasticdns) for more details.

## Database deployment types

### No database (external)

This option allows you to deploy your application without a database managed by Cloud 66, and is ideal for externally hosted databases.

For Rails apps, if you have a `url` set in your `database.yml` then we will assume that you are using an external DB. You will need to [set your own env vars](#environment-variables-during-deployment) during deployment, to ensure we can connect to it.

You can also configure an external database via your [Manifest file](../manifest/_database-groups.md) by specifying the `server` node as `external`.

Please note that if there is no connectivity to your external database, or your external database host is not configured correctly, the deployment will fail.

### Local database

This option deploys your chosen database to the same server as your web server - this is intended primarily for development, as running your database locally in production is not advised. In this case, your application database configuration will be amended to target your local database server. If you scale up your web server, these settings will also be amend automatically to reflect your database configuration.

### Dedicated database

This option will automatically create a new server for your database and configure your application accordingly.

## Upgrading your database

Cloud 66 will not do in-place database upgrades, because this process may cause your application to stop working or may not be possible automatically.

You have two options for upgrading your database through Cloud 66:

1. Using [Database Groups](../databases/attaching-multiple-databases.md)
2. Cloning your entire application

These options are described in full below.

### Upgrading databases using Groups

To upgrade your database(s) using Groups:

1. [Add a new Database Group](../databases/attaching-multiple-databases.md#adding-a-database-group-to-an-app) to your application - this will automatically create a Group with the latest version of your chosen engine
2. Migrate your data from your existing database to your new Group - using [database backups](../databases/database-backups.md) is usually the quickest and easiest way
3. Test that your application can connect to and read your new database
4. Switch your application configuration to use the new Group
5. Remove the old Database Group

### Cloning your application

You can make a new instance of your application by [cloning it](../cloud-66-101/adding-updating-deleting.md#clone-an-application). We will provision new components for your application, which will use the latest versions by default. Be sure to check that you have not locked any component versions using your [Manifest file](../manifest/what-is-a-manifest-file.md).

Once the new application is created, you can migrate data from your old application to your new application.

## How to run database schema migrations

If you’ve made structural changes to your databases, you will typically need to run migration commands during your build process, so that those changes are applied to your live database. The nature of these commands depend on your framework.

To do this in Cloud 66, you should add the commands to your `service.yml` file using the following syntax:

```yaml
deploy_command: <migration commands for your app>
```

So, for example, the service definition for a Django app with a migration enabled might look as follows:

```yaml
version: 2
services:
  helloworld:
    git_url: git@github.com:my-account/my-repo.git
    git_branch: master
    deploy_command: python manage.py migrate
    ports:
    - :container: 5000
      :http: 80
databases:
- mysql

```

## Control your Rails database migrations

Cloud 66 chooses a server to perform the migrations - all other servers will wait until the migrations are finished before continuing with deployment. You can see which server performs the migrations in the application, and change it using the `c66.migrations.run` [reserved tag](../servers/reserved-tags.md).

You can control your Rails database migrations by setting the `run.deploy.command` option through application settings via
[Toolbelt](../toolbelt/using-cloud66-toolbelt.md) which gives you the option of running migrations or not.

```shell
$ cx settings set -s my_stack run.deploy.command true
```

When you have disabled `run.deploy.command` in [Application settings](../toolbelt/_settings-set.md), you still have the option to run migrations on a one-off deployment by clicking _Deploy_ -> _Deploy with options_ and selecting _Run database migrations_.

## The Strong Migration gem

Sometimes operations can cause database migrations to lock the entire database for minutes at a time - even if the structural change is simple, or made to a relatively small table. If you'd like to understand the mechanisms behind this, we recommend reading this excellent [blog post](https://medium.com/doctolib/stop-worrying-about-postgresql-locks-in-your-rails-migrations-3426027e9cc9).

To mitigate the potential for this to happen, we recommend including the [Strong Migration](https://github.com/ankane/strong_migrations) gem in your application. This will catch any potentially unsafe migrations and suggest how to avoid or reduce the risk.

## Customize your database configuration

You can customize the database configuration on your servers using [CustomConfig](../custom-config/custom-config.md). CustomConfig is available for MySQL, Postgres, Redis and MongoDB.

Editing and committing your database CustomConfig will perform the following steps on every database server in your application, one by one, sequentially:

- Check your template for Liquid syntax errors
- Determine the correct server configuration and prepare general variables
- Prepare custom variables for your database type (e.g. server_state)
- Compile the database configuration based on the information from the server and database type
- Upload the configuration to the server
- Restart your database

 A bad database configuration might stop your database from working. Take extra care to make sure the configuration is correct.

### Database customization variables
There are a number of variables available for use in your database CustomConfig. Some are general for all database types, while others are database specific.

**Global variables**

The following variables are available to any database CustomConfig.

|Variable Name|Type|Description|
|--- |--- |--- |
|server|Hash|Hash containing information about your server|
|cloud|string|Application cloud|
|memory|integer|Server memory size (bytes)|
|core|integer|Server core count|

**MySQL variables**

The following variables are only available in the MySQL CustomConfig.

|Variable Name|Type|Description|
|--- |--- |--- |
|server_state|string|Value can be *stand_alone*, *mysql_master* or *mysql_slave* based on your server status|
|server_id|integer|An ID used by MySQL replication to identify your server*|
|db_name|string|Database name|

&#42;It is 0 for standalone servers, 1 for master servers and a number greater than 1 for slave servers

**Postgres variables**

The following variables are only available in the Postgres CustomConfig.

|Variable Name|Type|Description|
|--- |--- |--- |
|server_state|string|Value can be *stand_alone*, *pg_master* or *pg_slave* based on your server status|

**Redis variables**

The following variables are only available in the Redis CustomConfig.

|Variable Name|Type|Description|
|--- |--- |--- |
|server_state|string|Value can be *stand_alone*, *redis_master* or *redis_slave* based on your server status|
|master_address|string|IP address of replication master (empty string if server is stand alone or master)|
|master_port|integer|Will be 6379 when server is *redis_slave* , otherwise it is 0|

## Migrating to an external database

If you need to migrate a database managed by Cloud 66 to an external provider, you should bear in mind the following:

- Updating your [Manifest file](../manifest/_database-groups.md) will not be sufficient to reconfigure your application - you will need to connect your application manually to your new database servers, including authentication credentials, ideally via your app’s [environment variables](../build-and-config/env-vars.md).
- Your existing database servers will need to be manually removed from your application after you have migrated. They will not be automatically removed or deleted.

The exact migration process will differ widely depending on both the database used, and the host to which you are migrating your data, but all of them share the following steps:

1. Switch off your application ([maintenance mode](../deployment/using-maintenance-mode.md) is useful here)
2. Migrate your data to the new host
3. Set up authentication credentials and connection details
4. Add a [firewall rule](../security/firewall-rule.md) to allow your app to reach the new data host (and vice versa)
5. Turn your application back on
6. Delete your defunct Cloud 66 database servers