# Using Server Snapshots


## Overview 

Server Snapshots can make scaling your application (i.e. adding servers) significantly quicker. Instead of provisioning servers from scratch we save a “snapshot” of the server disk and use that as a base for your additional servers. 

Server Snapshots are only available for supported cloud providers - at the moment this includes **AWS**, **Microsoft Azure**, **DigitalOcean**, **Google Cloud**, and **Hetzner Cloud**.

## How to enable Server Snapshots

You can enable Server Snapshots at two levels:

1. At application level - for any new server added to your application
2. At account level - for any new application created on your account

For some cloud providers (AWS & Google) you will need to give Cloud 66 additional permissions to your cloud account in order for us to store and fetch the Snapshots. [See below](#permissions-required) for details. 

### Enabling Server Snapshots per application

To set your application to use Server Snapshots:

1. Log into your Cloud 66 Dashboard
2. Click on your application 
3. Click on ⚙️ *Settings* in the left-hand nav
4. Check the box next to Server Snapshots

The next time you deploy, we will save snapshots of your servers and whenever you add a server in the future we will use the associated snapshot.

### Enabling Server Snapshots at account level

This setting will default any new applications created under your account to use Server Snapshots (on supported clouds). To enable this settings:

1. Log into your Cloud 66 account
2. Click on your avatar (top-right) and then click *Account Settings*
3. Scroll down to **Global Stack Settings** and check the box next to *Default Server Snapshot Behaviour*

This will turn on Server Snapshots for any **new** applications created under your account. It **will not** apply any changes to existing applications. 

## Permissions required

In order for Cloud 66 to be able to store and fetch Snapshots, we will need additional access to some cloud accounts. Permissions per cloud provider are outlined below.

### AWS EC2

```yaml
ec2:CreateImage
ec2:DeleteSnapshot
ec2:DeregisterImage
ec2:DescribeImages
ec2:DescribeSnapshots
```

### Azure 

Azure does not require additional permissions.

### DigitalOcean

DigitalOcean does not require additional permissions.

### Google Cloud

```yaml
compute.images.list
compute.images.delete
compute.images.create
```

### Hetzner Cloud

Hetzner Cloud does not require additional permissions.

## How Server Snapshots work

Each time you deploy your application, we select one server from each of your groups (web, databases etc) and save a Snapshot (image) of its hard drive. We store these Snapshots in the same cloud account as the servers. 

Then, whenever we provision a new server, we will use the Snapshot as a base rather than provisioning from scratch. This dramatically reduces the time to provision a new server. 

We store two snapshots per server, to ensure data fidelity and avoid collisions.

## Cost implications

Your cloud provider will charge you a small storage fee per Snapshot. This is typically charged per GB stored, depending on how long it is stored (much like cloud servers).