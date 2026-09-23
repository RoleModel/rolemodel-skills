# Bring Your Own Images


## Overview

Bring Your Own Images (BYOI) allows you to spin up new servers for your applications that are based on custom server images rather than on a generic Ubuntu server. Because these custom server images can have all the libraries and components required by your application pre-installed (such as language and framework), they can dramatically reduce the time for a new server to be provisioned. 

## How BYOI works

Some cloud providers (see [our supported list](#cloud-providers-with-byoi-support) below), allow you to "snapshot" an image of a server running in your cloud account, and then use that image as a template to spin up new versions of the same server. 

You can set a Cloud 66 application to use one or more of these images whenever it creates new servers (for example when scaling up). Whenever you create a new server based on a custom image we will:

1. Spin up a new server as direct clone of the image
2. Scrub the new server of any application-specific code and config that were captured in the original  snapshot
3. Deploy your latest code and configuration to the server 
4. Add the server to your application

We do this to ensure that any outdated application code lingering in images doesn't cause issues when you use them as a base.

## How to specify a custom server image for an application

You can set an application component to use a custom image using your application's Manifest file. You should use the `cloud_image` setting under a component and reference the image using the unique identifier provided by your Cloud host. For example:

```bash
production:
  rails:
    configuration:
      ruby_version: 2.7.0
      asset_pipeline_precompile: true
      cloud_image: my-image-name
```

## Best practices when using custom images

While using custom images can save a lot of provisioning time and make your application more flexible and nimble, it can also introduce some additional admin and planning overhead in the longer term. 

If you plan to use images to scale your production environment or any mission-critical components of your application you should regularly review the images and your practices to ensure that the images you have are up-to-date with the base components of your live servers (such as language or framework). If you upgrade a component, you should take a fresh image containing that component.

## Cloud providers with BYOI support

We currently support BYOI for the following cloud providers:

- Amazon Web Services via [Amazon Machine Images](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs/) (AMI)
- Google Compute Engine ([Custom Images](https://cloud.google.com/compute/docs/images#custom_images))
- Digital Ocean ([Images](https://www.digitalocean.com/docs/images/))