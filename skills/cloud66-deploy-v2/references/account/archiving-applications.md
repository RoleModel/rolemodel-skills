# Archiving apps


## Overview

If you (or one of your clients) needs to temporarily suspend an application, you can archive the application on Cloud 66. This will preserve the structure and configuration of the application, allowing you to reactivate it in future without having to rebuild it from scratch.  Archiving an application will turn off any cloud servers used by that application, but **will not** delete them. We will, however, **delete any backups**.

## Archiving an application

In order to archive an application, you need to have admin rights and access to the Cloud 66 Dashboard. When you're ready to archive an app:

1. Log into your Dashboard and click on the app you wish to archive
2. Click on *Settings* in the left-hand nav
3. Click the *Archive Application* button and confirm the action - this will require you to settle any outstanding charges before the archiving will be completed.

The application is now archived. You will not be able to open or edit it until you restore it. Servers used by this application will be turned off (deactivated) but not deleted. These servers will be effectively inaccessible until the application is restored. **Please do not delete these servers**, or you will not be able to restore your application. 

When we archive your application we will also stop any scheduled backups and **we will delete any existing backups** that we are storing.

Cloud providers handle the deactivation of servers in a variety of ways. In some cases there are significant cost savings for deactivated servers. Please check your cloud providers policies to understand the billing and technical consequences.

## Restoring an application

Archived applications are listed separately from your active apps. You can find them by clicking the *Archived Applications* link in the left-hand nav of the main Dashboard landing page (under *Failover Groups*).

To restore (unarchive) an application:

1. Log into your cloud provider and start or reactivate (unpause) your application servers (we cannot do this remotely)
2. Log into your Cloud 66 Dashboard and open the *Archived Applications* page
3. Click the *Restore* button next to the application you want to restore 
4. We will now reactivate your application (this may take some time)

If we encounter any issues (such as a deleted server) we will halt the restore and alert you about the issue. Once the restore processes is complete you will be able to find the application listed alongside the rest of your active apps. 

## Limits and effects of archiving

This feature is not intended for frequent or repeated use. You can only archive and restore an application twice. 

Archived applications are completely dormant. This means that:

- Application servers will not respond to traffic of any kind on any port
- Any backups will be deleted and any backup processes will be paused
- Webhooks will bounce (respond with errors)
- Any alerts (e.g. security patches) will be suppressed and not acted upon

Although your servers are dormant, **you should not delete them**. If you completely delete your application servers, you will not be able to restore your application. 

You can resize your servers downwards, but you should do so with caution, and resize them upwards again before restoring them. Trying to restore an application on undersized servers will cause issues.

 If we detect heartbeats from an application that is archived we will reach out to you to request that you reactivate the app on Cloud 66. Archiving is only permitted for applications that are dormant.