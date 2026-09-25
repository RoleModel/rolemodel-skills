# Deploy your Express app


This guide walks you through deploying an Express.js application to your cloud using Cloud 66, from start to finish, including all the components a modern Express application is likely to use. This guide will show you how to:

- Deploy your first Express app in just minutes
- Explore features that support your application
- Quickly and easily configure common components
- Advanced configurations

### Dashboard vs Toolbelt

Throughout this guide we will (wherever possible) offer you two methods for managing your application:

- The web [Dashboard](https://app.cloud66.com/dashboard)
- Toolbelt - our [command line tool](../toolbelt/using-cloud66-toolbelt.md)

If you’re planning to use Toolbelt (we recommend it!), you will need to [install it via your terminal](../toolbelt/using-cloud66-toolbelt.md#install-toolbelt). 

## Get going

We’ve made deploying an app as quick and easy as possible, so you should have your Express app deployed in just a few minutes. Just follow the steps below. We have a separate, standalone [getting started guide](../getting-started/deploy-your-first-app.md) which has more detail if you need it.

This guide assumes:

- You’ve created a Cloud 66 account (we have a free tier)
- You have an Express app ready to go in any Git repo (but Github works best) - we have a [fully functional sample app](https://github.com/alistairfairweather/maestro-sample) if you’d like to use that to try us out.
- An account with your favorite cloud provider

You can have your application set up in 4 simple steps.

1. **Connect your Git(hub) repo**. We ask for read-only access our integration makes connecting quick and easy.
2. **We’ll analyze your app.** We’ll scan your app and suggest an optimal configuration. You can adjust as needed
3. **Add a cloud provider.** Connect us to your preferred cloud provider.
4. **Deploy your app!**

### Writing a Dockerfile for your application

Dockerfiles can look intimidating at first, but a basic Dockerfile like the example below will accommodate most applications. 

```docker
# Most Express apps use Node as their base
FROM node:20

# Set your Node environment
ARG NODE_ENV="$NODE_ENV"

# Set /app as the working directory within the container
WORKDIR /app

# Add useful packages to the container
RUN apt-get update -y \
&& apt-get upgrade -y \
&& apt-get install curl zip libvips-dev libvips-tools -y \
&& rm -rf /var/lib/apt

# Copy your package.json to the container
COPY package.json package-lock.json*

# Install your app dependencies
RUN npm ci

# Copy your application code to the container
COPY . .

# Build your code
RUN npm run build
```

### Where is the “command” instruction?

Cloud 66 uses the command that you define during your initial app setup via our web interface. By default this command overrides whatever is in the Dockerfile. Although you can omit this, and rely on the implicit command in the Dockerfile, we strongly recommended defining commands via our interface.

## Adding databases

Cloud 66 caters for a wide range of database options, including:

- Managed by Cloud 66
- Bring your own DB (including managed services like RDS)
- Hybrid

Our managed databases are convenient, feature-rich and very cost effective, and allow you to centralize your infrastructure management in one system. If you’d prefer an externally managed DB, we make it easy to integrate them into your app. They do tend to be more expensive, and having your DB on a completely different subnet and/or data centre can add some latency and friction to your configuration. 

You can deploy a new database (or cluster of databases) for your application with a few clicks during initial setup (or, later on, in your Dashboard). We natively support:

- MySQL
- PostgreSQL
- MongoDB
- Redis
- InfluxDB
- ElasticSearch

Databases can be deployed as standalone instances, in clusters, or hosted on the same server as the application. When we provision a new database we will automatically generate credentials and make them available to your application as environment variables.

All databases managed by Cloud 66 have access to these features:

- One-click replication setup
- Managed database backups (with automated restore)
- Multiple logical databases per database server

## Connecting to a database

In an Express application, setting up a database connection typically involves the following steps:

1. **Install Database-Specific Modules**: First, you need to install a module/package that's appropriate for your database. For example:
    - For MongoDB: `mongoose` or `mongodb`
    - For MySQL: `mysql2` or `sequelize` (if you want an ORM)
    - For PostgreSQL: `pg` or `sequelize` (if you want an ORM)
    
    Use npm to install the desired package:
    
    ```bash
    npm install mongoose
    ```
    
2. **Create a Database Configuration File**: It's a common practice to create a separate file (e.g., `database.js`) to handle the database connection. This helps keep your code organized and makes it easier to manage different configurations for development, testing, and production environments.
3. **Establish a Connection**:
Here's an example using Mongoose (for MongoDB). Note the code uses the `MONGO_ADDRESS` environment variable, which we automatically create when we spin up your Mongo instance, rather than a hardcoded address.
    
    ```jsx
    // database.js
    
    const mongoose = require('mongoose');
    
    const connectDB = async () => {
        try {
            await mongoose.connect('process.env.MONGO_ADDRESS', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('MongoDB connected...');
        } catch (err) {
            console.error(err.message);
            // Exit process with failure
            process.exit(1);
        }
    }
    
    module.exports = connectDB;
    
    ```
    
4. **Integrate with Express**: In your main server file (often `app.js` or `server.js`), you can then require and call this connection function:
    
    ```jsx
    const express = require('express');
    const connectDB = require('./config/database');
    
    const app = express();
    
    // Connect to database
    connectDB();
    
    // ... rest of your server setup ...
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    
    ```
    
    Note that with Cloud 66 you’re not restricted to using certain ports - you can use whatever port you choose for your components. 
    
5. **Environment Variables**: For security and flexibility, it's good practice not to hardcode database credentials or connection strings. Instead, use environment variables (see the next section).

## Adding environment variables

Cloud 66 analyses your application code (for example your `package.json`), and supporting components (like database requirements) during deployment and creates a set of environment variables to suit your requirements. You can add your own, and update the existing ones as needed. 

You can do this during initial app setup by clicking the Add Environment Variables button during after your app has been analyzed. If you need to change env vars to an existing app, you can use your preferred method below:

    
        Dashboard
        Command line
    

1. Open the application from your **[Dashboard](https://app.cloud66.com/dashboard)**
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on *Environment Variables* in the sub-nav
4. Scroll down to the **Your Custom Variables** section
5. Add the key(s) and value(s) you need (or edit existing values)
6. Click *Save Changes*
7. Changes to env vars are only applied to your application server(s) when you deploy. Do that now by clicking the *Deploy* button

You can set an env var as follows: 

```bash
$ cx env-vars set -s mystack FIRST_VAR=123
```

This will either create or update the variable.

You can fetch a list of env vars using `cx` including the history of recent changes to that variable. For example:

```bash
$ cx env-vars list -s my-app NODE_ENV ANOTHER_VARIABLE --history
```

You can also upload sets of env vars in file format (`dotenv` or `json`). For example:

```bash
$ cx env-vars upload -s my_other_app --file new_env_vars_json --file-type json
```

For more commands, see our [Toolbelt guide](../toolbelt/_env-vars-list.md).

### We automatically set your NODE_ENV to 'production'

We remove stack traces in error pages by setting the `NODE_ENV` environment variable to *production*. In addition to generating less-verbose error messages, setting the variable to *production* caches view templates and CSS files generated from CSS extensions. 

## Serving static files with Express

To serve static files such as images, CSS files, and JavaScript files, use the `express.static` built-in middleware function in Express.

The function signature is:

```jsx
express.static(root, [options])
```

The `root` argument specifies the root directory from which to serve static assets. 

For example, use the following code to serve images, CSS files, and JavaScript files in a directory named `public`:

```jsx
app.use(express.static('public'))
```

Now, you can load the files that are in the `public` directory:

```
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/images/bg.png
http://localhost:3000/hello.html
```

To use multiple static assets directories, call the `express.static` middleware function multiple times:

```jsx
app.use(express.static('public'))
app.use(express.static('files'))

```

Express looks up the files in the order in which you set the static directories with the `express.static` middleware function.

To create a virtual path prefix (where the path does not actually exist in the file system) for files that are served by the `express.static` function, [specify a mount path](https://expressjs.com/en/4x/api.html#app.use) for the static directory, as shown below:

```jsx
app.use('/static', express.static('public'))
```

Now, you can load the files that are in the `public` directory from the `/static` path prefix.

```
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/images/bg.png
http://localhost:3000/static/hello.html
```

However, the path that you provide to the `express.static` function is relative to the directory from where you launch your `node` process. If you run the express app from another directory, it’s safer to use the absolute path of the directory that you want to serve:

```jsx
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))
```

## Configure WebSockets

Cloud 66 automatically provisions your servers for use with WebSockets. We open ports **8080** and **8443** (for TLS) by default on your servers to allow you to use WebSocket. To work with optimally Cloud 66, your WebSocket servers need to listen to these ports.  If you’d like a quick guide to using WebSockets with Node-based applications, [this one is excellent](https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4).

## Run Gulp, Grunt or generic jobs

To run tasks or jobs on your application, you have several options. For shell and application commands, you can set up Application Jobs via the dashboard, or you can SSH to your server or container and run commands directly.

    
        Dashboard
        Command line
    

1. Open your Dashboard & click on your app
2. Click Jobs in the left nav
3. Click New Application Job or New Server Job (depending on your needs)
4. Choose the service (or server) and set up the job 
5. Set up a schedule or choose to run it on demand

First SSH to your app server using Toolbelt:

```bash
$ cx ssh -s <application name> <server name>
```

Then run your task in the app directory:

```bash
$ cd $STACK_PATH
$ gulp your-task-name
```

## Persistent storage

Node-based applications run inside containers on Cloud 66, which means they are mortal and ephemeral (in other words they can disappear and be replaced by new copies). To store files persistently, you can mount volumes from your container to the host server(s). 

You can mount folders with a single line in your `service.yml` file (*What is service.yml?*) with the following form: **`HOST_FOLDER:CONTAINER_FOLDER`**.

For example:

```yaml
services:
  my-web-app:
    volumes: ["/tmp/host/foo:/tmp/container/foo"]
```

### Persistent storage for single-server apps

If your application doesn’t require multiple servers, you can use the following method. When Cloud 66 deploys your app, we automatically create folders that persist between deployments. If you need to persist files for a single server you can simply store them under `$STACK_BASE/shared` (you can add sub-directories as needed). 

If your Express app requires that users with different roles have access to a shared file system, then the best directory to use is **`$STACK_BASE/shared/frontend-backend-share`**. This directory is preconfigured to allow secure access from both front and backend Linux users. This also allows application users to, for example, upload files via your app.

### Persistent storage for multi-server apps

If your application runs across multiple application servers and requires persistent storage, one option is to use an object storage service like [Amazon S3](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html) or Google Cloud Storage. All of the major cloud storage services have Node SDKs that make integrating them into your code quite simple. This isn’t a perfect replacement for a disk mounted at server level, but it is a viable solution for a wide variety of use cases.

## Allowing users to write to disk 

When Cloud 66 configures your servers, we create two Linux users:

- **`nginx`** which handles the front-end
- **`cloud66-user`** which handles the backend

In order to bridge the (intentional) gap between these users, we place them both in the same Linux group called **`app_writers`** - this allows for use cases where a feature needs access to both frontend and backend processes

In order to make a directory writable:

- Set the directory owner group to **`app_writers`**
- Set file permissions **`0660`**
- Set directory permissions to **`0770`**
- The process writing to the directory should run as the **`nginx`** user

## Configuring other components

Modern Express applications rely on a range of components to perform at scale. **Cloud 66 supports every Express and Node component your application needs**, either natively or via our powerful [Deploy Hooks](../deploy-hooks/deploy-hooks.md) feature. If it can run on Ubuntu, we support it. 

This guide covers the most common components, but we support many, many more. If you’re not sure, feel free to ask our support team.