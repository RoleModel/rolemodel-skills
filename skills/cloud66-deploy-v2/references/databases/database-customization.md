# Customizing database configuration


## How to customize database configs

You can customize the database configuration on your servers using [CustomConfig](../custom-config/custom-config.md). CustomConfig is available for MySQL, Postgres, Redis and MongoDB.

Editing and committing your database CustomConfig will perform the following steps on every database server in your application, one by one, sequentially:

- Check your template for Liquid syntax errors
- Determine the correct server configuration and prepare general variables
- Prepare custom variables for your database type (eg. server_state)
- Compile the database configuration based on the information from the server and database type
- Upload the configuration to the server
- Restart your database

A bad database configuration might stop your database from working. Take extra care to make sure the configuration is correct.

### Database customization variables

There are a number of variables available for use in your database CustomConfig. Some are general for all database types, while others are database specific.

#### Global variables

The following variables are available to any database CustomConfig.

|Variable Name|Type|Description|
|--- |--- |--- |
|server|Hash|Hash containing information about your server|
|cloud|string|Application cloud|
|memory|integer|Server memory size (bytes)|
|core|integer|Server core count|

#### MySQL variables

The following variables are only available in the MySQL CustomConfig.

|Variable Name|Type|Description|
|--- |--- |--- |
|server_state|string|Value can be *stand_alone*, *mysql_master* or *mysql_slave* based on your server status|
|server_id|integer|An ID used by MySQL replication to identify your server*|
|db_name|string|Database name|

&#42; Will be 0 for standalone servers, 1 for master servers and a number greater than 1 for replica servers

#### Postgres variables

The following variables are only available in the Postgres CustomConfig.

|Variable Name|Type|Description|
|--- |--- |--- |
|server_state|string|Value can be *stand_alone*, *pg_master* or *pg_slave* based on your server status|

If you need help tuning your Postgres configuration for your servers, [PGTune is an excellent free resource](https://pgtune.leopard.in.ua/). 

#### Redis variables

The following variables are only available in the Redis CustomConfig.

|Variable Name|Type|Description|
|--- |--- |--- |
|server_state|string|Value can be *stand_alone*, *redis_master* or *redis_slave* based on your server status|
|master_address|string|IP address of replication master (empty string if server is stand alone or master)|
|master_port|integer|Will be 6379 when server is *redis_slave* , otherwise it is 0|

## More info

For more information on managing your databases, refer to our [detailed guide](../databases/database-management.md).