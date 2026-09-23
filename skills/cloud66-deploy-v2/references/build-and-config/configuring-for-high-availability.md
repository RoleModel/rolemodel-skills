# Configuring container clusters for high availability


## Overview

In order to achieve high availability for your application, you need multiple redundancy for both master and worker nodes. This means at least **three master nodes** and enough worker nodes to comfortably run your entire application at no more than 75% utilisation. If you’re not sure of how Kubernetes defines nodes, please [read our guide](../cloud-66-101/concepts-and-terminology.md#nodes-masters--workers) on the subject before getting started.

Applications running Kubernetes v1.12 or lower do not support the multi-master feature on Cloud 66. If you have deployed an application via Cloud 66 before March 2019, you will need to **redeploy your application "with upgrades" and choose to perform a Kubernetes upgrade** (note that this will incur significant downtime as your cluster will be recreated). All applications deployed after **March 2019** on version v1.13 and above automatically support multi-master clusters.

## Choosing between a shared master and dedicated workers

By default, a new Maestro Kubernetes cluster starts with a single **shared master** — one master node that also runs your application workloads. This is fine for development and small production loads, but it has a hard ceiling: the same node is responsible for both Kubernetes control-plane traffic (the API server, scheduler, controller manager, etcd) and your app's containers, and those two responsibilities compete for the same CPU, memory, and disk I/O (the last mostly mattering to etcd).

The right time to add a **dedicated worker** — a node that runs *only* application pods, giving your app's containers a home away from the master — is when you start seeing any of:

- **Slow `kubectl` responses or Dashboard timeline lag** when nothing else is changing. The API server may be starved by application containers competing for the node's resources.
- **Scheduling decisions that take noticeably longer than they used to** (new pods sitting in `Pending` for tens of seconds before being placed).
- **Pod evictions on the master node** — the kubelet evicting application pods because the node itself is under memory or disk pressure. These show up on the cluster's events feed and in the timeline.
- **etcd warnings in the master's logs** about slow writes (`took too long`, `apply request took too long`). etcd is the most latency-sensitive part of the control plane.

If you're hitting any of those on a single-master cluster, adding one dedicated worker is usually the fastest fix — it gives your application pods a node of their own. The exception is etcd slow-write warnings: if those persist after adding a worker, the master node itself may be undersized (CPU or disk), which a worker won't address. The procedure is the same as [adding any node](#adding-nodes-to-an-application); pick *Worker* when prompted to choose the node role.

Adding the first dedicated worker is a different decision from going to a full HA topology (three masters + workers). A single-master + single-worker cluster is not HA — losing the master still takes the cluster down — but it does take the workload pressure off the master and is often enough for small production apps. Move to three masters when you also need the cluster to survive a master node failure.

## Adding nodes to an application

To add nodes to an existing application:

1. Open the application page from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click *Application* in the left-hand nav
3. Click *Servers* in the sub nav
4. Click *+ Scale up* (top right of the main panel)
5. Choose whether the new node(s) will be Master(s) or a Worker(s)
6. Choose the server size for the new node(s)
7. Choose how many new nodes to add
8. Click *Add Server* to provision your new node(s)

You can simultaneously add multiple nodes to a cluster this way, and that each of these will provision a new server with your cloud provider.