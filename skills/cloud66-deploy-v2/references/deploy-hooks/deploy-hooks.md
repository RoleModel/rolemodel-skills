# Using deploy hooks


## Overview

Deploy hooks are scripts that allow you to automate actions at various points during the deployment process for your applications. This allows you to customise your deployments  by, for example, installing software packages or upgrading components. 

## Tutorial 

### What you'll need

Before you start, please check you have the following:

* **A Cloud 66 Account** &mdash; If you don't already have one, [sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up). Your first server is free, no credit card required.
* **An existing application set up in Cloud 66** &mdash; To make the most of this tutorial you need to have an app already set up in Cloud 66. Follow our [Getting Started guide](../getting-started/deploy-your-first-app.md) if you're not sure how to do this.

### Creating a deploy hook

To make use of deploy hooks, your application should have a file called *deploy_hooks.yml*.

For **Rails/Rack** applications this file should be present within a folder named _.cloud66_, which is in turn located in the root of your source code.

```bash
/.cloud66/deploy_hooks.yml
```

This file should be YAML formatted, and you can use a service like [YAML Validator](https://codebeautify.org/yaml-validator) to validate it.

Deploy hooks can be added to an application via the Dashboard. Like most other configuration templates in Cloud 66, Deploy hooks are YAML-formatted.

A deploy hook needs, at a minimum:

- a [**hook point**](#hook-points) - where in the deployment process the hook must be invoked
- a [**hook type**](#hook-types) - either a `command` or one of the two `script` types
- a [**target**](#targets) - which type(s) of servers will use this hook
- a [**hook field**](#hook-fields) - the command or script being run (or invoked)

If you choose a specific server type as your target (i.e. anything other than `any`) then your `run_on` field will default to `single_server` unless you explicitly set it to `all_servers`. If you set your `server_type` to `any`, then this field is ignored. 

So, to write a deploy hook you must:

1. Choose your [**hook point**](#hook-points) - e.g. `first_thing`
2. Choose your [**hook type**](#hook-types) - e.g. `command`
3. Set a [**target**](#targets) server-type for the hook - e.g. `mysql`
4. If your **target** is *not* `any` then set the **run_on** to either `single_server` or `all_servers`.
5. Configure the [**hook fields**](#hook-fields) you require

While this is the bare minimum required to write a functional deploy hook, there are extensive options available for customization. Please read the rest of the guide (below) to understand all the possibilities.

### Writing the YAML

The simplest kind of hook is the `command`. This simply executes a command in the operating system as part of the deployment process.

We're going to add the hook below to our demo application:

```yaml
    first_thing: # Hook point
      - command: apt-get install nmap -y # Hook type
        target: any # Hook fields
        execute: true
```

This hook will install the `nmap` package on our server during the deployment process. We've added the `execute` hook field because we want the command to be executed during deployment. If you don't add this field, the code you're calling won't be executed. 

When automating the installation of packages, remember to use the `-y` flag to answer yes to all prompts.

### Adding the hook to your app

To add the hook:

1. Open the application from your Dashboard
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on *Deploy Hooks* in the sub nav
4. Copy and paste the example code above into the text area
5. Click *Preview* and then check there are no errors in the parsed template file
6. Add a commit message and click *Commit to server* 

### Adding the hook to your app

To add a hook to your app:

1. Create (or, if it exists, open) a file named *deploy_hooks.yml* in a folder named _.cloud66_ in the root of your source code repo.
2. Paste in your (validated) YAML
3. Commit the file to your repo

### Deploying and testing

Now that our hook is in place, we need to re-deploy our application to see it in action. 

1. Navigate back to **application**
2. Click the *Deploy* button
3. Watch the deploy log and you will see the "first _thing"  deploy hook being called as part of the process

(As always, we recommend testing your hooks in a non-production environment before using on your live application.)

The best way to check whether your change has been applied to your server is to access it directly using SSH. [Cloud 66 Toolbelt](../toolbelt/using-cloud66-toolbelt.md#access-your-servers-via-toolbelt) is the quickest way to do this. 

Once you are connected to your server, type `nmap` into the terminal. If your deploy hook was set up correctly, you will see the usage / help text for the nmap utility. If not, Ubuntu will complain that nmap is not installed.

---

## Full guide to deploy hooks

Deploy hooks are YAML-formatted configuration sets that that allow you to **automate actions** (such as running commands) at various points during the build and deployment process for your applications. If you’ve never used hooks before, please follow our [tutorial](#tutorial) to get a grasp of the basics.

Deploy hooks are a powerful tool for customising the components on your servers, and automating the setup process whenever you add new servers. However they require careful configuration to work exactly as expected. This guide will explain all the necessary detail for you to write your own custom hooks. For am exhaustive list of all the options available, please consult our [Reference guide](#hook-fields-reference-guides).

### Creating or editing deploy hooks

All deploy hooks for Rails applications use a file called *deploy_hooks.yml*. This file is found within a folder named *.cloud66*, which is in turn located in the root of your source code.

```bash
/.cloud66/deploy_hooks.yml
```

This file should be YAML formatted, and you can use a service like [YAMLlint](https://codebeautify.org/yaml-validator) to validate it.

Deploy hooks for a Cloud 66 application are managed via the Dashboard. The hooks must be YAML formatted, and you can use a service like [YAMLlint](https://codebeautify.org/yaml-validator) to validate them.

To add or edit hooks:

1. Open the application from your Dashboard
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on *Deploy Hooks* in the sub nav
4. Make your edits
5. Click *Preview* and check there are no errors
6. Add a commit message and click *Commit to server*

Every deploy hook needs, at a minimum:

- a **hook point** - where in the deployment process the hook must be invoked
- a **hook type** - either a `command` or one of the two `script` types
- a **target** - which type(s) of servers will use this hook
- a **hook field** - the command or script being run (or invoked)

Any hook may (optionally) also have:
- a **name** which appears in your logs and user interface when the hook runs (to help you identify what is running)

#### Specifiying app environment

Unless you explicitly specify an **environment** - e.g. `production` - as the top node of your yaml, your hook will be applied to all of your application environments. For example:

```yaml
  production: #Environment
    first_thing: # Hook point
      - command: apt-get install nmap -y # Hook type
        name: installing nmap
        target: any # Hook fields
        execute: true
```

### Understanding hook points and ordering

Hook points are used to define the point in your deployment process at which a hook should be invoked. This is obviously critical when there are tight dependencies between the components of your application (i.e. one component relies on another component being installed first), but it is also important in terms of what actions and commands are possible. For example, running tasks against a database before the database server is installed will not work!

It's important to understand the order in which hook points will occur in the flow of deployment. The simplified deployment process below shows where each deploy hook is triggered. Hooks are marked in ***bold italic***. Some hooks have several possible values (`x`, `y`, `z`). Click on the hook name to see a list of available options:

### Deployment process (simplified)

1. Server is fired up
2. Operating system and standard system components installed → ***first_thing***
3. ***before_agent*** → Cloud 66 Agent is installed → ***after_agent***
4. [***before_x***](#beforex) → Database is installed → [***after_x***](#beforex)
5. [***before_y***](#beforey) → Database replication is configured → [***after_y***](#beforey)
6. ***before_data_mount*** → Data is mounted → ***after_data_mount*** (GlusterFS specific)
7. ***before_haproxy*** → HAProxy is installed → ***after_haproxy*** (runs on HAProxy servers only)
7. ***custom_server*** (runs on custom servers only)
9. ***before_nginx*** → NGINX is installed → ***after_nginx***
10. ***before_docker*** → Docker is installed ***after_docker***
11. **last_thing**

### X, Y and Z

- `x`, `y` and `z` represent `database & storage engine installation` , `replication configuration` and `application framework installation` respectively.
- The **last_thing** hook runs only when ALL servers reach that point

For more details on hook points, please read our [Reference guide](#hook-fields-reference-guides).

### Hook Targets

The **target** of a hook is the server or set of servers on which it must be executed. 

You can use `any` to run the hook across your entire application, but you can also choose to run it on a [specific type of server](#targets).

### Calling environment variables in deploy hooks

You can pull environment variables from your application configuration into your hooks using the following format:

```yaml
username: <%= ENV['DB_USER'] %>
```

These environment variables need to be available in your app before the deploy hook will work correctly. Please follow [our tutorial](../build-and-config/env-vars.md) if you're unsure of how to do this.

## Hook types

There are different types of deploy hooks, and the fields available (and required) vary by type:

- **Commands:** run standard Linux shell commands.
- **Snippets:** use “off the shelf” scripts to install common packages. These snippets are [open source](https://github.com/cloud66/snippets), and are created by Cloud 66 or other third parties.
- **Inline Scripts:** use your own inline shell scripts for more complex procedures

- **Existing Scripts:** use your own existing scripts for more comprehensive procedures

### Using command hooks

The simplest type of hook is the `command`. This executes a command in Ubuntu as part of the deployment process.

You may recognise this example from our [tutorial](#tutorial):

```yaml
production: # Environment
    first_thing: # Hook point
      - command: apt-get install nmap -y # Hook type
        target: any # Hook fields
        execute: true
```

This hook will install the `nmap` package on our server during the deployment process. You can find all the avaible options for command hooks in our reference guide.

### Using snippet hooks

Snippets are pre-defined hook scripts hosted in a [Cloud 66 repository](https://github.com/cloud66/snippets). These are commonly used scripts that we provide for ease of use. Like scripts (see below) these snippets are written in `bash`.

For example the [Cloud 66 ImageMagick snippet](https://github.com/cloud66/snippets/blob/master/cloud66/imagemagick) installs ImageMagick, the popular image processing application. You can use the example below to test it in your *demo* app:

```yaml
production: # Environment
    first_thing: # Hook point
      - snippet: cloud66/imagemagick # Hook type
        target: any # Hook fields
        execute: true
```

You can test this in the same way as you did with the `command` hook in our [tutorial](#tutorial).

### Using inline script hooks

Script hooks allow you to add your own logic to a deploy hook, either by calling a separate file using `source` or by using `inline`. Both of methods use `bash` scripting (as do snippets above).

The hook below will create an arbitrary log file in /tmp using a simple inline script:

```yaml
first_thing: # Hook point
 - inline: |

     #!/usr/bin/env bash
     echo "script called!" >> /tmp/inline_script.log
   target: any
   execute: true
   apply_during: all
   owner: root:root
```

### Using existing script hooks

Existing script hooks allow you to copy a script in your code repository to a chosen location on your server and (if required) to execute it.

The hook below will wait until the very end of the deployment process (`last_thing`), then copy the shell script named `magic-shell.sh` into the `/usr/local/bin` directory on your server and finally execute it.

```yaml
last_thing:
 - source: scripts/magic-shell.sh
   destination: /usr/local/bin
   target: any
   execute: true
   apply_during: all
```

## Advanced examples of Deploy Hooks

We've put together some examples of the most common use cases, but there an almost infinite number of possibilities. Essentially if you can install it on a Linux server or code it into a shell script, you can run it from a deploy hook.

### Querying server metadata 

You can query a server's metadata (including deployment details) using the following command:

```shell
curl -s -H "Accept: application/json" https://$CLOUD66_ACCOUNT_API_KEY:X@app.cloud66.com/api/tooling/metadata/$CLOUD66_APPLICATION_API_KEY
```
You can use this command in a deploy hook, for example:

```yaml
first_thing:
- target: any
  execute: true
  apply_during: all 
  sudo: false
  inline: |
    #!/usr/bin/env bash
    current_deployer=$(curl -s -H "Accept: application/json" https://$CLOUD66_ACCOUNT_API_KEY:X@app.cloud66.com/api/tooling/metadata/$CLOUD66_APPLICATION_API_KEY/deployment/triggered_by | jq -r '.response')
    echo "Deployed by: $current_deployer"
```
For more details please read our full [Querying server metadata](../servers/querying-server-metadata.md) doc.

### Install packages on each server deployed

If your application relies on a package or software library that is not installed by default by Ubuntu, or by Cloud 66, you may ask, how do I install a package or library on each server I deploy? 

You can use a deploy hook to fetch and install the package whenever you deploy a server.  

For this example we're going to use **glances** - a popular FOSS process monitor - but you can install literally anything that has an Ubuntu repository using this method. 

We need to set up our deploy hook to install the package from the Ubuntu. Every deploy hook needs:

- **a hook point** - in this case we are using the `first_thing` hook point to ensure this is installed as early as possible in case any other processes depend on it
- A **hook type** - we are using the `command` hook type
- A **target** -  in this case we are using `any` because we want the package on all our servers
- A **hook field** - this is where we put the commands we're going to run.

Any hook may (optionally) also have:
- a **name** which appears in your logs and user interface when the hook runs (to help you identify what is running)

Our hook code will look like this:

```yaml
first_thing:
 - command: sudo apt-get install glances
   name: installing glances
   target: any
   execute: true
```

Now that we have our hook code ready, we need to add it to our application. We do this by creating a file in the `/.cloud66` directory of our repo called `deploy_hooks.yml` and dropping in the YAML code we just wrote above. If you're not well versed in YAML, it's often helpful to use an [online linter](https://codebeautify.org/yaml-validator) to test that your code is valid and conformant. 

Once you have added the `deploy_hooks.yml` file to your repo you can deploy (or redeploy) your application and glances will be installed during the process. To test that it is installed correctly you can SSH into your server and run `glances` - it should bring up the monitoring interface.

### Installing non-standard versions of packages

If your application depends on a specific version of a Linux package or software library, the best way to ensure the correct version is installed is by using a deploy hook.

To illustrate how this is done we're going to use ImageMagick - the beloved and ubiquitous image processing software installed on millions of servers around the world.  Suppose your application relies on an older version of ImageMagick - in this case [Version 6.9.9-51.](https://github.com/ImageMagick/ImageMagick6/releases?after=6.9.10-0)

We need to set up our deploy hook to download the [source code](https://github.com/ImageMagick/ImageMagick6/archive/6.9.9-51.tar.gz) for this version and then build and compile it. Every deploy hook needs:

- **a hook point** - in this case we are using the `first_thing` hook point to ensure this is installed as early as possible in case any other processes depend on it
- A **hook type** - we are using the `inline` hook type - we'll go into the details of this later
- A **target** -  in this case we are using `rails` but `any` would also work
- A **hook field** - this is where we put the commands we're going to run. We're going to use [these instructions](https://imagemagick.org/script/install-source.php) as the basis for our commands.

Any hook may (optionally) also have:
- a **name** which appears in your logs and user interface when the hook runs (to help you identify what is running)

Hooks are written in YAML and ours will look like this:

```yaml
first_thing:
- target: rails
  name: ImageMagick v6.9.9-51
  execute: true
  apply_during: build_only 
  sudo: true
  inline: |
    #!/usr/bin/env bash
    set -e
    version="6.9.9-51"
    echo "Installing ImageMagick v$version"

    echo "1. Fetching Tarball"
    curl -sL https://codeload.github.com/ImageMagick/ImageMagick6/tar.gz/"$version" --output /tmp/image-magick-"$version".tar.gz 

    echo "2. Extracting Tarball"
    cd /tmp
    mkdir -p /opt/image-magick/v"$version"
    tar -xvzf image-magick-"$version".tar.gz -C /opt/image-magick/v"$version" --strip 1

    echo "3. Building ImageMagick"
    cd /opt/image-magick/v"$version"
    ./configure
    make
    make install 
    ldconfig /usr/local/lib

    echo "4. Tidying up"
    rm -f /tmp/image-magick-"$version".tar.gz

    echo "ImageMagick install complete!"
```

Two things to take note of here:

1. In order to execute properly, the script needs a place on the disk to run - we are using the `/tmp/` directory
2. We have added another option - `apply_during` - this allows us to set our hook to only run when a server is first built, and not on every deploy. You can find out more about these options in our reference doc.

Now that we have our hook code ready, we need to add it to our application. We do this by creating a file in the `/.cloud66` directory of our repo called `deploy_hooks.yml` and dropping in the YAML code we just wrote above. If you're not well versed in YAML, it's often helpful to use an [online linter](https://codebeautify.org/yaml-validator) to test that your code is valid and conformant. 

Once you have added the `deploy_hooks.yml` file to your repo you can deploy (or redeploy) your application and version 6.9.9-51 of ImageMagick will be installed during the process. To test that it is installed correctly you can SSH into your server and run `identify -version`.

### Switching config files during build

This hook simply overwrites a standard config file with the config file of your choice at the start of the deployment process. The example is for a `database.yml` but you could use it for any config file.

```yaml
after_checkout:
command: mv $STACK_PATH/config/database.yml.cloud66 $STACK_PATH/config/database.yml
target: rails
run_on: all_servers
execute: true
```

For more info on doing this for external databases, read our separate guide to [database management](../databases/database-management.md#external-databases).

## Debugging deploy hooks

Automating deploy hooks can sometimes be tricky. To avoid issues, it's good practice to run each of your commands manually to see that they complete successfully.

If a specific command doesn't show any output, you can use the `echo $?` command after issuing your command to see its exit code. If it returns a _zero_, your command was successful, whereas a _one_ means it has failed.

## Hook points

The deployment process is divided into a number of steps, and hook points allow you to intervene at various points during this process.

The table below is arranged in the order in which each hook point occurs in the deployment process (from earliest to latest):

|Hook point|Description|
|--- |--- |
|first_thing|The first thing that will happen on the server after the operating system is installed. A common use-case for this hook is to install custom packages that your application relies on.|
|before_agent|Runs before the Cloud 66 agent is installed on your server|
|after_agent|Runs after the Cloud 66 agent is installed on your server|
|before\_`x`|Runs before database and storage engine(s) are installed on your server. Accepted values for `x`: `redis`, `mysql`, `postgresql`, `mongodb`, `elasticsearch`, `rabbitmq`, `glusterfs`, `influxdb`|
|after\_`x`|Runs after database and storage engine(s) are installed on your server. If multiple engines are installed it will wait until all of them are completed. Accepted values for `x`: `redis`, `mysql`, `postgresql`, `mongodb`, `elasticsearch`, `rabbitmq`, `glusterfs`, `influxdb`|
|before\_`y`|Runs before replication is configured for the database server(s). Accepted values for `y`: `glusterfs_config`, `redis_replication`, `mongodb_replication`, `mysql_replication`, `postgresql_replication`|
|after\_`y`|Runs after replication has been configured for the database server(s). Accepted values for `y`: `glusterfs_config`, `redis_replication`, `mongodb_replication`, `mysql_replication`, `postgresql_replication`|
|before_data_mount|Runs before data is mounted (GlusterFS only)|
|after_data_mount|Runs right after data has been mounted in GlusterFS|
|before_haproxy|Runs right before HAProxy is installed (on HAProxy servers only).|
|after_haproxy|Runs right after HAProxy is installed (on HAProxy servers only).|
|custom_server|Runs only on your custom servers|
|before_node|Runs before we install Node on your server|
|after_node|Runs directly after Node has been installed|
|before_nginx|Runs before we install NGINX on your server|
|after_nginx|Runs directly after we install NGINX on your server|
|before_docker|Runs before Docker is installed on your server.|
|after_docker|Runs directly after Docker is installed on your server.|
|before\_`z`|Runs before your application framework is installed on your server. Accepted values for `z`:  `rails`, `rack`, `sinatra`, `padrino`|
|after_checkout|When we create your server, your code is pulled directly from Git. Use this hook if you want to make a change to your code after it is pulled.|
|after_bundle|Runs after the bundle command(s) but before other rake tasks, such as database migrations. Happens during the code deployment of your application. ** Note:** Use this hook if you need to run commands that are invoked before the symlink is updated on the release path.|
|after_symlink|Runs after the symbolic link to your current code folder has been created. Happens during the code deployment of your application. This is a suitable hook point for running rake tasks like `db:migrate`, `db:seed` and `db:rollback`|
|before_restart|The last point before we issue commands to your web server to reload/restart|
|after_`z`|Runs after your application framework (and everything web related) is installed on your server. Accepted values for `z`: `rails`, `rack`, `sinatra`, `padrino`|
|before_processes|Runs before any custom processes (i.e. Procfile or simmilar)|
|after_processes|Runs after any custom processes|
|last_thing|This hook will run as the last thing that happens on your server. If you have multiple servers, this hook will only trigger when all of them reach this point.|

* * *

## Targets

Every deploy hook must have a **target** - a server or set of servers on which it must be executed. You can simply choose `any` to run the hook across your entire application, but you can also choose to run it on a specific type of server. The options are `any`, `rails`, `mysql`, `postgresql`, `mongodb`, `redis`, `sinatra`, `padrino`, `custom`.

If you set the target of a hook to anything other than `any` then you will need to pay attention to the **run_on** field. This determines whether the hook will be applied to a *single server* in that group (the default) or to *all* the servers in that group.

## Hook types

There are different types of deploy hooks, and the fields available (and required) vary by type:

- **Snippets:** use "off the shelf" scripts to install common packages. These snippets are [open source](https://github.com/cloud66/snippets), and are created by Cloud 66 or other third parties.
- **Commands:** run your own commands.
- **Inline Scripts:** use your own inline scripts for more comprehensive procedures

- **Existing Scripts:** use your own existing scripts for more comprehensive procedures (Rails/Node applications only)

## Hook fields reference guides

Each hook type has a different set of hook fields available, with some shared fields. Please be careful to note that:

- Some fields are mutually exclusive (e.g. you cannot specify both **sudo** and **run_as** fields)
- Some fields have different defaults for different hook types. For example the **execute** field defaults to `false` for inline scripts and snippets, but to `true` for commands.

### Hook fields: snippets 

Please make sure you read the `run_on` section, if your target is not `any`

|Field|Description|
|--- |--- |
|snippet |Snippet to be used - runs in `/tmp/deploy_hooks` by default|
|target |Target server(s), with accepted values `any`, `rails`, `mysql`, `postgresql`, `mongodb`, `redis`, `sinatra`, `padrino`, `custom`|
|execute  (false)|Set to true for the code to be executed during deployment|
|executable  (false)|Set to true for the code to be made executable on the target. Defaults to true if `execute` is true|
|apply_during  (all)|Specify when you want the deploy hook action to take place. Accepted values are `build_only`, `deploy_only` or `all`. The `build` step occurs the first time an application is deployed, and will re-occur until the application has been successfully deployed at least once. After this subsequent deployments are `deploy` steps|
|env_vars|Hash of values that will be set when running this specific deploy hook. Only applies to deploy hooks that have execute = true. If the application already contains this env var it will be overridden with the value specified here.|
|halt_on_error  (true)|Specify whether the execution should continue or halt in the event of an error|
|run_on  (single server)|If you have multiple servers in the same group (e.g. scaled-up Rails servers), you can specify whether you want the deploy hook action to occur just once or once against each server in that group. Valid values are: `single_server` or `all_servers`. If you've specified `target: any` above, this will apply to all servers|
|run_as  (server user)|If you execute a file on your target server, specify which user you would like the file to be executed as Note: you can't specify both this and `sudo`|
|sudo  (false)|If you are executing the file on your target server, specify whether you want that execution to be sudo-ed? Note: you can't specify both this and `run_as`|

### Hook fields: commands

|Field|Description|
|--- |--- |
|command |Command to be used - run in `/tmp/deploy_hooks` by default|
|target |Target server(s), with accepted values `any`, `rails`, `docker`, `mysql`, `postgresql`, `mongodb`, `redis`, `sinatra`, `padrino`, `custom`|
|execute  (true)|Set to true for the code to be executed during deployment|
|executable  (false)|Set to true for the code to be made executable on the target. Defaults to true if `execute` is true|
|apply_during  (all)|Specify when you want the deploy hook action to take place. Accepted values are `build_only`, `deploy_only` or `all`. The `build` step occurs the first time an application is deployed, and will re-occur until the application has been successfully deployed at least once. After this subsequent deployments are `deploy` steps|
|env_vars|Hash of values that will be set when running this specific deploy hook. Only applies to deploy hooks that have execute = true. If the application already contains this env var it will be overridden with the value specified here.|
|halt_on_error  (true)|Specify whether the execution should continue or halt in the event of an error|
|run_on  (single server)|If you have multiple servers in the same group (e.g. scaled-up Rails servers), you can specify whether you want the deploy hook action to occur just once or once against each server in that group. Valid values are: `single_server` or `all_servers`. If you've specified `target: any` above, this will apply to all servers|
|run_as  (server user)|If you execute a file on your target server, specify which user you would like the file to be executed as Note: you can't specify both this and `sudo`|
|sudo  (false)|If you are executing the file on your target server, specify whether you want that execution to be sudo-ed? Note: you can't specify both this and `run_as`|

### Hook fields: inline scripts

|Field|Description|
|--- |--- |
|inline |The shell script that will be executed during deployment|
|target |Target server(s), with accepted values `any`, `rails`, `mysql`, `postgresql`, `mongodb`, `redis`, `sinatra`, `padrino`, `custom`|
|execute  (false)|Set to true for the code to be executed during deployment|
|executable  (false)|Set to true for the snippet to be made executable on the target. Defaults to true if `execute` is true|
|destination|The destination path on your target server. You can also specify environment variables in your destination field; `<%= ENV['STACK_PATH'] %>` for example|
|apply_during  (all)|Specify when you want the deploy hook action to take place. Accepted values are `build_only`, `deploy_only` or `all`. The `build` step occurs the first time an application is deployed, and will re-occur until the application has been successfully deployed at least once. After this subsequent deployments are `deploy` steps|
|env_vars|Hash of values that will be set when running this specific deploy hook. Only applies to deploy hooks that have execute = true. If the application already contains this env var it will be overridden with the value specified here.|
|halt_on_error  (true)|Specify whether the execution should continue or halt in the event of an error|
|run_on  (single server)|If you have multiple servers in the same group (e.g. scaled-up Rails servers), you can specify whether you want the deploy hook action to occur just once or once against each server in that group. Valid values are: `single_server` or `all_servers`. If you've specified `target: any` above, this will apply to all servers|
|run_as  (server user)|If you execute a file on your target server, specify which user you would like the file to be executed as Note: you can't specify both this and `sudo`|
|sudo  (false)|If you are executing the file on your target server, specify whether you want that execution to be sudo-ed? Note: you can't specify both this and `run_as`|
|parse  (true)|Specifies whether the file being transferred should be parsed for [environment variables](../build-and-config/env-vars.md). Using this you can embed `<%= ENV['ENV_VAR'] %>` for example in your source file, and have it resolved during the deploy hook action|
|owner  (your server user)|Ownership permissions for the file (and destination folder) on the target server. An example could be `user:group`|

### Hook fields: existing scripts

Existing scripts are a Rails-only feature.

|Field|Description|
|--- |--- |
|source |This specifies the source location of your deploy hook file within your repository|
|destination |The destination path on your target server. You can also specify environment variables in your destination field; `<%= ENV['STACK_PATH'] %>` for example|
|target |Target server(s), with accepted values `any`, `rails`, `mysql`, `postgresql`, `mongodb`, `redis`, `sinatra`, `padrino`, `custom`|
|execute  (false)|Set to true for the code to be executed during deployment|
|env_vars|Hash of values that will be set when running this specific deploy hook. Only applies to deploy hooks that have execute = true. If the application already contains this env var it will be overridden with the value specified here.|
|executable  (false)|Set to true for the snippet to be made executable on the target. Defaults to true if `execute` is true|
|apply_during  (all)|Specify when you want the deploy hook action to take place. Accepted values are `build_only`, `deploy_only` or `all`. The `build` step occurs the first time an application is deployed, and will re-occur until the application has been successfully deployed at least once. After this subsequent deployments are `deploy` steps|
|halt_on_error  (true)|Specify whether the execution should continue or halt in the event of an error|
|run_on  (single server)|If you have multiple servers in the same group (e.g. scaled-up Rails servers), you can specify whether you want the deploy hook action to occur just once or once against each server in that group. Valid values are: `single_server` or `all_servers`. If you've specified `target: any` above, this will apply to all servers|
|run_as  (server user)|If you execute a file on your target server, specify which user you would like the file to be executed as Note: you can't specify both this and `sudo`|
|sudo  (false)|If you are executing the file on your target server, specify whether you want that execution to be sudo-ed? Note: you can't specify both this and `run_as`|
|parse  (true)|Specifies whether the file being transferred should be parsed for [environment variables](../build-and-config/env-vars.md). Using this you can embed `<%= ENV['ENV_VAR'] %>` for example in your source file, and have it resolved during the deploy hook action|
|owner  (your server user)|Ownership permissions for the file (and destination folder) on the target server. An example could be `user:group`|