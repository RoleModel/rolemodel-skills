# Backing up databases


## Overview

Cloud 66 supports two types of backups: _managed_ and _unmanaged_.

### Managed backups

Using managed backups has several benefits:

- You can easily [restore](../databases/manage-backups.md) or download database backups using the Dashboard or [Toolbelt](../toolbelt/_backups-download.md) (CLI)
- [Backup verifiers](../databases/backup-verifiers.md) ensure that your backups actually contain what you expect
- Allows you to use [database replication](../databases/database-replication.md) to scale your databases
- Managed Backups are stored in Cloud 66's secure storage

- You can easily restore or download database backups using the Dashboard or Toolbelt (CLI)
- Allows you to use [database replication](../databases/database-replication.md) to scale your databases
- Managed Backups are stored in Cloud 66's [secure storage](#managed-backup-storage-locations)

The 100 most recent managed backups are kept by default. 

### Unmanaged backups

Unmanaged backups are stored on your local server and are available under `/var/cloud66/backups`. The 10 most recent unmanaged backups are kept by default. We don't charge for unmanaged backups.

In order for unmanaged backups to work, you must have twice as much disk space on your server as your backup consumes.

## Enabling database backups

1. Open the **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click *Data Sources* in the left-hand nav
3. Click the name of database group you wish to back up
4. Click *+ Add Backup* in the yellow panel below the main panel
3. Configure your backups as needed and click *Create Backup*

