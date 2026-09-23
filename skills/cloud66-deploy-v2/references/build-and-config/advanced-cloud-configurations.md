# Advanced cloud provider configurations


## Adding a new cloud provider via Settings

1. Log into your Cloud 66 dashboard and go to *Account Settings* → *Cloud Keys*.
2. Click the green + and then select your cloud provider 
3. Follow the instructions to connect your accounts

### Update an existing cloud provider

1. Log into Cloud 66 as account owner
2. Open the **[Cloud Keys](https://app.cloud66.com/clouds)** page under *Settings*.
3. Click on the “edit cloud” button next to your Linode cloud key
4. Enter the new personal access token and click *Save*

## Using IAM instance profiles with your servers

Instance profiles are a way to set specific roles on new servers that you spin up with AWS. You can read more about [creating your own instance profiles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) in the AWS docs.

You can use your instance profiles via Cloud 66 by calling them in the [manifest file](../manifest/what-is-a-manifest-file.md) of your application. You can set a different profile for each component of an application (e.g. MySQL or Redis). We will then use that profile whenever we provision a server for that component.

## Cloud 66 Security Groups on AWS

Whenever we provision servers for a new application on AWS, we configure separate AWS Security Groups for each type of server (e.g. application servers or database servers).

This requires Cloud 66 to have IAM permissions on your AWS account, so please be sure to set them up as explained in our [Deploying Your First App](../getting-started/deploy-your-first-app.md) guide.

If new servers are added to a group on Cloud 66 (e.g. scaling up your web servers), then they are added to the corresponding Security Group on AWS. If servers are removed from Cloud 66, they are also removed from their Security Group on AWS.

## AWS Reserved instances

[AWS reserved instances](https://aws.amazon.com/ec2/pricing/reserved-instances/) enable users to reserve instances for one to three years, which has pricing benefits when compared to on-demand instances. To use Cloud 66 with AWS reserved instances:

1. Reserve an instance with your size/region requirements.
2. Use Cloud 66 to deploy to a server of that size in the same region, and we’ll use your reserved instance.

## AWS EC2-Classic

EC2 Classic is now [completely deprecated](https://aws.amazon.com/blogs/aws/ec2-classic-is-retiring-heres-how-to-prepare/). 

## Using GCE service accounts with Cloud 66

A [service account](https://cloud.google.com/iam/docs/service-accounts#types) is a GCE identity that Google Cloud can use to run API requests on your behalf. If you’ve never used a GCE service account before, please read [Google’s documentation](https://cloud.google.com/iam/docs/service-accounts#types) before starting.

To use a GCE service account with a Cloud 66 application, you must add the name of the account to your [manifest](../manifest/what-is-a-manifest-file.md)  using the format `configuration/instance_service_account_name`. For example, this would configure MySQL to use the GCE service account named `mysql-user@my-project-name.iam.gserviceaccount.com`:

```yaml
mysql:
  configuration:
    version: 5.7
    root_disk_size: 100
    root_disk_type: ssd
    instance_service_account_name: mysql-user@my-project-name.iam.gserviceaccount.com

```
Cloud 66 will now associate any MySQL instances created with the GCE service account you specified.

## Using multiple keys with OVH

If you need your servers to be separated for different applications, you should create a separate Project in your OVHcloud account, and then add it to Cloud 66 as a separate cloud key. Be sure to name your keys to make them easy to recognise and differentiate (use the Project name, for example).

You will be able to choose between cloud keys (and therefore between your OVH Projects) whenever you create a new application. However you cannot use a cloud key from a different Project once an application has been created. It will always use the Project that it was assigned to during initial setup.