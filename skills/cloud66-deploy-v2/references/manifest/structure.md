# Manifest Structure


## The structure of a Manifest file

Manifest files are made up of blocks of settings that define the infrastructural elements of your application. This includes both the "hardware" (virtual or real servers) and the "software" (such as the version of Docker your application uses). 

A typical block of settings will contain some combination the following:

- **Environment** (optional) - the environment to which the settings apply
- **Component settings** (required) - the settings for the component being configured (e.g. MySQL or an AWS Load Balancer)
- **Server definition** (optional) - the specifications for the server used by the component defined in the settings above
- **Custom log files** (optional) - each component can be configured to use custom LiveLog files

You can also control and customize some other elements in your Manifest including:

- **Environment variables** - you can set environment variables for your app
- **Background processes** - you can customize the Linux signals used to control your background processes

### Environment settings

The (optional) **environment** setting allows you to use the same `manifest.yml` for multiple applications with different environments. Some examples are:

- production
- staging
- development

You can also use your own custom environment names in your Manifest file.

#### Applying settings across all environments

If you would like your manifest setting to apply to **all environments**, you can simple drop the root level environment node from your YAML. This will ensure a component is always provisioned, regardless of environment.

### Component settings

The (mandatory) component settings define how a component is configured. The Manifest file currently supports the following components (click on any component name for details):

*   [Docker](../manifest/_docker.md)
*   [ElasticSearch](../manifest/_elasticsearch.md)
*   [GlusterFS](../manifest/_glusterfs.md)
*   [Load balancers](../manifest/_load-balancer-aws.md)
*   [Memcached](../manifest/_memcached.md)
*   [MongoDB](../manifest/_mongodb.md)
*   [MySQL](../manifest/_mysql.md)
*   [Nginx](../manifest/_nginx.md)
*   [PostGIS](../manifest/_postgresql.md)
*   [Postgres](../manifest/_postgresql.md)
*   [Redis](../manifest/_redis.md)
*   [Post-deployment global availability checks](../manifest/_health-checks.md)

*   [ElasticSearch](../manifest/_elasticsearch.md)
*   [Gateway](../manifest/_gateway.md)
*   [GlusterFS](../manifest/_glusterfs.md)
*   [Load balancers](../manifest/_load-balancer-aws.md)
*   [Memcached](../manifest/_memcached.md)
*   [MongoDB](../manifest/_mongodb.md)
*   [MySQL](../manifest/_mysql.md)
*   [Nginx](../manifest/_nginx.md)
*   [Node version](https://help.cloud66.com/deploy/2/manifest/_rails-rack)
*   [PostGIS](../manifest/_postgresql.md)
*   [Postgres](../manifest/_postgresql.md)
*   [Redis](../manifest/_redis.md)
*   [Sinatra](https://help.cloud66.com/deploy/2/manifest/_rails-rack)
*   [Rails](https://help.cloud66.com/deploy/2/manifest/_rails-rack)
*   [Post-deployment global availability checks](../manifest/_health-checks.md)

If you explicitly set the version of any component in your manifest file, we will respect that setting even if it conflicts with other system changes or upgrades (for example upgrading Ubuntu). If you are having trouble upgrading any component of your application, remember to check your manifest file to ensure you have not previously locked the version of that component or one of its dependents.

## Manifest file structure

Manifest files have a strict hierarchical structure that determines which part of an application is being addressed by the configuration variables. It's vital to ensure that each line of your configuration falls into the correct place in this hierarchy.

### First level: Environment

The **optional** first level of `manifest.yml` is the application environment. This allows you to use the same `manifest.yml` for multiple applications with different environments. Some examples are:

- production
- staging
- development

You can also use custom environment names in your manifest file.

### Second level: Component type

*Component type* defines which component of the application is being configured by that section of `manifest.yml`. 

Available options are:

- rails
- docker
- elasticsearch
- gateway
- glusterfs
- load_balancer
- memcached
- mongodb
- mysql
- nginx
- postgis
- postgresql
- redis
- sinatra

### Third Level (1): Configurations

The third level of the manifest file determines the specific settings for the component specified in level 2.

For example, this is how to set the version of Ruby used in a Rails application:

```yaml
production:
  rails:
    configuration:
      ruby_version: 2.5.1
```

### Third Level (2): Servers

You can also specify settings for your servers in your `manifest.yml` by using the **servers** section.

In our example below you can see that we're using DigitalOcean as our `vendor` and that we've opted for a 2GB instance in the London region. 

`key_name` is optional and is used to select the named vendor cloud key in the case where there are multiple accounts available for the same cloud provider.

### Example of complex manifest file

```yaml
rails:
  configuration:
    ruby_version: 2.5.1
    nameservers: ['8.8.8.8', '8.8.4.4']
  servers:
  - server:
      same_as: master
redis:
  configuration:
    version: 4.0.9
  servers:
  - server:
      unique_name: master
      size: s-2vcpu-2gb
      region: lon1
      vendor: digitalocean
      key_name: My_Key
```