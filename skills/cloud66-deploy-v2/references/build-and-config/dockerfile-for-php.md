# Writing a custom Dockerfile for PHP


## Overview

If we detect that your application uses PHP we will suggest a default [Dockerfile](../build-and-config/writing-a-dockerfile.md) for you to use (see below). This file should work for most PHP applications, but if your app has some special cases you may need to modify it or write your own from scratch. This doc will walk you through the basics of doing so.

Before following this guide, we recommend getting acquainted with [the basics of the Docker platform](https://docs.docker.com/get-started/overview/). Because you're using Cloud 66, most of the Docker tasks and processes described will be completely automated, but it is useful to understand why a Dockerfile is necessary and what it does.

## Adding a Dockerfile to your repo

A `Dockerfile` is essentially a plaintext file with no file extension that you add to the root of your repository. If for some reason you can’t have it in the root, you can specify this in your Cloud 66 [service config](../build-and-config/writing-a-dockerfile.md#putting-a-dockerfile-in-a-sub-directory).

## Default PHP Dockerfile

This is the Dockerfile we will suggest for PHP apps that do not already have one:

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

The file is obviously customisable as needed. For example, you can choose to install an alternative database driver in the `apt-get install` block.

## Writing your own Dockerfile

We generally recommend against writing your own Dockerfile from scratch, but the basics are not difficult to master. Before starting you should have a firm understanding of basic [Docker commands](https://docs.docker.com/engine/reference/builder/) (`RUN`, `ENV`, `ADD`, `WORKDIR` etc).

The order of the commands is extremely important. If you try to run a component before one of its dependencies, the build will fail.

The simplest possible Dockerfile for a PHP application looks something like this:

```docker
# Tells the image to use the latest version of PHP
FROM php:latest-apache  

# Creates a directory called "app"
RUN mkdir /app  

# Sets that directory as your working directory
WORKDIR /app  

# Changes uid and gid of apache to docker user uid/gid
RUN usermod -u 1000 www-data && groupmod -g 1000 www-data

# Sets Apache to run via the app directory
RUN sed -i -e "s/var\/www/app/g" /etc/apache2/apache2.conf && sed -i -e "s/html/public/g" /etc/apache2/apache2.conf

# Copies your code to the image
COPY . /app  

# Sets permissions for the web user
RUN chown -R www-data:www-data
```

This image is obviously missing a lot components that you might need - it has no database drivers for example - but you can add these as needed. 

You'll notice that we do not set up any virtual hosts - this is because traffic to Cloud 66 apps is handled by Nginx. Apache is only required to serve traffic to the [internal container (service) network](../networking/service-networking.md).

## Where is the CMD command?

Cloud 66 uses the command that you define in your [`service.yml`](../build-and-config/docker-service-configuration.md) to run the application (overriding whatever is in the Dockerfile). Although you can omit this, and rely on the implicit command in the Dockerfile, we strongly recommended [defining commands](../build-and-config/building-your-service.md#build-command) via your `service.yml`.