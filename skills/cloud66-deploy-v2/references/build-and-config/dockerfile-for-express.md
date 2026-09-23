# Writing a custom Dockerfile for Express


## Overview 

If we detect that your application uses Express.js we will suggest a default [Dockerfile](../build-and-config/writing-a-dockerfile.md) for you to use (see below). This file should work for most Express applications, but if your app has some unusual requirements you may need to modify it or write your own from scratch. This doc will walk you through the basics of doing so.

Before following this guide, we recommend getting acquainted with [the basics of the Docker platform](https://docs.docker.com/get-started/overview/). Because you’re using Cloud 66, most of the Docker tasks and processes described will be completely automated, but it is useful to understand why a Dockerfile is necessary and what it does.

## Adding a Dockerfile to your repo

A `Dockerfile` is essentially a plaintext file with no file extension that you add to the root of your repository. If for some reason you can’t have it in the root, you can specify this in your Cloud 66 [service config](../build-and-config/writing-a-dockerfile.md#putting-a-dockerfile-in-a-sub-directory).

## Writing a custom Dockerfile for Express

This is a typical example of the kind of Dockerfile we will suggest for Express apps that do not already have one. We will only use `latest` if we cannot detect the version of Node required by your application. 

```docker
FROM node:16
WORKDIR /app
RUN apt-get update -y \
&& apt-get upgrade -y \
&& apt-get install curl zip -y \
&& rm -rf /var/lib/apt
COPY . /app
RUN yarn install
```

A few notable things that this Dockerfile does:

- It fetches the latest Node image from DockerHub
- It creates a working directory called `/app`
- It updates all the Ubuntu packages and installs the `curl` and `zip` tools
- It copies your code into the `/app` directory and then runs the `yarn install` command.

The file is obviously customisable as needed. For example, you could install a specific version of Node by changing the `FROM` directive to something like `node:12.18.1`

You might notice that this Dockerfile doesn’t have any `EXPOSE` or `CMD` directives - this is because Cloud 66 handles port allocation and container initialisation.

## Writing your own Dockerfile

We generally recommend against writing your own Dockerfile from scratch, but the basics are not difficult to master. Before starting you should have a firm understanding of basic [Docker commands](https://docs.docker.com/engine/reference/builder/) (`RUN`, `ENV`, `ADD`, `WORKDIR`).

The order of the commands is extremely important. If you try to run a component before one of its dependencies, the build will fail.

## Where is the CMD command?

Cloud 66 uses the command that you define in your [`service.yml`](../build-and-config/docker-service-configuration.md) to run the application (overriding whatever is in the Dockerfile). Although you can omit this, and rely on the implicit command in the Dockerfile, we strongly recommended [defining commands](../build-and-config/building-your-service.md#build-command) via your `service.yml`.