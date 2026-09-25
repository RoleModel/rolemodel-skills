# Writing a custom Dockerfile for NodeJS


## Overview

If we detect that your application uses NodeJS we will suggest a default [Dockerfile](../build-and-config/writing-a-dockerfile.md) for you to use (see below). This file should work for most NodeJS applications, but if your app has some special cases you may need to modify it or write your own from scratch. This doc will walk you through the basics of doing so.

Before following this guide, we recommend getting acquainted with [the basics of the Docker platform](https://docs.docker.com/get-started/overview/). Because you're using Cloud 66, most of the Docker tasks and processes described will be completely automated, but it is useful to understand why a Dockerfile is necessary and what it does.

## Adding a Dockerfile to your repo

A `Dockerfile` is essentially a plaintext file with no file extension that you add to the root of your repository. If for some reason you can’t have it in the root, you can specify this in your Cloud 66 [service config](../build-and-config/writing-a-dockerfile.md#putting-a-dockerfile-in-a-sub-directory).

## Default NodeJS Dockerfile

This is the Dockerfile we will suggest for NodeJS apps that do not already have one:

```docker
FROM node:latest
ENV APP_HOME /app
RUN mkdir -pv $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME
ENV NODE_ENV production
ENV NPM_CONFIG_LOGLEVEL warn
# ADD CUSTOM REGISTRY HERE IF REQUIRED
# ENV CUSTOM_REGISTRY https://registry.npmjs.org/ 
# RUN npm config set strict-ssl false
# RUN npm config set registry $CUSTOM_REGISTRY
RUN npm install
```

A few notable things that this Dockerfile does:

- It creates a home directory in the image for your app and sets it as an environment variable (`$APP_HOME`)
- It sets the environment to `production`
- It sets the log level to `warn`

The file is obviously customisable as needed. For example, you can add a custom registry using the `ENV CUSTOM_REGISTRY` instruction (currently commented out).

## Writing your own Dockerfile

We generally recommend against writing your own Dockerfile from scratch, but the basics are not difficult to master. Before starting you should have a firm understanding of basic [Docker commands](https://docs.docker.com/engine/reference/builder/) (`RUN`, `ENV`, `ADD`, `WORKDIR`).

The order of the commands is extremely important. If you try to run a component before one of its dependencies, the build will fail.

The simplest possible Dockerfile for a NodeJS application looks something like this:

```docker
FROM node:latest  # Tells the image to use the latest version of Node
RUN mkdir /app  # Creates a directory called "app"
WORKDIR /app  # Sets that directory as your working directory
ADD . /app  # Copies your code to the image
RUN npm install --production # Installs all your packages
```

This image is probably missing components that your application relies on, but you can add these as needed using the same set of instructions.

## Where is the CMD command?

Cloud 66 uses the command that you define in your [`service.yml`](../build-and-config/docker-service-configuration.md) to run the application (overriding whatever is in the Dockerfile). Although you can omit this, and rely on the implicit command in the Dockerfile, we strongly recommended [defining commands](../build-and-config/building-your-service.md#build-command) via your `service.yml`.