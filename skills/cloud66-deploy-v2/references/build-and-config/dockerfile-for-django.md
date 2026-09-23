# Writing a custom Dockerfile for Django


## Overview 

If we detect that your application uses Django we will suggest a default [Dockerfile](../build-and-config/writing-a-dockerfile.md) for you to use (see below). This file should work for most Django applications, but if your app has some unusual requirements you may need to modify it or write your own from scratch. This doc will walk you through the basics of doing so.

Before following this guide, we recommend getting acquainted with [the basics of the Docker platform](https://docs.docker.com/get-started/overview/). Because you’re using Cloud 66, most of the Docker tasks and processes described will be completely automated, but it is useful to understand why a Dockerfile is necessary and what it does.

## Adding a Dockerfile to your repo

A `Dockerfile` is essentially a plaintext file with no file extension that you add to the root of your repository. If for some reason you can’t have it in the root, you can specify this in your Cloud 66 [service config](../build-and-config/writing-a-dockerfile.md#putting-a-dockerfile-in-a-sub-directory).

## Writing a custom Dockerfile for Django

This is a typical example of the kind of Dockerfile we will suggest for Django apps that do not already have one. We will only use `latest` if we cannot detect the version of Python required by your application. 

```docker
FROM python:latest

WORKDIR /app

RUN apt-get update -qq && \
    apt-get install -y git python3-pip build-essential

COPY . /app
RUN python3 -m pip install -r requirements.txt
```

A few notable things that this Dockerfile does:

- It fetches the latest Python image from Docker
- It creates a working directory called `/app`
- It updates all the Ubuntu packages and installs the Python package manager, Pip
- It runs the Pip install command using the `requirements.txt` as its list of packages

The file is obviously customisable as needed. For example, you could install a specific version of Python by changing the `FROM` directive to something like `python:3.6-slim`

You might notice that this Dockerfile doesn’t have any `EXPOSE` or `CMD` directives - this is because Cloud 66s handles port allocation and container initialisation.

## Writing your own Dockerfile 

We generally recommend against writing your own Dockerfile from scratch, but the basics are not difficult to master. Before starting you should have a firm understanding of basic [Docker commands](https://docs.docker.com/engine/reference/builder/) (`RUN`, `ENV`, `ADD`, `WORKDIR`).

The order of the commands is extremely important. If you try to run a component before one of its dependencies, the build will fail.

The simplest possible Dockerfile for a Django application looks something like this:

```docker
FROM python:latest # Tells the image to use the latest version of Python
RUN mkdir /app # Creates a directory called "app" 
WORKDIR /app # Sets the working directory to "app"
COPY requirements.txt /app # Copies the dependencies list to "app"
RUN pip install -r requirements.txt # installs all the dependencies
COPY . /app/ # Copies your code to the image
```

This image is obviously missing components that you might need, but you can add these as needed.

## Where is the CMD command?

Cloud 66 uses the command that you define in your [`service.yml`](../build-and-config/docker-service-configuration.md) to run the application (overriding whatever is in the Dockerfile). Although you can omit this, and rely on the implicit command in the Dockerfile, we strongly recommended [defining commands](../build-and-config/building-your-service.md#build-command) via your `service.yml`.