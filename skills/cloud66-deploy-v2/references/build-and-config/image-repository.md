# Connecting to image registries


## Connecting to public registries

For public [Docker Hub](https://registry.hub.docker.com/) images, use the following URL format:

```shell
<namespace>/<image_name>:<tag>
```

If you are using [Quay.io](https://quay.io/) for your image registry, you will use the following URL format:

```shell
quay.io/<namespace>/<image_name>:<tag>
```

## Connecting to private registries

You can use private registries to pull Docker images into Cloud 66, but they must first be connected to your account. (If you are hosting an image in Google Container Registry or Google Artifact Registry, please see the [section below](#connecting-to-google-image-registries).)

1. Open your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click _External Services_ in the **Settings** panel
4. Click the _Image Registries_ tab 
5. Click on _ADD A PROVIDER_ or click on __+__ if you already have one and want to add a second one.
6. Fill in the details for your registry and click *Save*
 
Once your registry is connected, you can use the same URL format as above to pull images into Cloud 66. If you're using 

## Connecting to cloud image repositories

You can connect private image repositories hosted by AWS, Google Cloud and Azure to your account, which will allow you to use any hosted images in your applications.

In order to connect a cloud image repo to your account, you first need to add your cloud provider to Cloud 66 ([follow our guide if you need help](../build-and-config/adding-a-cloud-provider.md)), and then you need to grant Cloud 66's service account permissions to access image repos (see the next section).

### Granting Cloud 66 permissions to access your repo

In order to connect your private cloud repo to your Cloud 66 account, you need to grant specific permissions to the service account through which we access your cloud provider. Click on the tab for your cloud provider below to see the required permissions.

    
        AWS (Amazon ECR)
        Azure
        Google Cloud
    

The following role plus additional permission under Amazon ECR will give us the required level of access:

- `AmazonEC2ContainerRegistryReadOnly`
- `ecr:DescribeRegistry` (in addition to the role above)

The following roles will give us the required level of access:

- `Container Registry Repository Reader`
- `Container Registry Configuration Reader` and `Data Access Configuration Reader`
 

The following roles will give us the required level of access:
- `Artifact Registry Reader`
- `Service Account Token Creator`

## Connecting your private cloud repo

Once your cloud provider has been added, and your permissions are set, follow these steps to connect your repository to your Cloud 66 account:

1. Sign into your [Cloud 66 Dashboard](https://app.cloud66.com/)
2. Click on your avatar (top right) and select *Account Settings*
3. Click on *Settings* in the left-hand panel
4. Click on the *Image Registries* tab at the top of the main panel
5. Click *Add Registry* - a panel will open from the right
6. Under the *Select an Image Registry Provider* dropdown, choose your cloud provider
7. (Optional) If you have multiple accounts with a single provider, you can restrict which images can be accessed by adding a string that we will match against the names of all available images. These matches are inclusive, so partial matches will work (e.g. `nginx` will match `prod-nginx-image-2025-01-01-V5`)
8. Click **Save**

## Using cloud repos in your application

Once you've added a private cloud repo (as above) you will be able to use these images during the application setup process. During the "where is your image location" step, we will search your cloud repos for matching images based on your input.

You can also specify the image in your [service.yml](../build-and-config/docker-service-configuration.md) file using the `image` feature ([more info here](../build-and-config/building-your-service.md#image)). You should use the full URL for the image.

## Connecting to Google image registries

We support [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr) (GAR) but we recommend [the approach outlined above](#connecting-to-cloud-image-repositories) as a better alternative.

To connect a GAR account to your Cloud 66 account:

1. Create a service account in Google Cloud
2. Grant the service account `Artifact Registry Reader` permission
3. Open the service account from the Google console, go to the "keys" tab and create a key. This will download a JSON file to your local machine.
4. Generate your Docker password by running the following command against the JSON file you just downloaded: `cat JSON_FILE | base64`
5. Take note of your Docker username: `_json_key_base64`
6. Take note of your Docker URL. It will be in the format `https://LOCATION-docker.pkg.dev`
7. Use the above username / password / URL combination to add the registry credentials to your Cloud 66 account (see [section above](#connecting-to-private-registries))

Google Container Registry (GCR) has been deprecated and its authentication service is currently unreliable. If you would prefer to continue using GCR, you can follow [these instructions](https://cloud.google.com/container-registry/docs/pushing-and-pulling). At the time of writing the JSON authentication method was buggy and so we cannot recommend it.