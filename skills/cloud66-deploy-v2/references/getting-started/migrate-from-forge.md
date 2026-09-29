# Migrating from Forge


## Overview

You can migrate your PHP application from Forge to Cloud 66 in 3 steps:

1. Build and deploy your application's code via the Cloud 66 dashboard
2. Import your data to your new environment
3. Redirect traffic to the new endpoint

Cloud 66 does not host applications. We automate the build and deployment of your application to the cloud provider of your choice, or your own servers (virtual or physical).

## What you’ll need

Before you begin migrating your application please check you have the following:

- **A Cloud 66 Account** — If you don't already have one, **[sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up)**.
- **A Git repo containing your application code** — This can be a public or private repo. You can use any Git provider like GitHub / BitBucket or use your own privately hosted repo.
- **A Dockerfile in your repo** — Cloud 66 relies on containerisation to host and manage your application - you’ll need a Dockerfile. If you don’t have one, we have a sample below that you can use.
- **A Cloud Account or Your Own Servers** — See below.

## Build and deploy your code

Using the [Cloud 66 Dashboard](https://app.cloud66.com/dashboard), you can pull your code directly from your Git repository and build it into a new version of your application on your own servers. Follow the steps below to get up and running in under 5 mins: 

### 1: Ensure your repo has a Dockerfile

If your application doesn’t already have a Dockerfile you can use our basic example file below and tweak it to your needs. The file should be named `Dockerfile`  and should be placed in the root of your repo. 

Sample Dockerfile for PHP applications:

```docker
# Use the official PHP 8.0 image as the base
FROM php:8.0-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    && docker-php-ext-install zip pdo_mysql

# Enable Apache rewrite module
RUN a2enmod rewrite

# Set the document root to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Copy the application files to the container
COPY . /var/www/html

# Set the working directory
WORKDIR /var/www/html

```

### 2: Choose a source

The first thing we need is access to your code, so that we can build and deploy it for you. 

The easiest option is to give us (read-only) access to a Github repo. To do this:

1. Click *Get Started*
2. On the next page click *Link with Github*
3. We’ll send you to our app on Github (you’ll need to sign in)
4. Once you’re signed in, click *Configure* & then select the Github account you wish to link to Cloud 66
5. Install and authorize our Github app (you can restrict our access to specific repos if needed)
6. You will be redirected back to your Cloud 66 dashboard and you can move on to Step 2.

If you’d prefer to use another method, you can consult the table on our [main getting started guide](../getting-started/deploy-your-first-app.md#step-1-choose-a-source). 

You’ll need a Dockerfile in the root of your repo or the next step won’t work. See the guide above to add one.

### 3: Define your application

Now that we have access to your git host, you can tell us which repo you want to deploy:

1. Choose the repo you want to deploy and set the branch
2. Choose an environment for your application
3. Give your application a name (this will be used to label your application throughout the Cloud 66 dashboard, and will not be visible to public users.)
4. Click *Analyze* - we will now scan your repo and suggest the optimal settings

### 4: Configure services

Once we have scanned your application code, we will create an image for your application. You can leave this as it is and move on to the Service configuration. 

1. Click Next
2. Click Configure Ports in the Network column 
3. Set your container port to `80`
4. Set your HTTP port to `80` and your HTTPS port to `443`
5. You can also define a [persistent storage volume](../build-and-config/service-storage.md) if needed
6. Click Save Service
7. Click Next to move to Servers & Databases

### 5: Add a cloud provider

#### A. Configure access to your cloud provider

We need access to your cloud account in order to provision and manage servers on your behalf. How you configure that access differs from provider to provider. Select your cloud provider from the dropdown for more help.

#### B. Add your cloud provider as a deployment target

To add your cloud credentials click the *Add a Deployment Target* button. This will open a panel that will enable you to grant Cloud 66 access to your provider.

Click the green *Add Deployment Target* button once complete.

#### C. Specify servers

Next you need to specify where your servers will be situated, how large they should be, and where your data will be stored:

1. Choose a **Server Region**
2. We will suggest a size for your application server - you can change it as needed
3. Specify whether your datastore will share the app server (not recommended for Production), or have its own server. You can also use an existing [external database server](../databases/database-management.md#no-database-external) if you prefer.

### 6: Deploy your app

When you’re satisfied with your servers, click the *Start Deployment* button. During the build and deployment process you can view the log to see what’s happening behind the scenes.

You can also close the window and come back later. We will email you once the application is deployed (or if it fails).

## Migrate your data

Once your code is deployed, you'll need to migrate your data across. The specifics of the process differ depending on your database, but all of them involve the same steps:

1. Access your database server via SSH
2. Export / dump the contents of your database into a directory
3. Compress files into a single tar or zip file
4. Transfer that file to a location that Cloud 66 will be able to access
5. Log into your database server at Cloud 66 (Toolbelt makes this quick and easy)
6. Copy the file from your Forge server to your Cloud 66 server using a command like `scopy` or `rsync` 
7. Unpack your archived file(s)
8. Import your data into your database (see guides linked below)

### How to import data files

These guides should help you with Step 8 above:

- [Importing MySQL dumps](https://www.digitalocean.com/community/tutorials/how-to-import-and-export-databases-in-mysql-or-mariadb#step-2-mdash-importing-a-mysql-or-mariadb-database)
- [Importing Postgres dumps](https://gist.github.com/pierrejoubert73/85b3ce8b52e7f6dbce69e2636f68383f)
- [Importing Redis dumps](https://developer.redis.com/guides/import/)
- [Importing MongoDB dumps](https://www.mongodb.com/docs/database-tools/mongorestore/#syntax)

## Change your DNS

Once you're ready to serve traffic from your Cloud 66 application, you need to direct your traffic to it. For help doing this, see [Configure your DNS](https://help.cloud66.com/docs/networking/configure-dns).

Congratulations! You've deployed your first app with Cloud 66. Reach out to [support](https://app.cloud66.com/support_tickets/new) if you need any help.

## What's next?

* Get started with [manifest files](../manifest/what-is-a-manifest-file.md) - a powerful tool for defining your application's components
* Learn about [CustomConfig](../custom-config/custom-config.md) - a tool for defining and managing configuration templates
* Learn how to use [Toolbelt](../toolbelt/using-cloud66-toolbelt.md) - a powerful command-line interface for managing your Cloud 66 applications.