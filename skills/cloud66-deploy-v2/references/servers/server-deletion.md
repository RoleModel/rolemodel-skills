# Server deletion settings


By default, Cloud 66 will not delete servers and other objects created in your cloud after you delete the application. However, you can change this setting.

If you go to an application's ⚙️ *Settings* page and select `Delete physical servers when I remove a server from Cloud 66.`, then when you delete a server, load balancer, or even a whole application, related objects in the cloud will be deleted as well.

Physical server deletion is not instant; it can take up to 24 hours for the removal to occur (depending on your cloud provider).

Cloud 66 creates different objects depending on which cloud provider you use. For some clouds, Cloud 66 creates items at the account level, which will not be deleted after application deletion. You should clear them manually if you don't need them for other applications anymore.

## Components deleted per cloud provider

Here is the list of components that are deleted (or not deleted) depending on the cloud provider:

### AWS
`Deleted:` Instances, Load Balancers, Security Groups, Key Pairs

### Digitalocean
`Deleted:` Servers, SSH Keys

### GCE
`Deleted:` VM Instances, Disks, Forwarding Rules, Target Pools

`Not Deleted:` Firewall Rules

### Linode
`Deleted:` Servers, NodeBalancers

### Azure
`Deleted:` Virtual Machines, Cloud Services, Storage, Traffic Manager

`Not Deleted:` Networks

### Packet
`Deleted:` Devices, Projects

`Not Deleted:` SSH Keys