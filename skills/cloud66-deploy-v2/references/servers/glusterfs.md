# Adding GlusterFS


[GlusterFS](https://www.gluster.org/) is a scalable network file-system (NAS), and it's easy to add to your application via the Cloud 66 Dashboard.

If your Rails application runs on a single web server then you do not need GlusterFS to persist file storage or to share files between front and backend. Read our guide to [persistent and shared directories for Rails apps](https://help.cloud66.com/deploy/2/build-and-config/rails-shared-directories) for more info.

## Adding GlusterFS

To add GlusterFS to your application:

1. Open your **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav and then *Add Source* in the sub-nav
3. Click the green *+ Add Data Source* button and select *GlusterFS*
4. A drawer will open from the left, with configuration options for the server.
5. Choose a Replication Factor - this is how many servers will run the Gluster cluster. If you require additional redundancy (and to avoid [split-brain](https://docs.gluster.org/en/main/Administrator-Guide/Split-brain-and-ways-to-deal-with-it/)) you should choose "3" here.
6. Click *Add Server* to start the process

You can now watch the logs, as usual to see the progress of the process.

## Configuring GlusterFS replica count

Replicas are exactly what they sound like - parallel copies of the filesystem kept in sync. They are useful for fault tolerance and load balancing. You can specify `replica_count` when you configure GlusterFS. If you are using a manifest to add GlusterFS, you can add replica_count to your `manifest.yml`.

You cannot change `replica_count` after GlusterFS has been added to your application.

## Why would I need GlusterFS?

Almost all applications have some sort of data storage needs. As your application grows and runs on multiple servers, you will need to be able to share this data storage between your servers. For example, a web application that allows its users to upload images, will need to store those images on a share storage accessible by all servers. 

This need is more important when using containers like Docker. This is because even for smaller applications that are powered by a single server, you might have multiple containers. Each one of those containers will require access to a shared storage space.

GlusterFS is one of the options you have to for a Network Attached Storage (NAS) or shared file-system. Other options include NFS (Linux Network File System) and Ceph as well as many other tools and open source projects.

GlusterFS gives you a shared storage space that is accessible from each server or container on your application and is resilient to faults with powerful access control features.

## How can I use GlusterFS in my application?

Now that you have a share storage service provided by GlusterFS in your application, you can use it in your application like a normal disk volume. By default, Cloud 66 will create and mount a shared volume on `/mnt/gfs/<volume-name>` on every application server of your application. 

To see how your shared file system works, you can SSH to one of you web servers and run the following commands:

```shell
$ cd /mnt/gfs/<volume-name>
$ touch hello.txt
```

Now SSH to another web server on your application and you should be able to see `hello.txt` under `/mnt/gfs/<volume-name>`.

## What about my containers?
So far we saw how you can create a share disk volume on every server. But what about accessing this share storage from each container? You can [mount](../build-and-config/service-storage.md) the `/mnt/gfs/<volume-name>` directory into any directory inside your container. This means your code can read and write to `/mnt/gfs/<volume-name>` from inside a container without any further changes.

## Fine grained access control for your data
By default Cloud 66 builds a GlusterFS cluster for your application, creates a default mount point on it and mounts that onto every application server. This is great to start with and for many workloads.

But what if you need to make sure some services have read/write access to your data and some only readonly access?

This is achieved using the [manifest](../manifest/what-is-a-manifest-file.md file). Using manifest file, you can control the GlusterFS volumes you have as well as grant read/write or readonly access to containers of a specific service.

Using the [manifest](../manifest/what-is-a-manifest-file.md) file allows you to choose the servers on which you would like to have the volumes mounted.
 
## Accessing your GlusterFS servers
GlusterFS servers are added to a new group called _GlusterFS Cluster_ under your application. These servers are accessible via the usual GlusterFS tooling (available from [GlusterFS website](https://www.gluster.org/)).

Every server in your application will have the following 3 environment variables available by default:

- `GLUSTERFS_<GROUP_NAME>_ADDRESS_INT` The internal IP address of the master volume server in your GlusterFS cluster.
- `GLUSTERFS_<GROUP_NAME>_ADDRESS_EXT` The external IP address of the master volume server in your GlusterFS cluster.
- `GLUSTERFS_<GROUP_NAME>_HOSTS` The internal hostnames of all server in this GlusterFS cluster.