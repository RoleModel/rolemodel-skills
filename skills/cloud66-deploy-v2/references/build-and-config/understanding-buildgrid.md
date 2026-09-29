# Accessing images in BuildGrid


## Overview

BuildGrid is Cloud 66’s integrated Docker image builder and repository. Every time you build your images for a Cloud 66 application, we store a copy of those images in BuildGrid. You can access these images using your Dashboard, or by logging into BuildGrid directly. 

## Finding BuildGrid URLs

Every successful build process in Cloud 66 adds an image to BuildGrid. To find the URL for the latest BuildGrid image for a service: 

1. Log into your Dashboard and open on your application
2. Click on *Application* in the left-hand navigation
3. In the **Services** panel, click on the name of the service in question
4. In the service info panel, click on *Show More*
5. The image URL is listed in the **Image** row.

### Finding image details via Build & Deployment Timeline

You can see details of older images from your builds using the Build & Deployment Timeline. To do this open your Application from your [Cloud 66 Dashboard](https://app.cloud66.com/) and scroll down your timeline until you find the build in question.

Each deployment event lists the code branch that was deployed, and the ID of the image that was created.

To see a log of the build process, click on the *Application Deployed* link for that build. Within the log you'll find all the details of the image (under the **Application Image(s)** node).

## Accessing your BuildGrid repository directly

You can access your repository directly using any Docker-compatible client, but you will need the BuildGrid username and password for your application. To find these details:

1. Log into your Dashboard and open on your application
2. Click on *Application* in the left-hand navigation
3. In the **Services** panel, click on the name of any service
4. In the service info panel, click on *Show More*
5. The details are in the **Login to Registry** row

You can then use, for example, the standard Docker terminal client to:

1. Log into BuildGrid by running `docker login <subdomain>.buildgrid.net` and then supplying your username and password when prompted
2. Pull any image from your repo using `docker pull <full image URL>`

You cannot push images to BuildGrid - it is designed to be read-only. To update an image in BuildGrid you should update your code via Cloud 66 and a new version of the image will be built and stored accordingly. 

## Running an image locally

Once you have pulled an image to your local machine, you can run it locally. In order to do so you will need:

- A [Docker client](https://www.docker.com/products/docker-desktop) (including the CLI)
- A Kubernetes client (such as [minikube](https://kubernetes.io/docs/tasks/tools#minikube))
- The [kubectl](https://kubernetes.io/docs/tasks/tools#kubectl) CLI
- A working knowledge of basic Docker and Kubernetes CLI commands

You can then either run the image directly from Docker using the `docker run` command ([more help here](https://docs.docker.com/get-started/part2#run-your-image-as-a-container)) or you can configure a local Kubernetes instance (see [this guide](https://kubernetes.io/docs/tutorials/hello-minikube/) for more info).