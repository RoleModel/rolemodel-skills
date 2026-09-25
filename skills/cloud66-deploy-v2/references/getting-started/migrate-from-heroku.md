# Migrating from Heroku


## Why migrate now?

Heroku has [announced a shift to a sustaining engineering model](https://www.heroku.com/blog/an-update-on-heroku/) focused on stability and maintenance rather than new features. The platform is no longer investing in new capabilities, and the Enterprise tier is being discontinued. While existing apps continue to run, the writing is on the wall: teams that depend on Heroku for production workloads should start planning their next move.

Cloud 66 is a natural landing spot for Heroku users. Like Heroku, we give you a simple deployment workflow driven by Git — but instead of running on a proprietary platform, your apps deploy to your own cloud account (AWS, DigitalOcean, GCP, Azure, Hetzner, and more) or your own servers. You keep full SSH access, pay your cloud provider directly, and avoid platform lock-in. Everything Heroku gave you — managed Postgres, Redis, background workers, environment variables, review apps — has a Cloud 66 equivalent, often with more control.

If you're coming from Heroku, the migration is straightforward. The guide below walks you through it step by step.

## Overview

You can migrate your application from Heroku to Cloud 66 in 4 steps:

1. Build and deploy your application's code via the Cloud 66 dashboard
2. Import your data to your new environment
3. Migrate your environment variables
4. Redirect traffic to the new endpoint

Cloud 66 does not host applications. We automate the build and deployment of your application to the cloud provider of your choice, or your own servers (virtual or physical).

## What you’ll need

Before you begin migrating your application please check you have the following:

* **A Cloud 66 Account** &mdash; If you don't already have one, [sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up). Your first server is free, no credit card required.
* **A Git repo containing your application code** &mdash; This can be a public or private repo. You can use any Git provider like GitHub / BitBucket or use your own privately hosted repo.
* **A Cloud Account or Your Own Servers** &mdash; See below.

Using Heroku, you can choose between 1X (512 MB), 2X (1 GB) and PX (6 GB) server sizes. This makes it easy to calculate your server requirements, and we recommend that you use similar server resources when deploying your application via Cloud 66. We also recommend that you have a separate server for your database in production environments.

## Migrating

### 1. Build and deploy your code

Using the [Cloud 66 Dashboard](https://app.cloud66.com/dashboard), you can pull your code directly from your Git repository and build it into a new version of your application on your own servers. 

If you need help getting started, please read our [Deploying your first Rails app](../getting-started/deploy-your-first-app.md) guide.

We also have a guide to [accessing your Git repository](../cloud-66-101/access-your-code.md).

### 2. Data

Once your code is deployed, you'll need to migrate your data across. The process differs for Postgres and MySQL databases:

#### Postgres

From the Heroku CLI, create a database backup and get its URL:

```bash
$ heroku pg:backups:capture --app [app_name]
$ heroku pg:backups:url --app [app_name]
```

Next, visit your application on the Cloud 66 dashboard and click the _Import Heroku data_ link. Paste the URL provided by the CLI into the field, and click _Import Heroku data_.

 The *Import Heroku Data* button will disappear 2 weeks after you set up your app. If you need to access it, add `/heroku_import` to the end of your app's Dashboard URL. For example `https://app.cloud66.com/stacks/XXXXX/heroku_import`

#### MySQL

Start by dumping your existing database. If you're using a Heroku MySQL add-on (such as JawsDB or ClearDB), you can find your connection credentials in the add-on's dashboard or via `heroku config --app [app_name]`.

```bash
$ mysqldump -u [username] -p[password] [dbname] > backup.sql 
```

Once you have a MySQL dump file, use the [Cloud 66 toolbelt](../toolbelt/_upload.md) to upload the file to your application database server. Remember to replace the fields below with your values.

```bash
$ cx upload -s "[app_name]" --server [database_server_name] backup.sql /tmp/backup.sql
```

Next, use the toolbelt to SSH to your server.

```bash
$ cx ssh -s "[app_name]" [server_first_name]
```

Finally, use the command below to import your backup into the database. You can find the generated username, password and database name by visiting your application and clicking into your database server (e.g. _MySQL server_).

```bash
$ mysql -u [generated_user_name] -p [generated_password] "[database_name]" < /tmp/backupfile.sql 
```

### 3. Environment variables

Don't forget to migrate your environment variables. You can dump them from Heroku and use them as a reference when setting up your Cloud 66 application:

```bash
$ heroku config --app [app_name] --shell > heroku_env.txt
```

This gives you a file with all your config vars in `KEY=value` format. You can then add these to your Cloud 66 application via the [environment variables](../build-and-config/env-vars.md) page on the dashboard, or using the [Cloud 66 toolbelt](../toolbelt/using-cloud66-toolbelt.md).

Don't blindly copy all Heroku env vars. Variables like `DATABASE_URL`, `REDIS_URL`, and add-on-specific credentials will be different on Cloud 66. Focus on your application-specific config (API keys, secrets, feature flags) and let Cloud 66 manage the infrastructure variables.

### 4. Traffic

Once you're ready to serve traffic from your Cloud 66 application, you need to direct your traffic to it. For help doing this, see [Configure your DNS](../networking/configure-dns.md).

## Useful pointers

### Web server and Procfile

By default, Cloud 66 will deploy your application with Phusion Passenger, but you can also choose a custom Rack server like [Puma](https://help.cloud66.com/deploy/2/build-and-config/puma-rack-server), [Thin](https://help.cloud66.com/deploy/2/build-and-config/thin-rack-server) or [Unicorn](https://help.cloud66.com/deploy/2/build-and-config/unicorn-rack-server). You may have a `web` entry in your Procfile to do this on Heroku. Cloud 66 ignores this entry to avoid compatibility issues.

To run a custom web server, we require a `custom_web` entry. It is important to set this before analyzing your application, to avoid building the application with Passenger.

You can also use the [Procfile](../servers/systemd.md) to define other background jobs.

### Dyno recycling

Heroku restarts all dynos at 24 hours of uptime, which may conceal possible memory leaks in your application. When you migrate to Cloud 66, these will become noticeable because we don't restart your workers (other than during a deployment), so the leak can grow to be bigger. A temporary solution is to re-create the Heroku restart behavior, for example with this script:

```bash
for OUTPUT in $(pgrep -f sidekiq); do kill -TERM $OUTPUT; done
```

This will send a TERM signal to any Sidekiq workers, giving them 10 seconds (by default) to finish gracefully. Any workers that don't finish within this time period are forcefully terminated and their messages are sent back to Redis for future processing. You can customize this script to fit your needs, and add it to your application as a Server Job.

Note that this is a temporary solution, and we recommend that you use a server monitoring solution to identify the source of your leak.

### Asset Pipeline Compilation

If you haven't compiled assets locally, Heroku will attempt to run the assets:precompile task during slug compilation. Cloud 66 allows you to [specify whether or not to run this](../deployment/enable-disable-asset-pipeline.md) during deployment.

## What's next?

* Get started with [manifest files](../manifest/what-is-a-manifest-file.md) - a powerful tool for defining your application's components
* Learn about [CustomConfig](../custom-config/custom-config.md) - a tool for defining and managing configuration templates
* Learn how to use [Toolbelt](../toolbelt/using-cloud66-toolbelt.md) - a powerful command-line interface for managing your Cloud 66 applications.