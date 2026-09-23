# Managing environment variables


## Overview

Environment variables contain a name and value, and provide a simple way to share configuration settings between multiple applications and processes in Linux. For example, Cloud 66 creates environment variables for your database server address, which can be referenced in your code. This has numerous benefits:

- Your environments can use different environment-specific configurations with less manual intervention
- These values may change, so setting them as variables makes updating them simpler to update
- You don't need to commit sensitive information to your Git repository

By default Cloud 66 creates and manages the minimum environment variables required to run your application. This guide will walk you through how to add custom environment variables to your Cloud 66 application, and how to edit existing variables.

## Adding an environmental variable

To add a custom environment variable to your application:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on *Environment Variables* in the sub-nav
4. Scroll down to the **Your Custom Variables** section
5. Add the key `FOO` and the value `BAR` (don't worry these are dummy entries and won't actually do anything)
6. Click *Save Changes*
7. New environment variables are only applied to your application server(s) when you deploy. Do that now by clicking the *Deploy* button.

### Testing your change

The best way to check whether your new variable has been applied to your server is to log into it via SSH. [Cloud 66 Toolbelt](../toolbelt/using-cloud66-toolbelt.md#access-your-servers-via-toolbelt) is the quickest way to do this. 

Once you are connected to your server, enter this command `printenv FOO`. The server will responed with `BAR`. If it does not, check you have followed all the steps above.

## Editing an existing variable

You can edit / update any custom variables you have added to Cloud 66, as well as some of the default variables. A good example would be changing the password for your [database server](../databases/adding-database.md). 

To do this:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on *Environment Variables* in the sub-nav
4. Find the key you'd like to change, for example `MYSQL_PASSWORD` and update the value
5. Save and redeploy as you did above

You can test this by accessing your server via SSH using [Cloud 66 Toolbelt](../toolbelt/using-cloud66-toolbelt.md#access-your-servers-via-toolbelt) and logging into MySQL with the new password.  

Updating default environment variables can cause an application to break unless it has been coded to cope with such changes. Proceed carefully! 

## Listing environment variables

For a list of environment variables available in your application:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on *Environment Variables* in the sub-nav that opens
4. The initial page displays all the *Editable* variables. You can see all the *Read Only* variables by clicking on that tab.

### Default environment variables

Cloud 66 creates a number of default environment variables, which can be used in addition to those that you define. Depending on your application configuration, the environment variables available will differ.

### Pre-defined environment variables

There are some also special variables that are predefined by Cloud 66:

- `SERVER_NAME` Is defined on each server and is only available inside the server
- `DOCKER_HOST_IP` Is injected to each container and is only available inside containers

## Assigning environment variables

### During deployment

If your application relies on specific environment variables to complete the deployment process, you will need to add them before deploying.

To do this:

1. After you have defined your services, but before you build your application images, Click on ⚙️ *Settings* in the left-hand nav, and then *Environment Variables" in the sub-nav
2. Set your variables by either manually entering them, or uploading a file that contains the variables. This file should use the following format:

```bash
KEY_1=value_1
KEY_2=value_2
```

Once your variables are set, *Save changes* and continue to deployment.

### After application build

You can also assign environment variables to an application that has already been built and/or deployed.

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click *Environment Variables" in the sub-nav
4. Add or update the variables as required
5. Save and redeploy

Be aware of the following while assigning environment variables:

- **Some environment variables cannot be modified** — For example, environment variables for your server IP addresses cannot be changed because they are automatically set and updated based on reported IP addresses.

### Using AUTO GENERATE

**AUTO_GENERATE** allows you to insert placeholder environment variables into your application, and Cloud 66 will automatically replace them with a random string. This is useful to have Cloud 66 automatically generate values for secrets that you do not want to have committed into your repository.

To use **AUTO_GENERATE**, you define any (editable) environment variable with the value `AUTO_GENERATE` or `AUTO_GENERATE_{number}` where the number is the length of the value to auto-generate - ie. **AUTO_GENERATE_32**.

When you deploy your application, Cloud 66 will replace these placeholders with a random string of the specified length (10 is the default length).

Using this, you can safely commit your env file to your git repository without exposing the actual values of your environment variables.

## Managing environment variables using Toolbelt

You can also manage your environment variables using your [Cloud 66 Toolbelt](../toolbelt/using-cloud66-toolbelt.md). There are four methods for managing env vars via Toolbelt:

- [Listing environment variables](../toolbelt/_env-vars-list.md)
- [Downloading variables](../toolbelt/_env-vars-download.md) as a file
- [Setting individual variables](../toolbelt/_env-vars-set.md)
- Setting variables in bulk by [uploading a file](../toolbelt/_env-vars-upload.md)

Please click on the links above for detailed instructions on each of these methods.

## Referencing existing variables

You can define environment variables that reference (i.e. pull in) existing variables:

- **You can reference other environment variables on the same application** — This is useful when referencing an environment variable which you don't control such as a server IP address.
- **You can reference environment variables available on other applications** — You need administrative privileges on the target application to reference environment variables on it.
- **You can reference environment variables available on other services** — You need administrative privileges on the target application to reference environment variables in its services.

### Basic referencing syntax

You can reference another environment variable in the same application using the following syntax:

`{{ENV_VAR}}`

or

`_env(ENV_VAR:DEFAULT_VALUE)`

The second method is useful when you want to specify a default value. If Cloud 66 can’t find the referenced environment variable it will use default value instead. (**DEFAULT_VALUE** is optional).

For example, this sets a health check variable to use the external web address variable of the application:

```bash
MY_HEALTH_CHECK=http://_env(WEB_ADDRESS_EXT)/health_check/
```

This example sets the key to use the external web address of the application, and sets a default IP if that variable is not available:

```bash
MY_KEY_1=_env(WEB_ADDRESS_EXT:192.168.0.1)
```

### Referencing env vars in service.yml commands

You can use environment variables in `service.yml` commands, as long as the variables are wrapped in `$( )`. For example:

```yml
services:
 my_service:
  image: my_image 
  command: app_start -redis=$(REDIS_ADDRESS) 
  ports:
  - container: 80
```

### Intra-app referencing syntax

To reference an environment variable from another application you will need:

- The unique identifier (APP_UID) for that application
- Admin access to that application

You can find an application's APP_UID by clicking on ⚙️ *Settings* in the left-hand nav and then clicking on the *Information* tab at the top of the main panel.

The syntax for referencing variables from another app is:

`{{STACK[APP_UID].ENV_VAR}}`

or

`_env(STACK[APP_UID].ENV_VAR)`

This syntax still uses the term "stack" which in the process of being deprecated in Cloud 66. "Stack" means, for all intents and purposes, the same thing as "application".

### Intra-service referencing

To refer to an environment variable in other services you can use

`{{STACK[STACK_UID].SERVICE[SERVICE_NAME].ENV_VAR}}`

or

`_env(STACK[STACK_UID].SERVICE[SERVICE_NAME].ENV_VAR)`

## Defining environment variables in a service

Environment variables can be used in a Cloud 66 service definition (`service.yml` file) to pass variables between application components. Read [our guide to using service.yml](../build-and-config/docker-service-configuration.md) for more help.

The syntax for defining environment variables in a service definition is:

```yaml
services:
 service_name:
   env_vars:
    VAR1: _env(VARIABLE_NAME)
```

## Syntax examples

```yaml
services:
 <service_name>:
  env_vars:
   # Setting an environment variable
   ENV_NAME1: VAR_NAME

   # Referencing an application-wide variable
   ENV_NAME2: _env(STACK_ENV_VAR_NAME)

   # Referencing an application-wide variable with a default fall-back
   ENV_NAME3: _env(APP_ENV_VAR_NAME:Default)

   # Referencing a variable from another service
   ENV_NAME4: _env(SERVICE[SERVICE_NAME].ENV_VAR_NAME)

   # Referencing a variable from another service with a default fall-back
   ENV_NAME5: _env(SERVICE[SERVICE_NAME].ENV_VAR_NAME:Default)

   # Referencing a variable from another application
   ENV_NAME6: _env(STACK[APP_UID].ENV_VAR_NAME)

   # Referencing a variable from another application with default fall-back
   ENV_NAME7: _env(STACK[APP_UID].ENV_VAR_NAME:Default)

   # Referencing a service variable from another application
   ENV_NAME8: _env(STACK[APP_UID].SERVICE[SERVICE_NAME].ENV_VAR_NAME)

   # Referencing a service variable from another application with default fall-back
   ENV_NAME9: _env(STACK[APP_UID].SERVICE[SERVICE_NAME].ENV_VAR_NAME:Default)
```

### Working example

In this example we are adding **pgbouncer**, a popular connection pooler for Postgres, to an application. We're adding pgbouncer as a container, and we need to point it at to our Postgres instances so that it can work its magic. The environment variables section of the `service.yml` would look something like this:

```yaml
services:
 pgbouncer:
  env_vars:
   DATABASES_HOST: _env(POSTGRESQL_ADDRESS)
   DATABASES_PORT: _env(POSTGRESQL_PORT)
   DATABASES_USER: _env(POSTGRESQL_USERNAME)
   DATABASES_PASSWORD: _env(POSTGRESQL_PASSWORD)
   DATABASES_DBNAME: _env(POSTGRESQL_DATABASE)
   PGBOUNCER_LISTEN_PORT: 5439
```
Read [our guide to using service.yml](../build-and-config/docker-service-configuration.md) for more help.

## Calling env vars in a Dockerfile

You can pass environment variables into a Dockerfile during your build process with the `$VARIABLE` syntax, which will be populated with environment variable(s) set on the application. For example, to call a env named `MY_VARIABLE` you would use `ENV MY_VARIABLE "$MY_VARIABLE"`

The same example, in context:

```docker
FROM ruby:latest
RUN mkdir /myapp
WORKDIR /myapp
COPY . /myapp
ENV MY_VARIABLE "$MY_VARIABLE"
EXPOSE 3000
CMD ["/myapp/main.rb"]
```

Note that the key name **must** be capitalized. 

For example the following:

```docker
ENV WEB_IP "$WEB_ADDRESS_INT"
```

...would pull the internal IP address of the application's webserver into the Dockerfile and assign it to a local variable named "WEB_IP". 

The environment variable you are calling **already exists** in your Cloud 66 application. If it doesn't, this call will result in a build error. 

You can also use the following format if you don't need to set the output as a variable and just need the value of the key for another operation.

```docker
RUN echo $WEB_ADDRESS_INT
```

## Using environment variables in code

Using environment variables in your application logic is done differently depending on your application settings. Here are some common examples:

### Bash scripts

```bash
$ENV_VAR
```

### YAML files

```yaml
username: <%= ENV['DB_USER'] %>
```

### .RB files

```ruby
working_directory "#{ENV['STACK_PATH']}"
```

## Pulling binaries into your Dockerfile using env vars

It's possible to add small binary files (30KB or smaller) to your application during the build step using a combination of Base64 encoding and environment variables. To do so:

1. Hash the file using `cat filename.ext | base64` and copy the resulting hash (it may be very long, so take care).
2. Paste it into a new env_var in your Cloud 66 application dashboard
3. Add a RUN command to your Dockerfile. For example:
`RUN echo $QR_CODE | base64 -D > /var/www/QR-code.png` 

This will create a PNG called QR-code under the /var/www directory with the output of the base64 decoding.

For step 1 you can also use this method: `base64 -i filename.ext -o hashfilename` 

...if you'd prefer to output the hash as a file. This often makes it easier to copy the entire hash value (rather than copying from the terminal).