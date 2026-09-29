# Nginx Configuration


## Nginx

Nginx is the default webserver & reverse proxy for applications managed by Cloud 66.

The following settings are available via the Manifest file:

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`cors`||Enable Cross Origin Resource Sharing|All|
|`nginx/precompiled_url`||A URL pointing to a file in `tar.gz` format that contains a custom version of Nginx that will be used with your application. This Nginx package **MUST** be compiled using our [Cloud 66 compiler](https://github.com/cloud66-oss/nginx-compiler). Please read the [docs on the Github page](https://github.com/cloud66-oss/nginx-compiler#readme) for more details.|All|
|`extra_build_arguments` (*deprecated*)||Extra build argument string that will be added to the `nginx build` command. If you require additional modules that themselves require specific source to be present, you should use a `BEFORE_NGINX` [deploy hook](../deploy-hooks/deploy-hooks.md#hook-points) to ensure that source is present. You can use the `cloud66/download` snippet to achieve this easily. The following build arguments are currently always added: `--with-http_realip_module --with-ipv6 --with-http_v2_module` regardless of this value.|All|
|`perfect_forward_secrecy` (*deprecated*)||Enable Perfect Forward Secrecy|All|

### Customizing Nginx for containerized apps

Nginx uses the `docker` node in `manifest.yml`. See below for examples.

### Example YAML for Nginx

```yaml
rails:
  configuration:
    nginx:
      extra_build_arguments: "--add-module=/path/to/module"
      perfect_forward_secrecy: true # deprecated
```

```yaml
docker:
  configuration:
    nginx:
      perfect_forward_secrecy: true # deprecated
```

## CORS configuration

If required, you can also specify the allowed origin (as '\*' or a single origin) and methods. You can also specify a comma-separated list of origins, headers, and whether to allow credentials for CORS.

```yaml
rails:
  configuration:
    nginx:
      cors:
        origin: '*'
        methods: 'GET, OPTIONS'
        headers: 'Custom-Header, Another-Header'
        credentials: true
```

```yaml
docker:
  configuration:
    nginx:
      cors:
        origin: '*'
        methods: 'GET, OPTIONS'
        headers: 'Custom-Header, Another-Header'
        credentials: true
```