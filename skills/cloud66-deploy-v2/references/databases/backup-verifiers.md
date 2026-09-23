# Using database backup verifiers


## What is a backup verifier?

A backup verifier is a great way to ensure that your backups actually contain the data you expect. You simply provide a query that you expect to return a specific result, and we verify that your backup returns this value. 

This feature supports both MySQL and Postgres databases, and requires the use of managed backups. Backup verification runs once every 11 hours for each application, and you will be notified in the case of a failured verification.

The database backup verifier feature currently only applies to Rails/Rack based applications

## Set up a backup verifier

1. Create a file in the .cloud66 folder in the root of your repository. To verify your backups across all environments, name the file: 
 * `backup_verifier_mysql.sql` for MySQL
 * `backup_verifier_pg.sql` for Postgres
You can also specify which environment to run backup verifiers for by appending the environment to the filename. For example:
 * `backup_verifier_mysql_production.sql` or `backup_verifier_pg_staging.sql`.
Additionally you can target ONLY a specific named DB group with a period separator. For example:
 * `backup_verifier_mysql_production.default.sql` or `backup_verifier_pg.mygroup.sql`.

To verify your backup, the script must contain a SQL query that returns a data set containing a single column called "Result" with a value of `true` or `false`. We have examples for each type of database below.

Your backup will be assumed to be verified if the value returned from the query is `true`.

Should you need to change your verification script at some point, simply commit the change to Git and redeploy your code.

### Example query: MySQL

This query will count the number of records in the users table, and returns a 1 if that number is not zero.

```sql
select count(*)<>0 as result from users
```

That query may return the following output (non-zero values are interpreted as true in MySQL), indicating that your users table holds data.

```sql
result
1
```

### Example query: Postgres

This query counts the number of records in the users table, and returns a boolean of true if that number is not zero.

```sql
select count(*)<>0 as result from users
```

The result of this query may be the following, indicating that your users table holds data.

```sql
result
--------
t
```

## View backup verification status

To see your backup verification status, visit your application, and click the link to your managed backup page. A successfully verified backup will display a green tick, and a failure during verification will result in a red cross - clicking on the red cross will show the error message.