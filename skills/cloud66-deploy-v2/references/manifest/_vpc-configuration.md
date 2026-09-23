# VPC Configuration


## Specifying a VPC for your application

You can configure a "virtual private cloud" (VPC) for your application if your cloud provider supports it. This is essentially a private network that your instances are able to communicate over. Depending on your cloud provider, adding a VPC requires different steps (see below). 

These settings are only applied when an application is first built. To change them, you will need to update the manifest and then clone (rebuild) the application

### VPC on AWS

1. [Set up a VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-getting-started.html) on your AWS account and take note of the VPC and subnet IDs
2. Add these values to the manifest entry for your application settings. For example the settings for a Rails app might be:

```yaml
rails:
  configuration:
    vpc_id: my-private-vpc
    subnet_id: my-subnet-id
```

### VPC on Microsoft Azure

To set up a VPC on Azure, you can either  

* [Add a Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/) via your Azure dashboard and then add the name to your manifest file
- Specify a VPC name in the application section of your manifest file and we will create one on your behalf using that name

For example:

```yaml
docker:
  configuration:
    vpc_id: my-private-azure-network
```

### VPC on DigitalOcean

You can either: 

- [Add a VPC](https://docs.digitalocean.com/products/networking/vpc/) to your DigitalOcean account and then add the name to your manifest file
- Specify a VPC name in the application section of your manifest file and we will create one on your behalf using that name

For example:

```yaml
docker:
  configuration:
    vpc_id: my-private-do-vpc
```

### VPC on Hetzner Cloud

You can either: 

- [Add a VPC](https://docs.hetzner.com/cloud/networks/getting-started/creating-a-network) in your Hetzner account and then add the name to your manifest file
- Specify a VPC name in the application section of your manifest file and we will create one on your behalf using that name

For example:

```yaml
docker:
  configuration:
    vpc_id: my-private-hetzner-vpc
```

In order to use an AWS *vpc_id*, you must provide *subnet_id* for all servers used by your application.