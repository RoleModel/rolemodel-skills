# Adding & Scaling Elasticsearch


## Overview

[Elasticsearch](https://www.elastic.co/elastic-stack/) is a powerful open source search and analytics engine, and it's easy to add to your application using the Cloud 66 Dashboard.

We do not recommend changing the size of existing Elasticsearch servers as this can create critical issues and bring the server down. Follow our [scaling guide](#scaling-elasticsearch-clusters) instead.

## Add Elasticearch

To add Elasticsearch to your application:

1. Open the **application** from your [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav 
3. Click *Add Source* in the sub-nav
4. Click the green *+ Add Data Source* button and select a Elasticsearch
5. A drawer will open from the left, with configuration options for the server.
6. Give your new server group a name 
7. Click *Add Server* to start the process

This adds three environment variables to your application: `ELASTICSEARCH_ADDRESS_INT`, `ELASTICSEARCH_ADDRESS_EXT` and `ELASTICSEARCH_ADDRESS`, which you can use to connect to your Elasticsearch instance.

For containerized applications Elasticsearch will be added to the host, not as a container.

## Upgrading Elasticsearch

Cloud 66 does not support in-place upgrades for Elasticsearch. Instead you should follow the checklist below to create a new Elasticsearch Cluster, and migrate your data to it.

### Step 1: Create a new Elasticsearch server and group

You need to create a fresh set of servers running the latest version of Elasticsearch. To do this:

1. Open the **application** from your [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav 
3. Click *Add Source* in the sub-nav
4. Click the green *+ Add Data Source* button and select a Elasticsearch
5. A drawer will open from the left, with configuration options for the server.
6. Give your new server group a name 
7. Click *Add Server* to start the process

We will now build a brand new instance of Elasticsearch - you can watch the logs, or come back later (we will email you when the build is done).

 If your instance of Elasticsearch is sharing your application server, you will need to clone your application as we cannot upgrade Elasticsearch in-place. 

### Step 2: Scale up more servers in the group (optional)

If your application requires more than one Elasticsearch server to handle the load, you should add them to your new group now. To do so:

1. From your application, click on the new Elasticsearch cluster you created in Step 1 (under Data Sources)
2. Click the *Add Server* button at the top right of the **ElasticSearch Cluster** page
3. Choose the required server size and click *Add Server*

We'll now build another server for your cluster. You can repeat this step as many times as you require.

 If you are running multiple Elasticsearch servers, for resilience it is recommended to run an ODD number of servers. Running an even number of servers increases the chance of data loss in the event of physical server failure. 

### Step 3: Migrate your Elasticsearch data to your new database group

Next, transfer your data from your existing Elasticsearch instance to your new group. We recommend following the [official documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) to do so - be sure to select the correct version of your (existing) instance. 

You can use [Toolbelt (cx) commands](../toolbelt/using-cloud66-toolbelt.md) like `ssh` , `download` and `upload` to make the process easier, or `scp` directly between your servers if you're more comfortable with that.

### Step 4: Promote your new group to "default"

Once your data is synchronised, you can switch your application to use your new cluster (group). To do so:

1. From your application, click on the new Elasticsearch cluster you created in Step 1 (under  Data Sources)
2. Click on the *Make Default* button at the top right of the main panel. This will make the `ELASTICSEARCH_ADDRESS` environment variable point to your NEW Elasticsearch servers

If your application relies on Elasticsearch to function, **we recommend putting your application into maintenance mode** before promoting your new cluster. 

### Step 5: Redeploy and test

Finally, redeploy your application to apply all the changes. Test your application is functioning as expected and then deactivate maintenance mode if everything is working. (If not, you can promote your old cluster to default and then fix any issues you've found.)

 This guide assumes that you have installed [Elasticsearch](../servers/elasticsearch.md) via Cloud 66's native tools (dashboard or manifest). If you have configured the service manually then this will not apply 

## Scaling Elasticsearch clusters

 This guide assumes that you have installed Elasticsearch via Cloud 66's native tools (dashboard or manifest). If you have configured the service manually then this will not apply. 

You can scale your Elasticsearch cluster through the Cloud 66 dashboard:

1. From your application home, click on the Elasticsearch cluster you'd like to scale up (under Data Sources)
2. Click the *Add Replica* button at the top right of the **ElasticSearch Cluster** page
3. Choose the required server size and click *Add Server*

(You can also scale down by clicking the red *Delete server* icon - but take care when doing so!) 

Elasticsearch scaling works by splitting your **indices** into **shards**, and placing them on an Elasticsearch running instance called a **node** on another server. A collection of nodes is called a **cluster**. 

You specify the number of shards for individual indices when creating them, and can dynamically change the number of replicas with the API. 

By moving primary and replica shards to different nodes, Elasticsearch achieves both data redundancy and improved performance.

## General recommendations

- **It is preferable to scale to three or more servers.** This is because that in order to avoid a [split brain](https://en.wikipedia.org/wiki/Split-brain_(computing)), there must be a majority of the master eligible nodes present for the cluster to be active and elect a master node. For two nodes this number is two, so the loss of connectivity between the nodes for whatever reason will render the cluster inoperable until connectivity is restored.

- **Please make sure that all of your indices have replicas!** Elasticsearch distributes the replica shards such that if any one server goes down, a replica shard on another server will be promoted to a primary shard, so there is no loss of data. However, if the server holds the only primary shard and there are no replicas, you will lose data.

- Elasticsearch and its underlying search engine, Lucene, **are extremely RAM hungry applications**. Running them on low RAM servers is highly unadvisable, as illustrated by the next point. 

- Unlike more traditional database stores that will attempt to perform less strenuous operations if server resources are limited, **Elasticsearch assumes you give it enough resources to work with, and will crash if that is not the case**. As such, please stress test with realistic data sets for your application before using Elasticsearch in production. We cannot advise you how much resources your cluster will require, as it is very much dependent on your application.

- Scaling will produce a node that is both master-eligible, and data storing. Dedicated master or data nodes are currently not supported.