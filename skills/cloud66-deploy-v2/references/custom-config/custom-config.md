# Using CustomConfig


CustomConfig allows you to edit and modify component configuration templates used by Cloud 66 to configure your servers. This is currently available for Nginx, HAProxy and database configurations, and more configuration templates are forthcoming.

CustomConfig uses the [Liquid templating language](https://shopify.github.io/liquid/) developed by [Shopify](https://www.shopify.com/) and used by many websites. There are many good resources on the web on how to use the Liquid syntax.

## Components supported by CustomConfig

CustomConfig templates are available for the following components:

* HAproxy
* Nginx
* MongoDB    
* MySQL
* Postgres
* Redis

## Accessing CustomConfig

You can access and modify CustomConfig files in two different ways:

1. Using the Cloud 66 Dashboard
2. Using CustomConfig git repository

### Using the Dashboard

You can find the CustomConfig settings for any server component by:

1. Logging into your Cloud 66 Dashboard
2. Clicking through to the server in question using the left-hand nav (*Web*, *Application* or *Data Sources*)
3. Clicking the *&#8615; More* button at the top right of the server panel and selecting the available option.

You can now edit the configuration and preview any changes before deploying them.

See our documentation for more details about CustomConfig for [Nginx](../servers/nginx.md), HAProxy and [databases](../databases/database-management.md#customize-your-database-configuration).

Preview is generated with dummy data about your server (like the number of cores or the path for different binaries). Refer to our documentation to learn about how the size of your instance affects the number of [Nginx workers on your server](../servers/nginx.md)

## Submit template changes

When you are happy with the results, enter a commit message and press the Commit to Server button. This will compile the configuration with real data and push it to all applicable servers in your application. It also performs any post commit steps necessary like reloading Nginx with the new configuration file, putting your changes into effect.

This process takes place in the background and might take some time to complete depending on the number of servers in an application and the nature of the configuration. Also, during the process Cloud 66 will update contents of Custom git repository so after fetching the latest version you can see the history of configuration changes in your own git client tool

You can subsequently see the history of your configuration changes with simple colored diff views alongside dates and comments.

### Updates to configuration files and patches

Every so often, Cloud 66 needs to update the base configuration files used for your application to run. When a patch is released, having customized configurations introduces complexities due to the differences in settings. Some of these files are part of CustomConfig, which allows users to customize their configuration files.

When a patch is released, having customized configurations introduces complexities due to the differences in settings. If you don’t have customized content, the patch will be automatically applied.

Failure to apply configuration updates may lead to unexpected behaviour by your server(s) and application(s). 

If we cannot automatically apply the patch, you will be notified and provided with a patch archive. It contains two files - the updated configuration and a patch file. Extract the contents of the archive and download your current configuration from the Cloud 66 UI. With these files ready, run the following command:

`patch <current_configuration> -i <patch_file> -o merged_configuration`

This will result in a merged_configuration file being created - please ensure that there are no merge errors at this point. Unfortunately we cannot deal with every single use case generically, so it is your responsibility to ensure that the new file conforms with your requirements.

In the absence of merge errors, copy and paste the contents of the merged_template into your CustomConfig form and commit it.

## Using CustomConfig git

CustomConfig git is a private git repository available on every application in your Cloud 66 account. This git repository is hosted by Cloud 66 and allows you to modify [CustomConfig](../custom-config/custom-config.md) files for your application using familiar git commands.

Each application on Cloud 66 has its own private CustomConfig git repository. You can find the URL of this repository at the bottom of any supported component. For example, if you have a MySQL database you would:

 * Click on *Data Sources* in the left-hand navigation
 * Click on a MySQL database group 
 * Click the **&#709; More** button at the top-right corner of the Servers panel
 * Scroll down below the editing panel

There you will find a URL like this for CustomConfig git:

```shell
https://your-user:secret-password@git.cloud66.com/warmhearted-wondrous-tiger-9262
```

### Making changes to CustomConfig files via git

To make a change to a CustomConfig file you need to first clone the application’s CustomConfig git repository locally. Using git commandline this is possible with something like this:

```shell
$ git clone https://your-user:secret-password@git.cloud66.com/warmhearted-wondrous-tiger-9262
```

This will clone the CustomConfig git repository for the first time to your disk under a folder called `warmhearted-wondrous-tiger-9262`.

Now you can `cd` to this folder and see the list of files available to edit. By default, CustomConfig git repository contains all the CustomConfig files that are relevant to your application. For example, if you are using HAProxy as load balancer, you will see `haproxy.conf` as one of the files there. You might also see `nginx.conf` since you will always have web servers on your application.

Now open the file you want to change in your favorite text editor. Once done, save the file and commit your changes like any normal git workflow:

```shell
$ git commit -m "increate nginx pool size"
$ git push origin master
```

Done!

### CustomConfig git workflow

It’s important to know when your changes are going to be pushed to your servers.

#### Changes made in CustomConfig UI

Any changes made to CustomConfig files in the UI will be applied to CustomConfig git repository as well.

Changing a CustomConfig file in the UI will be pushed to your servers immediately unless there is a merge conflict with what’s in the repository.

#### Changes made through CustomConfig git

Changes made to CustomConfig git files will NOT be pushed to your servers until the next application deployment. This is prevent unwanted changes go live during a normal git workflow.

## What's next?

* Learn how to customize your deployment workflow with [deploy hooks](../deploy-hooks/deploy-hooks.md).
* Learn how to add custom [environment variables](../build-and-config/env-vars.md) to your application
* Learn how to add a [load balancer](../load-balancers/load-balancer.md) to your application