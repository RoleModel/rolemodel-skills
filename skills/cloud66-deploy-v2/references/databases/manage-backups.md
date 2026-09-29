# Restoring database backups


## Overview

There are two methods for restoring databases:

* Automated via the Cloud 66 dashboard
* Manually via command line

We recommend using the [managed database backup service](../databases/database-backups.md) to manage and restore database backups, but you can also manage them manually. This includes downloading the backup, decompressing it, moving it to another server and restoring it.

## Automated database restore method

We recommend using the automated restore process to restore backups. To do this:

1. Open the **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click *Data Sources* in the left-hand nav
3. Click the name of database group you wish to restore in the sub nav
4. Click on the *Databases* tab
5. Click on the name of the managed backup
6. Find the backup you wish to restore in the list of recent backups, click the down arrow next to it and select *Restore this backup*
7. Choose the database group on which you wish restore the database
8. Click

Restoring a backup **will** disrupt the target database - we do not recommend restoring to a live database, particularly in production.

If you need to manually download and/or restore a backup, please read our in-depth guide below.

If you restore a [text backup](../databases/database-backups.md#backup-format) of a database, bear in mind it only contains the default logical database from the source physical database. To import all logical databases you will need to use binary backups.

## Manually restoring a backup

The first step in manually restoring a backup is to download the backup files. You can manually retrieve a backup in one of three ways:

### 1. Using Cloud 66 Toolbelt

If you are using managed backups, you can retrieve your database backup by using [Cloud 66 Toolbelt](../toolbelt/_backups-download.md). Your backup may be bigger than 350 MB, in which case it will be divided into several files. By using the toolbelt, the files are downloaded and concatenated automatically for you.

### 2. From your Cloud 66 Dashboard

If you are using managed backups, you can download backups via your Cloud 66 Dashboard. To do so, open your application and click the link for your database backup in the Backups panel.

This page lists your available database backups, and allows you to download and restore each one. Click the download icon and choose one of these options:

1. Copy the script (shell command) by clicking on the link, and then paste this into a terminal (or shell) on the machine where you want the files to be downloaded. This will automatically download and concatenate your backup files to the destination chosen.
2. Click on the "more" link to display the direct link(s) to the backup file(s). These links are only active for a few minutes, so you should use them immediately. Clicking a link will download that file via your browser.

### 3. Via command line

You can also copy the direct links (see above) and then manually `curl` these links to your computer or server. Remember that these links are time-bound - they will expire after a few minutes.

```bash
$ curl -o "YOUR_BACKUP_FILE_NAME" "GENERATED_URL"
```

## Preparing files for manual restoration

After downloading a backup you will need to follow several steps to restore that data. Except for the first two, these steps differ by database engine.

### Concatenate multiple files

*NOTE: This step can be skipped if you use the Toolbelt or script option to download the backup.*

If your total backup is larger than 350MB we will split it across multiple files in increments of 350MB. Before restoring this data, you will need to concatenate (join) these files into a single large file. For example:

```bash
$ cat file.tar-aa file.tar-ab file.tar-ac > file_combined.tar
```

### Unarchive the backup files

*NOTE: This step can be skipped if you use the Toolbelt or script option to download the backup.*

Before manually restoring your data will need to decompress the backup file. The file will be in the `tar` format. To decompress it use:

```bash
$ tar -xvf [tar_file] -C [folder_name]
```

The -C option allows you to choose which folder to extract the files to.

Once you have your files prepared, you can follow the guide for your specific backup format and engine (see below).

## Restoring a MySQL text backup

This is a method for *manually* restoring your MySQL text backup - we only recommend this method if you cannot use the automated method described above. Please also ensure you have prepared your files before proceeding.

**Step 1:** Run following command to flatten the folder

```bash
$ find /path/to/unarchived/folder -type f -exec mv -i {} /path/to/unarchived/folder \;
```

**Step 2:** Run following command to find the data file

```bash
$ find /path/to/unarchived/folder '(' -name '*.sql' -o -name '*.sql.gz' ')' -type f -exec basename {} ';'
```

**Step 3:** If the result of previous step has a *.gz extension run following command to unzip it, unless go to next step.

```bash
$ gzip -d /path/to/unarchived/folder/data_file_from_previous_step
```

**Step 4:** In order to purge old data you can drop your current db and create a new one. To start, you need to set some environment variables.

You can find `YOUR_MYSQL_DB_APP_USERNAME`, `YOUR_MYSQL_DB_APP_PASSWORD`,`YOUR_MYSQL_ADMIN_USERNAME`,`YOUR_MYSQL_ADMIN_PASSWORD` and `YOUR_MYSQL_DATABASE_NAME` on the Cloud 66 Dashboard MySQL server detail page. You can then use these in the commands below:

```bash
$ export $MySQL_DB_APP_USERNAME="YOUR_MYSQL_DB_APP_USERNAME"
$ export $MySQL_DB_APP_PASSWORD="YOUR_MYSQL_DB_APP_PASSWORD"
$ export $MySQL_ADMIN_USERNAME="YOUR_MYSQL_ADMIN_USERNAME"
$ export $MySQL_DATABASE_NAME="YOUR_MYSQL_DATABASE_NAME"
```

**4.1** Use following commands to drop your database

```bash
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD -e "DROP DATABASE $MySQL_DATABASE_NAME ;"
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD -e "FLUSH PRIVILEGES ;"
```

**4.2** Use following command to create a new database

```bash
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD -e "CREATE DATABASE $MySQL_DATABASE_NAME CHARACTER SET utf8;"
```

**4.3** Use following commands to revoke user privileges

```bash
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD -e "REVOKE ALL PRIVILEGES ON $MySQL_DATABASE_NAME.* FROM '$MySQL_DB_APP_USERNAME'@'localhost';"
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD -e "REVOKE ALL PRIVILEGES ON $MySQL_DATABASE_NAME.* FROM '$MySQL_DB_APP_USERNAME'@'%';"
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD -e "FLUSH PRIVILEGES;"
```

**4.4** Use following commands to give enough permission to you app user

```bash
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD -e "GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,INDEX,ALTER,LOCK TABLES,CREATE VIEW,SHOW VIEW,EXECUTE,TRIGGER,CREATE TEMPORARY TABLES,CREATE ROUTINE,ALTER ROUTINE,EXECUTE,REFERENCES ON $MySQL_DATABASE_NAME.* TO '$MySQL_DB_APP_USERNAME'@'localhost';"
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD -e "GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,INDEX,ALTER,LOCK TABLES,CREATE VIEW,SHOW VIEW,EXECUTE,TRIGGER,CREATE TEMPORARY TABLES,CREATE ROUTINE,ALTER ROUTINE,EXECUTE,REFERENCES ON $MySQL_DATABASE_NAME.* TO '$MySQL_DB_APP_USERNAME'@'%';"
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD -e "FLUSH PRIVILEGES;"
```

**Step 5:** Finally, use the following command to restore your database:

```bash
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD $MySQL_DATABASE_NAME < /path/to/unarchived/folder/data_file
```

## Restoring a MySQL Binary backup

 This is a method for *manually* restoring your MySQL binary backup - we only recommend this method if you cannot use the automated method described above. Please also ensure you have prepared your files before proceeding.

You need Percona innobackupex to be able to restore a MySQL binary backup. Percona innobackupex is installed on your MySQL server if it is provisioned by Cloud66. If you need to install it on another server, [follow this guide](https://www.percona.com/doc/percona-xtrabackup/2.3/installation/apt_repo/).

**Step 1:** Find the Percona backup folder. Run following command to find it:

```bash
$ find /path/to/unarchived/folder -name ibdata1 -type f -exec dirname {} ';'
```

**Step 2:** Find the MySQL Data Directory . You should be able to find it in MySQL configuration file (`my.cnf`). In normal MySQL installation you can find MySQL configuration file in **/etc/mysql** path. Open my.cnf and search for **datadir** in **MySQLd** section.

**Step 3:** Stop the MySQL service :

Ubuntu 18.04 & 20.04
```bash
$ sudo systemctl stop MySQL
```

**Step 4:** Use following command to delete the MySQL data directory

```bash
$ sudo rm -rf /path/to/your/MySQL/data/directory
```

Please make a copy of the MySQL data directory before deleting it so that you can restore if something goes wrong.

**Step 5:** Use following command to create a blank MySQL data directory

```bash
$ sudo mkdir -p /path/to/your/MySQL/data/directory
```

**Step 6:** Run following command to restore the Percona backup folder (from step 1)

```bash
$ sudo innobackupex --copy-back /path/to/percona/backup/folder
```

**Step 7:** Run following command to fix the permissions on the MySQL data directory :

```bash
$ sudo chown -R MySQL:MySQL /path/to/your/MySQL/data/directory
```

**Step 8:** Start MySQL service

For Ubuntu 18.04 & 20.04 use:
```bash
$ sudo systemctl start MySQL
```

## Restoring a Postgres text backup

 This is a method for *manually* restoring your Postgres text backup - we only recommend this method if you cannot use the automated method described above. Please also ensure you have prepared your files before proceeding.

**Step 1:** Run following command to flatten the folder

```bash
$ find /path/to/unarchived/folder -type f -exec mv -i {} /path/to/unarchived/folder \;
```

**Step 2:** Run following command to find the data file

```bash
$ find /path/to/unarchived/folder '(' -name '*.sql' -o -name '*.sql.gz' ')' -type f -exec basename {} ';'
```

**Step 3:** If the result of previous step has a *.gz extension run following command to unzip it, unless go to next step.

```bash
$ gzip -d /path/to/unarchived/folder/data_file_from_previous_step
```

**Step 4:** On order to clean old data you can drop your current db and create a new one. You can use following scripts to drop and recreate your database but first you need to set some environment variables.
You can find YOUR_PG_DATABASE_NAME and YOUR_PG_APP_USERNAME in Cloud 66 Dashboard Postgres server detail page.

```bash
$ export $PG_DATABASE_NAME=YOUR_PG_DATABASE_NAME
$ export $PG_APP_USERNAME=YOUR_PG_APP_USERNAME"
```

**4.1** Use following command to stop all the activities on your db

```bash
$ sudo -u postgres psql -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$PG_DATABASE_NAME' AND pg_stat_activity.pid <> pg_backend_pid();"
```

**4.2** Use following command to drop your database

```bash
$ sudo -u postgres psql -c 'DROP DATABASE IF EXISTS $PG_DATABASE_NAME'
```

**4.3** Use following command to create a new database

```bash
$ sudo -u postgres psql -c "CREATE DATABASE $PG_DATABASE_NAME WITH encoding 'unicode'"
```

**4.4** If you are using **postgis** use following commands to add it to newly created database

```bash
$ sudo -u postgres psql -d $PG_DATABASE_NAME -c "CREATE EXTENSION postgis;"
$ sudo -u postgres psql -d $PG_DATABASE_NAME -c "CREATE EXTENSION postgis_topology;"
$ sudo -u postgres psql -d $PG_DATABASE_NAME -c "CREATE EXTENSION fuzzystrmatch;"
$ sudo -u postgres psql -d $PG_DATABASE_NAME -c "CREATE EXTENSION postgis_tiger_geocoder;"
```

**Step 5:** You can use following command to restore your database

```bash
$ MySQL -u $MySQL_ADMIN_USERNAME -p$MySQL_ADMIN_PASSWORD $MySQL_DATABASE_NAME < /path/to/unarchived/folder/data_file
$ pg -U $PG_APP_USERNAME --no-password $PG_DATABASE_NAME < /path/to/unarchived/folder/data_file
```

## Restoring a Postgres binary backup

 This is a method for *manually* restoring your Postgres binary backup - we only recommend this method if you cannot use the automated method described above. Please also ensure you have prepared your files before proceeding.

**Step 1:** You need to find the main backup folder in unarchived folder. Run following command to find it :

```bash
$ find /path/to/unarchived/folder -name raw -type d
```

**Step 2:** Stop the postgresql service :

Ubuntu 18.04 & 20.04
```bash
$ sudo systemctl stop postgresql
```

**Step 3:** Use following command to delete the Postgres data directory

```bash
$ sudo rm -rf /usr/local/pgsql/data
```

Please take a backup from the Postgres data directory before deleting it to be able to restore if something goes wrong.

**Step 4:** Use following command to create a blank Postgres data directory

```bash
$ sudo mkdir -p /usr/local/pgsql/data
```

**Step 5:** Use following command to copy the content of main backup folder (step 1)
```bash
$ sudo cp -a /path/to/unarchived/folder/main/backup/. /usr/local/pgsql/data/
```

**Step 6:** Run following command to fix the permission of Postgres data directory :

```bash
$ sudo chown -R postgres:postgres /usr/local/pgsql/data
```

**Step 7:** Start the postgresql service

Ubuntu 18.04 & 20.04
```bash
$ sudo systemctl start postgresql
```

## Restoring a Redis backup

 This is a method for *manually* restoring your Redis backup - we only recommend this method if you cannot use the automated method described above. Please also ensure you have prepared your files before proceeding.

**Step 1:** Run following command to flatten the folder

```bash
$ find /path/to/unarchived/folder -type f -exec mv -i {} /path/to/unarchived/folder \;
```

**Step 2:** Run following command to find the data file

```bash
$ find /path/to/unarchived/folder '(' -name '*.rdb' -o -name '*.rdb.gz' ')' -type f -exec basename {} ';'
```

**Step 3:** If the result of previous step has a *.gz extension run following command to unzip it, unless go to next step.

```bash
$ gzip -d /path/to/unarchived/folder/data_file_from_previous_step
```

**Step 4:** Use following command to stop Redis service :

```bash
$ sudo systemctl redis.service stop || sudo service redis stop
```

**Step 5:** Use following command to delete Redis data file

```bash
$ sudo rm -rf /data/redis/dump.rdb
```

Please take a backup from Redis data file before deleting it to be able to restore if something goes wrong.

**Step 6:** Use following command to copy new data file

```bash
$ sudo cp -a /path/to/unarchived/folder/data_file /data/redis/dump.rdb
```

**Step 7:** Run following command to fix the permission of Redis data directory :

```bash
$ sudo chown -R redis:redis /data/redis
```

**Step 8:** Run following command to start Redis service

```bash
$ sudo systemctl redis.service start || sudo service redis start
```

## Restoring a MongoDB backup

 This is a method for *manually* restoring your MongoDB backup - we only recommend this method if you cannot use the automated method described above. Please also ensure you have prepared your files before proceeding.

**Step 1:** Run following command to see if there is database folder in unarchived folder (Replace YOUR_DATABASE_NAME with correct value):

```bash
$ find /path/to/unarchived/folder -name YOUR_DATABASE_NAME -type d
```

If the command returns a result, that is data directory we want to restore. Go to final step.

**Step 2:** Run following command to flatten the folder

```bash
$ find /path/to/unarchived/folder -type f -exec mv -i {} /path/to/unarchived/folder \;
```

**Step 3:** Run following command to find the data file

```bash
$ find /path/to/unarchived/folder '(' -name 'MongoDB.tar' -o -name 'Mongo*.tar.gz' ')' -type f -exec basename {} ';'
```

If the result of command has a *.gz extension go to 3.1 otherwise use 3.2

**3.1**

```bash
$ tar -xvf /path/to/unarchived/folder/Mongo*.tar.gz -C /path/to/unarchived/folder && find /path/to/unarchived/folder -type f -exec mv -i {} /path/to/unarchived/folder \;
$ rm -rf /path/to/unarchived/folder/Mongo*.tar.gz
$ rm -rf /path/to/unarchived/folder/MongoDB
```

**3.2**

```bash
$ tar -xvf /path/to/unarchived/folder/MongoDB.tar -C /path/to/unarchived/folder && find /path/to/unarchived/folder -type f -exec mv -i {} /path/to/unarchived/folder \;
$ rm -rf /path/to/unarchived/folder/MongoDB.tar
$ rm -rf /path/to/unarchived/folder/MongoDB
```

**Step 4:** Run following command to clean the unzipped folder (Replace YOUR_DATABASE_NAME with correct value) :

```bash
$ rm -rf /path/to/unarchived/folder/YOUR_DATABASE_NAME
$ find /path/to/unarchived/folder -empty -type d -delete
```

**Step 5:** Run following command to restore MongoDB.
If the step 1 has a result use that as /path/to/database/back unless use /path/to/unarchived/folder . Also replace YOUR_DATABASE_NAME with correct value

```bash
$ mongorestore --drop --db YOUR_DATABASE_NAME /path/to/database/back
```

## Migrating data between applications

You can use automated database backups to migrate data between applications using the Dashboard, but there are some format restrictions when doing so:

|DB Engine|Compatible backup format(s) for migration|
|--- |--- |
|MySQL|Text only|
|Postgres|Text only|
|Mongo|Either|
|Redis|Either|

This only applies to migrations between applications - restores to the original database (i.e. in the same application) will work regardless of format.

To migrate data between applications:

1. Add a new [database group](../databases/attaching-multiple-databases.md) of the same type (e.g. MySQL) to the destination application
2. Click *Data Sources* in the left-hand nav, and then the name of the destination database
3. Click the down arrow next to the target database server and select **Import Database**
4. Choose the source application and database (i.e. where you're pulling the backup from) and click *Import* - this will automatically "restore" the latest database backup to your new server.

Remember to wait for the task to be completed before you start trying to use the database for anything.