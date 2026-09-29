# Troubleshooting server issues


## Overview

If you're having trouble connecting to one of your servers, or your servers can't reach one another or are unresponsive, it's often the result of a common issue that is easily resolved once you know what to look for. We've listed the most common issues and their resolutions below.

## Temporary network interruptions

The most common cause of errors connecting to servers is some kind of temporary interruption in network connectivity. Such interruptions are not uncommon, and typically resolve themselves quickly. Wait a few minutes and try again. If the problem persists, work through the rest of this guide.

## Recent server restart(s)

Cloud providers sometimes change the public IP addresses of servers when they are restarted. This includes all events that require the server to be shut down - including things like adding more capacity, or upgrading some components. This can (temporarily) cause our firewall to block connections to or from that server until our system detects the IP change and updates the firewall rules. 

This problem should resolve itself within a few minutes (when Cloud 66 Agent updates the stack with the server's new IP address). If you'd like to avoid this issue completely, we recommend setting static IP addresses from your cloud provider for use with mission critical servers. Please reach out to your cloud provider to find out more about how to assign fixed IPs to your servers.

## Heavy load on the servers

If your servers are under heavy load - such as high CPU usage or high network traffic - they will be slow to respond to new connection requests and this may result in timeouts. You should check the load on your servers by logging in to your cloud provider's dashboard and checking the usage statistics. Your next step depends on what you find:

1. If the stats show that your servers are experiencing a temporary usage spike, you should wait a few minutes until the load comes back down to normal levels.
2. If your servers are regularly (or continuously) maxing out their allocation of any resource (CPU, RAM, network or disk) then it is highly likely that they are not powerful enough to handle the needs of your application. In this case you should strongly consider deploying your app to new (larger) servers, switching over to them once they are up and running and then dropping the original server(s).

## Memory leaks

This is a notable variation on the issue described above. An error in your application code may be gradually reserving RAM without ever releasing it. The typical symptoms are that the average usage of RAM climbs consistently over time, as does the swap usage of the disk (as the server tries to compensate by using "virtual memory"), eventually maxing out. 

Note that simply increasing the capacity of your servers will not fix this issue - it will simply prolong the period before RAM is exhausted. The best solution to this issue is to find and fix the leak. A temporary fix is to regularly restart your servers to flush the RAM usage, but we don't recommend this approach for critical and/or production servers.

## "Noisy Neighbours" on shared hosting

Any kind of shared hosting - including most cloud VMs - can be disrupted by a particularly resource-hungry tenant. If your virtual server happens to be allocated to the the same physical host as a particularly "noisy" neighbour (i.e. one that consumes disproportionate CPU, network or disk resources), it can disrupt the operation of your own server. This includes making it impossible to reach the server via SSH.

While this is not particularly common, we have seen several cases over the past few years. If you are experiencing an unexplained and/or intermittent inability to connect to one of your servers, consider asking your hosting provider to confirm that the physical host is not experiencing this kind of disruption.

## Issues with your Kubernetes cluster

Cloud 66 uses Kubernetes to host containers on your cluster. If you are unable to connect to your cluster you should step through this checklist:

1. Are your Master server(s) up? You will be able to see this in your [Cloud 66 dashboard](https://app.cloud66.com/dashboard). If your servers are having issues, please check through the troubleshooting advice above. 
2. If you servers are up, can you connect to your Master(s) via SSH? If not, do you have any custom firewall rules on your Master(s)?
3. If you can connect to your Master(s) via SSH, can you query Kubernetes? Use `sudo kubectl --kubeconfig=/etc/kubernetes/admin.conf get nodes` to check if the cluster is responsive. 
4. If your cluster is unresponsive, it may be over-utilized. In this case it can be difficult to scale the cluster because it may be too busy to even accept your commands. In this case we recommend you repair/rebuild you cluster. (see below)

### Rebuilding your cluster

If your cluster has become completely unresponsive and remaining that way for any significant length of time, your best option may be to rebuild it. To do this:

1. Log into your [dashboard](https://app.cloud66.com/dashboard) and click on your Cloud 66 app
2. Click the *Deploy* button and then the *Options* tab
3. Check the *Apply Docker/Kubernetes* Upgrades box and then check *Clean Installation - Repair/Rebuild this Cluster* box.
4. Click the *Run Now* button to start the process

As you have no doubt assumed, this will result in downtime for the cluster while it is being rebuilt. To avoid this in future, consider running multiple masters as this makes the failure of a single Master recoverable.