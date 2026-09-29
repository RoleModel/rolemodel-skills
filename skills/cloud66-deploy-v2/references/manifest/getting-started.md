# Getting Started with Manifest


## Manifest Tutorial

In this example we are going to modify the configuration of the simple application we used in our [Getting started](../getting-started/deploy-your-first-app.md) guide.

### Updating the Manifest file

First add a Manifest file to the following location in your repo:

```shell
<application-root>/.cloud66/manifest.yml
```

Next add following to your `manifest.yml`:

```yaml
rails:
  configuration:
    ruby_version: 3.0
```

You'll see that we're defining several things in this YAML:

- The component type we are configuring (`rails`)
- The version of Ruby that will be installed as part of this component ( `ruby_version`)

```yaml
node:
  configuration:
    custom_log_files: ["/tmp/mylog/*/*.log"]
```

You'll see that we're defining several things in this YAML:

- The framework we are configuring (`node`)
- The location of our custom log files ( `["/tmp/mylog/*/*.log"]`)

Next, deploy your application and the new setting will take effect!

### Defining a server for your component

The Manifest file gives you a lot of control over your components. For example, you can use the `server` settings to specify the exact size and region for your application server. The YAML below is an example of this in action:

```yaml
rails:
  configuration:
    ruby_version: 3.0
  servers:
  - server:
      unique_name: master
      size: s-2vcpu-2gb
      region: lon1
      vendor: digitalocean
      key_name: My_DO_Account # the name of your cloud provider in your Cloud 66 account

```

This would install a Rails server on DigitalOcean, at their London data centre and on a 2CPU and 2GB cloud server. 

```yaml
node:
  configuration:
    custom_log_files: ["/tmp/mylog/*/*.log"]
  servers:
  - server:
      unique_name: master
      size: s-2vcpu-2gb
      region: lon1
      vendor: digitalocean
      key_name: My_DO_Account # the name of your cloud provider in your Cloud 66 account

```

This would install your Node application on DigitalOcean, at their London data centre and on a 2CPU and 2GB cloud server. 

- You can find the available values for `size` and `region` in our [API documentation](https://developers.cloud66.com#cloud-vendor-instance-names).
- You can find the `key_name` for your cloud provider(s) listed [on your Dashboard](https://app.cloud66.com/clouds).

Editing the manifest file of an **existing application** may not necessarily result in changes to the deployed instance(s) of that application, even if the application is subsequently redeployed. See the [Understanding Manifest Files](../manifest/understanding-manifest-files.md) section.

If you explicitly set the version of any component in your manifest file, we will respect that setting even if it conflicts with other system changes or upgrades (for example upgrading Ubuntu). If you are having trouble upgrading any component of your application, remember to check your manifest file to ensure you have not previously locked the version of that component or one of its dependents.