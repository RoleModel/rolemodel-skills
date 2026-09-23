# Docker Configuration


## Docker

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`activeprotect`||The parent node for ActiveProtect settings (see `whitelist` and `http_ban_rate` below)|All|
|`activeprotect / whitelist`||A comma-separated whitelist of IPs that should be ignored by your ActiveProtect configuration. Must be nested under `activeprotect`.|All|
|`activeprotect / http_ban_rate`||Set the threshold of *requests per minute* from a single IP address. The default is `2000`. Must be nested under `activeprotect`.|All|
|`docker_version`||Specify the version of Docker you want to install.|All|
|`firewall / create_web_rules`||Cloud 66 automatically creates firewall rules to expose your web application to the outside world. You can configure this via your [Traffic settings](../networking/network-configuration.md#firewall), or disable it completely by setting this value to `false`. Default is `true`.|All|
|`iam_instance_profile_name`||The name of the [IAM instance profile](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) that should be used when provisioning this server. [Read our guide](../build-and-config/advanced-cloud-configurations.md#using-iam-instance-profiles-with-your-servers).|AWS|
|`image_keep_count`||Set the number of old images to save on your servers (besides the running image). Defaults to `2`.|All|
|`instance_service_account_name`||The name of the [GCE Service Account](../build-and-config/advanced-cloud-configurations.md#using-gce-service-accounts-with-cloud-66) that should be used when provisioning this server.|GCE|
|`nameservers`||Set DNS servers for your application.  Note that if you specify empty array i.e **[ ]**, it won't add any nameserver to your servers. Default is an empty array: `[ ]`|All|
|`network` / `mode`||Specifies whether your servers should communicate over `private` or `public` IP addresses. Defaults to `private` if your servers are *either* all cloud *or* all [Registered](../servers/registered-servers.md). If your application uses a *mix* of cloud and Registered servers, the default will be `public`.|All|
|`network` / `container_ip_range`||The internal ip range of the pods in your application. Default is `25.0.0.0/16`.|All|
|`operating_system`||The version of Ubuntu to install on the server that hosts your app. Accepted values: `ubuntu2604`, `ubuntu2404`, or `ubuntu2204` |All|
|`root_disk_size`||Default size of root disk (in GB) for servers used by application. Default value is 50.|AWS, Azure, GCE|
|`root_disk_type`||Disk type, accepted values being `ssd` and `magnetic`. Default is `ssd`.|AWS, GCE|
|`subnet_id`||**ID** or **name** of the AWS subnet in which you would like to create your servers. If not supplied, we will attempt to identify the single [map_public_ip_on_launch](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet#cfn-ec2-subnet-mappubliciponlaunch) set to true|AWS|
| `tags` |  | Append the listed tags to any servers created for this component. See our [tagging guide](../servers/tagging-components.md) for more info on tag syntax and support. | AWS, Azure, DigitalOcean, Hetzner |
|`vn_name`||The name of the Virtual Network in which you would like to create your servers.|Azure|
|`vpc_id`||**ID** or **name** of the VPC in which you would like to create your servers.|AWS, Azure, DigitalOcean, Hetzner|
|`weave_version` (Container Service V1 only)||Specify the version of Weave you want to install. Container Service V1 only.|All|

In order to use an AWS *vpc_id*, you must provide *subnet_id* for all servers used by your application.

### Example YAML for Docker

```yaml
docker:
  configuration:
    iam_instance_profile_name: docker-perms
    docker_version: 1.7.0
    weave_version: 1.0.3
    vpc_id: vpc-64872001
    root_disk_size: 100
    root_disk_type: ssd
    image_keep_count: 5
    nameservers: ['8.8.8.8', '8.8.4.4']
```

```yaml
docker:
  configuration:
    docker_version: 1.12.0
    weave_version: 1.0.3
    vn_name: your_vn_name
    root_disk_size: 100
    root_disk_type: ssd
    image_keep_count: 15
```

## Kubernetes control plane configuration

The settings below apply to **Cloud 66 Container Service V2** applications and [Clusters](../getting-started/getting-started-with-clusters.md) (Kubernetes). They are not available on Container Service V3.

You can tune specific parts of your Kubernetes control plane - the kubelet and the API server (`kube-apiserver`) - directly from your manifest. These settings only take effect on servers built (or nodes joined) *after* the manifest change; they are not retroactively applied to servers that are already running. If a setting is invalid, the whole block is dropped and a warning is logged during your next deploy - the rest of the deploy still proceeds.

On a standalone Kubernetes application, nest these settings under `docker`, as shown below. On a [Cloud 66 Cluster](../getting-started/getting-started-with-clusters.md), nest them under `cluster` instead.

### Kubelet configuration

Requires Kubernetes 1.30 or newer.

Cloud 66 lets you tune when, and how aggressively, the kubelet garbage-collects unused container images - useful if your root disk is at risk of filling up with pulled images. Configure it under `configuration / kubernetes / kubelet / config`:

|Option|Description|Default|
|--- |--- |--- |
|`imageGCHighThresholdPercent`|Disk usage percentage (`0`-`99`) at which image garbage collection is triggered.|`80`|
|`imageGCLowThresholdPercent`|Disk usage percentage (`0`-`99`) that image garbage collection attempts to free the disk down to.|`70`|

`imageGCLowThresholdPercent` must be at least 5 percentage points below `imageGCHighThresholdPercent`, whether you declare one of these fields or both - the kubelet refuses to start if the low threshold isn't comfortably below the high one.

```yaml
docker:
  configuration:
    kubernetes:
      kubelet:
        config:
          imageGCHighThresholdPercent: 70
          imageGCLowThresholdPercent: 55
```

No other kubelet settings are currently supported. This includes fields Cloud 66 already sets for you, such as `cgroupDriver` and `resolvConf` - these, and any other field, will be rejected.

### API server configuration (kube-apiserver)

Requires Kubernetes 1.32 or newer.

You can set a small number of `kube-apiserver` flags, most commonly to support external OIDC identity federation (for example, IAM Roles for Service Accounts on AWS), under `configuration / kubernetes / apiserver / extra_args`:

|Flag|Description|
|--- |--- |
|`service-account-issuer`|The OIDC issuer URL for service account tokens. Must be a valid `https` URL, with no username or password embedded in it. Accepts a single value or a list, so you can rotate an issuer without invalidating tokens already in circulation - list the new issuer first.|
|`service-account-jwks-uri`|The URL where the JSON Web Key Set used to verify service account tokens is published. Must be a valid `https` URL, with no username or password embedded in it.|
|`api-audiences`|The list of audiences your service account tokens are issued for. If set, it must include the first value of `service-account-issuer`.|

```yaml
docker:
  configuration:
    kubernetes:
      apiserver:
        extra_args:
          service-account-issuer: https://oidc.example.com/my-cluster
          service-account-jwks-uri: https://oidc.example.com/my-cluster/openid/v1/jwks
          api-audiences:
            - https://oidc.example.com/my-cluster
            - sts.amazonaws.com
```

No other `kube-apiserver` flags are currently supported.

## Customizing Nginx for containerized apps

Nginx uses the `docker` node in `manifest.yml`. See [Nginx configuration](../manifest/_nginx.md) for details.