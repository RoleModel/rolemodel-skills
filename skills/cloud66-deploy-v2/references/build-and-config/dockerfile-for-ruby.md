# Writing a custom Dockerfile for Rails


## Overview

If we detect that your application uses Rails we will suggest a default [Dockerfile](../build-and-config/writing-a-dockerfile.md) for you to use (see below). This file should work for most Rails (or Rack) applications, but if your app has some unusual requirements you may need to modify it or write your own from scratch. This doc will walk you through the basics of doing so.

Before following this guide, we recommend getting acquainted with [the basics of the Docker platform](https://docs.docker.com/get-started/overview/). Because you're using Cloud 66, most of the Docker tasks and processes described will be completely automated, but it is useful to understand why a Dockerfile is necessary and what it does.

## Adding a Dockerfile to your repo

A `Dockerfile` is essentially a plaintext file with no file extension that you add to the root of your repository. If for some reason you can’t have it in the root, you can specify this in your Cloud 66 [service config](../build-and-config/writing-a-dockerfile.md#putting-a-dockerfile-in-a-sub-directory).

## Default Rails Dockerfile

This is the Dockerfile we will suggest for Rails apps that do not already have one:

```docker
FROM ruby:latest
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y build-essential nodejs yarn 
ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
# This installs bundler 2x. Change if you need any of the older versions
RUN gem install bundler:2.1.2
ADD Gemfile* $APP_HOME/
# This is a bundler 2 format. For bundler 1, you can add --without development test to the bundle install line
RUN bundle config set without 'development test'
RUN bundle install
ADD . $APP_HOME
# if you're not using webpack, you can comment out the following line
RUN yarn install --check-files
RUN SECRET_KEY_BASE=$SECRET_KEY_BASE RAILS_ENV=production bundle exec rake assets:precompile
```

A few notable things that this Dockerfile does:

- It creates a home directory in the image for your app and sets it as an environment variable (`$APP_HOME`)
- It installs Yarn
- It installs Bundler

The file is obviously customisable as needed. For example, you can change the version of Bundler by updating the `RUN gem install bundler:2.1.2` line. 

## Writing your own Dockerfile

We generally recommend against writing your own Dockerfile from scratch, but the basics are not difficult to master. Before starting you should have a firm understanding of basic [Docker commands](https://docs.docker.com/engine/reference/builder/) (`RUN`, `ENV`, `ADD`, `WORKDIR`).

The order of the commands is extremely important. If you try to run a component before one of its dependencies, the build will fail.

The simplest possible Dockerfile for a Rails application looks something like this:

```docker
FROM ruby:latest  # Tells the image to use the latest version of Ruby
RUN mkdir /app  # Creates a directory called "app"
WORKDIR /app  # Sets that directory as your working directory
RUN bundle install  # Installs all your Bundler dependencies inside the image
ADD . /app  # Copies your code to the image
```

This image is obviously missing components that you might need (for example Yarn and Webpack), but you can add these as needed. 

## Where is the CMD command?

Cloud 66 uses the command that you define in your [`service.yml`](../build-and-config/docker-service-configuration.md) to run the application (overriding whatever is in the Dockerfile). Although you can omit this, and rely on the implicit command in the Dockerfile, we strongly recommended [defining commands](/deploy/build-and-config/building-your-service#build-command) via your `service.yml`.