We do not automatically delete managed backups when database groups are deleted in order to preserve data should it be needed for any reason. This may result in [orphaned backups](#managing-orphaned-backups). 

## Managed backup disk space requirements

Although managed backups are stored separately from servers, the creation of each backup is run on your database server before the archive is moved to Cloud 66’s managed backup servers.

As such your server requires enough disk space to (temporarily) hold a single database backup. If your server is low on disk space you may encounter an error like this:
`Not enough free space. You need at least xxx MB free space for this backup`

Before taking backups we calculate the size of your data directory and make sure that your server has **at least twice** that much storage free. This ensures that the backup doesn’t fill up the hard drive entirely. 

We have suggested some methods for adding or clearing up disk space below, but before proceeding we recommend you have a solid grasp on how disks and volumes work in Ubuntu (and Linux in general). This [excellent thread](https://stackoverflow.com/questions/24429949/device-vs-partition-vs-file-system-vs-volume-how-do-these-concepts-relate-to-ea), this [guide to mount command](https://www.computerhope.com/unix/umount.htm), and this [guide to partitions](https://tldp.org/LDP/sag/html/partitions/) explain all the concepts.

### Resolving space issues

There are three main ways to resolve a lack of storage space:

### 1. Add additional disk space to your cloud server

Attach a new disk to your server and mount `"/var/cloud66/backups"` on the new disk. Please remove the existing `/var/cloud66/backups` by running `"sudo rm -rf /var/cloud66/backups"` before mounting `"/var/cloud66/backups"`.

You can mount the volume using a command like this:

```json
$ mount -o discard,defaults,noatime /dev/disk/by-id/<ID-OF-DISK> /var/cloud66/backups
```

Your cloud provider will provide the **ID of the disk**, as well as its path (usually under `/dev`). Note that this is different from the default name of the volume that they create for you.

If you want your disk mount to persist after the server is restarted, you should use a command like this one: 

```bash
$ echo "/dev/disk/by-id/<ID-OF-DISK> /var/cloud66/backups ext4 discard,nofail,defaults 0 0" >> /etc/fstab
```

### 2. Clear your server of unneeded files

Your server may have outdated or unneeded files (logs are a common culprit). A handy way to identify these is to use the `ncdu` command - [this comprehensive guide](https://computingforgeeks.com/ncdu-analyze-disk-usage-in-linux-with-ncdu/) explains how to install and use `ncdu`.

### 3. Disable backup size checks

If you are confident that you have enough space and the first option is not possible, you can use the [Cloud 66 Toolbelt](../toolbelt/_settings-set.md) to run `"cx settings set -s STACK_NAME db.check.backup.size false"` where `STACK_NAME` is the name of your application. This will disable backup size checks.

 If your server does not have enough space to accommodate the backup, this setting could cause the backup to fail, or the server disk to be fully utilised

## Restoring database backups

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

If you need to manually download and/or restore a backup, please read our in-depth guide on [manually restoring database backups](../databases/manage-backups.md#manually-restoring-a-backup).

## Backup format

The backup format for redis and mongodb is always **binary**.  For _MySQL_ and _Postgres_ you can choose between **binary** and **text**. 

### Binary

A binary backup is a snapshot of the data folder of your database service along with necessary log files. The result is a data folder which can be restored on your server to return it to the same state as it was at the time of backup. 

As this backup contains raw data of your database server (rather than a human readable SQL dump file) you can expect much faster backup/restore process, particularly for large databases. This method can be up to 4 times faster which can be very helpful in failover scenarios. But there are some limitations:

- You cannot restore it on a server with different version of the database engine
- You cannot use it on replica servers
- You cannot use it on servers with data folders symlinked to other locations
- You cannot use it on encrypted databases 
- You need to shut down the database service during the restore 
- Binary backups will include all i.e. the tables & data structures rather than the "physical" database server ([full definition](#logical-databases-vs-physical-databases) and all database users 

### Text

For this format we generate a dump file with SQL commands that, when fed back to the server, will recreate the database in the same state as it was at the time of the dump.

As the output of the backup is a SQL dump file, you can use it to import your data to other servers or when you want to upgrade your server version but restore process will be much longer than *binary*, particularly if you have lots of indexes in your database.

Text backups will only include your primary (default) i.e. the tables & data structures rather than the "physical" database server ([full definition](#logical-databases-vs-physical-databases). To back up additional logical databases in text format, you will need to do so manually or you will need to use binary backups instead. 

The benefits of this type of backup are: 

- You can restore this backup while the server is running.
- You can move backup jobs to your replica servers (if available) to reduce your master server load
- You can restore backups between application

## Backup options

### Backup schedule

You can specify how often you would like to backup your database. Your options are:
 
- Hourly 
- Daily 
- Weekly 
- Monthly 

### Compression

You can specify whether or not you would like to Gzip compress your backups. Compressing your backups will take up less space, but will require additional processing during the compression.  

### Exclude tables

This option only applies to **text** MySQL and Postgres backups.  You can provide a comma separated list of tables which you want to exclude from your backup to create a smaller one.   

### Install on replica

This option only applies to **text** MySQL and Postgres and to redis (binary) backups. With this option you can move the backup service to your database replica if available, to relieve pressure on your production database. 

Adding or removing a Postgres binary backup requires a service restart.

## Managing orphaned backups

If you delete an entire database group for which you had **managed backups** enabled, we do not automatically delete those backups. Instead we place them in a group under your *Data Sources* in your Dashboard (the group will have the “backups” suffix). You can choose to delete these backups or to maintain them for a period of time.

## Backing up logical databases

If you have [added](../databases/adding-database.md#adding-logical-databases-to-a-server) any i.e. the tables & data structures rather than the "physical" database server ([full definition](#logical-databases-vs-physical-databases)  to any Database Group(s) you should be aware of the following:

- Managed binary backups will include **all of your logical databases** and your **database users**. If you restore a version of your database *after* adding users to a later version these new users will effectively be lost (overwritten) by your previous users.
- Managed text backups only include **your primary (default) logical database**. Text backups do not include users.

## Pricing of managed backups

We charge per GB (or part thereof) of data stored for managed backups. See our [pricing page](https://www.cloud66.com/pricing/) for the most up to date price.

## Managed backup storage locations

We store your managed backups in the closest possible AWS region to your servers. At the moment we store data in the following regions:

* af-south-1 
* ap-east-1
* ap-northeast-1
* ap-northeast-2
* ap-south-1
* ap-southeast-1
* ap-southeast-2
* ca-central-1 
* eu-central-1 
* eu-north-1
* eu-west-1
* eu-west-2
* eu-west-3
* me-south-1
* sa-east-1
* us-east-1 
* us-east-2
* us-west-1
* us-west-2