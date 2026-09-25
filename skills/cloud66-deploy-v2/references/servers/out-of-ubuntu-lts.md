# Dealing with servers running out-of-LTS versions of Ubuntu


## Overview

If one or more of the servers in your application are running older versions of Ubuntu that are no longer covered by long term support (LTS) and have thus reached end-of-life (EOL), you will receive periodic warnings from Cloud 66 about this. This guide explains why you’re getting these warnings, and what you can do to remedy the cause.

## Understanding LTS and EOL

Free versions of Ubuntu are supported by Canonical for 5 years after their initial release - hence the label “long term support”. A version released in April 2020 (i.e. 20.04) therefore stopped being eligible for free support in April 2025 and effectively became EOL.

The table below shows when each recent LTS release reaches the end of its free support window:

| Ubuntu LTS release | Released | Free support ends |
| --- | --- | --- |
| 20.04 | April 2020 | April 2025 (EOL) |
| 22.04 | April 2022 | April 2027 |
| 24.04 | April 2024 | April 2029 |
| 26.04 | April 2026 | April 2031 |

At this point [Canonical](https://canonical.com/) stops actively releasing updates and patches to that version of Ubuntu. Some package maintainers will patch older versions of their software, but many will drop support as the respective versions of Ubuntu reach EOL.

This means that your server and its packages are no longer able to be patched with any degree of certainty, including urgent security patches. 

## How Cloud 66 handles EOL versions of Ubuntu

Our first priority is to keep your application running and not to make any changes that might cause downtime. As such we will stop making any passive updates to your version of Ubuntu once it is out of LTS, **including package upgrades** or patches. 

We will begin warning you as soon as one or more of your servers running a version of Ubuntu reaches EOL. We strongly urge you to upgrade to a later LTS release (ideally the latest) at this point, since we can’t guarantee the security of your server if it remains unpatched.

## How to fix this issue

There are two ways to approach upgrading Ubuntu, each with different pros and cons:

1. **Scaling up new servers** in your existing application (running the new versions of Ubuntu and any version-dependent components) and then scaling down old servers.
2. **Cloning your existing application** to a new set of servers and switching your DNS once you have tested this new version thoroughly

| Method | Pros | Cons |
| --- | --- | --- |
| Scaling up new servers in your existing application, and then scaling down outdated ones | - Quicker, with less configuration changes required | - Ideal if only a few components need to be upgraded | - You will need to carefully manage servers running different versions of components  |
| Cloning your entire application and then upgrading all the components | - Lower risk, with all the configuration changes and testing happening in a “sandbox” until you’re ready to cut over | - More time consuming  |

Whenever possible we suggest upgrading your stack one layer at a time - for example focus on upgrading all your databases and then move on to your application servers.

### Before you start the process

- Check the [Manifest](../manifest/what-is-a-manifest-file.md) for your application to ensure you haven’t specified a version of Ubuntu in any of your component configurations. Either remove any mention of operating system version, or update to a version of Ubuntu that is still in LTS.
- Check both your Manifest and your other configuration or package dependency files (e.g. `Gemfile` or `package.json`) and confirm that the package versions are compatible with the latest version of Ubuntu. Where they are not, update the versions to achieve compatibility.
- Replication is generally not possible between different (minor and major) versions of database engines. If your new servers will need to use a significantly different version of the engine, you will need to upgrade manually - [see our section below](#how-to-upgrade-databases-between-versions).
- We strongly advise you to test a version of your application locally on the same version of Ubuntu that will be deployed.

### How to upgrade Ubuntu using the scaling up method

1. Configure a [Web Success Check](../servers/application-health-checks.md#configuring-web-success-checks) in your application’s Manifest file
2. Log into your Dashboard and click through to the application 
3. [Add a load balancer](../load-balancers/load-balancer.md) to your application if you don’t already have one
4. Click on *Web* in the left-hand nav
5. Click *+ Add Web Server* and add a new server - ideally of the same size and type as the existing server (be sure you have updated your manifest to use a newer version of Ubuntu before you do this)
6. Once the new application server has been successfully deployed, remove the older server from the load balancer and test that your application is still working. If not, add back the old server and remove the new one. You can still reach the new server via the [Cloud 66 internal DNS](../networking/configure-dns.md#browsing-your-app-via-cloud-66-dns) and this could be helpful for debugging.
7. Next, set up [managed database backups](../databases/database-backups.md) and back up each of your database types
8. Add [new database groups](../databases/attaching-multiple-databases.md) for each of your database types 
9. If your database versions will remain the same between servers you can [set up replication](../databases/database-replication.md#how-it-works) between your new database groups and the original groups. Otherwise you will need to follow our database upgrade section below.
10. Configure your new application servers to [point at your new database group(s)](../databases/attaching-multiple-databases.md#accessing-database-groups-from-an-app) 
11. Test your live application thoroughly (consider leaving your old servers in place for a few hours to allow for rapid rollback if needed)
12. Once you are comfortable that things are running smoothly, scale down your old servers

### How to upgrade Ubuntu using the scaling up method

1. Log into your Dashboard and click through to the application 
2. Follow our [How to upgrade Kubernetes clusters](../build-and-config/upgrading-cluster.md#upgrading-your-cluster-without-downtime) guide to bring your Kubernetes cluster up to a version that is supported by the newer version of Ubuntu you will be deploying. Depending on how old your versions are, you may have to do this in stages because Kubernetes does not support every version of Ubuntu and vice versa. In this case you will need to upgrade Kubernetes a few steps, then add a new master using a newer version of Ubuntu. 
3. Set up [managed database backups](../databases/database-backups.md) and backup each of your database types
4. Add [new database groups](../databases/attaching-multiple-databases.md) for each of your database types 
5. If your database versions will remain the same between servers you can [set up replication](../databases/database-replication.md#how-it-works) between your new database groups and the original groups. Otherwise you will need to follow our database upgrade section below.
6. Configure your new application servers to [point at your new database group(s)](../databases/attaching-multiple-databases.md#accessing-database-groups-from-an-app) 
7. Test your live application thoroughly (consider leaving your old servers in place for a few hours to allow for rapid rollback if needed)
8. Once you are comfortable that things are running smoothly, scale down your old servers

### How to upgrade Ubuntu using the app cloning method

Once you are ready, you can upgrade your version of Ubuntu as follows:

1. Log into your Dashboard 
2. (Optional but recommended) Set up a [Failover Group](../failover-groups/failover-groups.md) for the application you’re planning to upgrade
3. Click through to the application
4. Click on *Settings* in the left-hand nav
5. Scroll down to **Application Actions** and click the *Clone* button
6. Give the new version of your application a name and click Clone Application
7. Follow the build process to analyze and configure your application for deployment
8. Deploy the clone to the cloud of your choice - the servers will automatically be provisioned with the latest LTS version of Ubuntu (or the version specified in your Manifest)
9. Set up [database replication](../databases/database-replication.md#between-applications) between your existing application and your clone
10. Test your cloned application thoroughly 
11. Once you are satisfied, switch your Failover Group to point at the cloned application 
12. Deactivate database replication and [promote your replica database](../toolbelt/_databases-promote-replica.md) on the clone to master

You now have a fully upgraded version of your application, and you can delete your old version of your application and the servers it relied on.

## How to upgrade databases between versions

Replication is generally not possible between different (minor and major) versions of database engines. In order to upgrade between versions you will need to:

1. Dump or export the data from your existing database 
2. Add a new database group that uses the new version of your database engine
3. Manually import the database dump (or snapshot) to the new database group
4. Examine the database (using command line or a database client) to check the data has been imported successfully
5. Switch your application servers to use the new database group

Depending on the size of your database you may need to import an initial large dump and then import the latest records just before you cut over.