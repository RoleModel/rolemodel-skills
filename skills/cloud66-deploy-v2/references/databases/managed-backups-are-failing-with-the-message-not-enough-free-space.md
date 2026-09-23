# Managed Backups failing - not enough free space


If your managed backups are failing with a message that looks something like:

`Not enough free space. You need at least xxx MB free space for this backup`

...this guide will help you resolve this issue.

## Why this happens

Backups are initially created on your servers, after which they are uploaded to Cloud 66 managed backup servers.

Since the initial backups are created on your servers (and temporarily stored there until the upload happens), you may see this error if your server is running low on disk space.

Before taking backups we calculate your data directory size and make sure that the empty space on your hard drive is at least twice that. This is to ensure that taking backups doesn’t fill up the hard drive entirely.

## How should I resolve this Issue?

There are two potential ways to solve this:

### 1) Add Additional Disk Space to your Cloud Server

Attach a new disk to your server and mount `"/var/cloud66/backups"` on to it. Please remove `/var/cloud66/backups` by running `"sudo rm -rf /var/cloud66/backups"` before mounting `"/var/cloud66/backups"`.

### 2) Disable Backup Size Checks

If you are confident that you have enough space and the first option is not possible to perform, you can use the [Cloud 66 toolbelt application](../toolbelt/using-cloud66-toolbelt.md) to run the following command:

```shell 
$ cx settings set -s STACK_NAME db.check.backup.size false
```

This will disable backup size checks.