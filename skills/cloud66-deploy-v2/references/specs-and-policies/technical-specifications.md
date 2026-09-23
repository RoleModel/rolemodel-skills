# Cloud 66 Technical specifications


## Operating system

Your servers are deployed with Ubuntu 26.04 LTS, Ubuntu 24.04 LTS, or Ubuntu 22.04 LTS.

### How we choose your server's operating system

Unless you pin a version in your [Manifest file](../manifest/_server-definitions.md#specifying-an-operating-system-version), we choose the operating system for each new server as follows:

1. **New applications** are provisioned with the latest LTS release we support.
2. **Existing applications** keep the release already running on their servers of that type. We will not introduce a newer release into a running application on your behalf, so that servers which are meant to be identical stay identical.
3. **Some components stay on an older release** where the newer one has no upstream packages yet. MongoDB is the current example — MongoDB servers are provisioned with Ubuntu 24.04.

This means that scaling up a server on an established application will match its existing servers rather than jumping to the newest release. To move an existing application forward, either set `operating_system` in your Manifest file or follow our guide to [upgrading servers running older versions of Ubuntu](../servers/out-of-ubuntu-lts.md).

## Supported cloud providers

Cloud 66 currently supports the following cloud providers:

* [Amazon Web Services](../build-and-config/adding-a-cloud-provider.md#aws-amazon-web-services)
* [Digital Ocean](../build-and-config/adding-a-cloud-provider.md#digital-ocean)
* [Google Compute Engine](../build-and-config/adding-a-cloud-provider.md#google-cloud-gce)
* [Hetzner Cloud](../build-and-config/adding-a-cloud-provider.md#hetzner-cloud)
* [Latitude.sh](../build-and-config/adding-a-cloud-provider.md#latitude-sh)
* [Linode](../build-and-config/adding-a-cloud-provider.md#linode)
* [OVHcloud](../build-and-config/adding-a-cloud-provider.md#ovh)
* [Microsoft Azure](../build-and-config/adding-a-cloud-provider.md#azure)
* [Vultr](../build-and-config/adding-a-cloud-provider.md#vultr)

## Supported platforms

Broadly, we support four types of applications:  

1. Ruby applications running on Rails (or variants like Sinatra)
2. Applications (of any kind) running in Docker containers on Kubernetes clusters
3. Prebuilt or "static" websites built in Jekyll, Hugo or Gatsby

The first option is best suited to traditional "monolithic" application types where all of the components run on a common framework. 

The second platform is best suited to containerized applications with a strong service orientation. Since Docker effectively supports virtually every programming language and framework, it is possible to use it to host any type of application. We support end-to-end Docker deployments. You can either let us build your Docker image (with a Dockerfile), or provide your own.

The third platform is specifically designed to build and host [Jamstack](https://jamstack.org/what-is-jamstack/)-style preprocessed application on object storage services.

## Component versions

Cloud 66 servers have two types of components with differing policies on versioning.

### 1. Components built via apt-packages

We default the latest stable major version available from the maintainers of that package.

### 2. Components built from source

Cloud 66 maintains an internal list of versions for most components built from source, which is updated periodically after testing.

You are free to **specify an alternative version** for most of these components in your [manifest file](../manifest/what-is-a-manifest-file.md).

We deploy a custom release of Nginx. [See below](#nginx-release) for details.

We **don't** install a default version of Rails - the version installed is based on the requirements of your application. Versions earlier than 2.6.3 *may* work but have some compatibility issues with recent versions of Ubuntu.

If you're using different (non-default) versions of components, we strongly recommend testing your application thoroughly in a non-production environment before deploying. 

### Nginx release

Cloud 66 maintains our own self-contained release of Nginx which includes all of the modules listed below. 

The current NGINX version used by our custom release is .

For more info please read the [Releases page on our Github project](https://github.com/cloud66-oss/nginx-compiler/releases). 

### Nginx modules

We install the Nginx modules listed below by default. These are used to provide additional features and functions to applications managed by Cloud 66. You can see the latest versions of all of these modules on the [Releases page](https://github.com/cloud66-oss/nginx-compiler/releases) of our Nginx project on Github.

|Module|Description|
|--- |--- |
|[Cache Purge](https://github.com/FRiCKLE/ngx_cache_purge)|Adds ability to purge content from FastCGI, proxy, and uWSGI caches|
|[Devel kit](https://github.com/vision5/ngx_devel_kit)|Nginx Development Kit (NDK)|
|[Echo](https://github.com/openresty/echo-nginx-module)|ngx_echo - Brings "echo", "sleep", "time", "exec" and more shell-style goodies to Nginx config file|
|[Fancy Index](https://github.com/aperezdc/ngx-fancyindex)|Like the built-in autoindex module, but fancier|
|[Headers More](https://github.com/openresty/headers-more-nginx-module)|Set and clear input and output headers more than just "add!"|
|[GeoIp2](https://github.com/leev/ngx_http_geoip2_module)|ngx_http_geoip2_module - creates variables with values from the maxmind geoip2 databases based on the client IP (default) or from a specific variable (supports both IPv4 and IPv6)|
|[HTTP Substitutions](https://github.com/yaoweibin/ngx_http_substitutions_filter_module)|nginx_substitutions_filter is a filter module which can do both regular expression and fixed string substitutions on response bodies|
|[Lua](https://github.com/openresty/lua-nginx-module)|Embed the power of Lua into Nginx HTTP Servers|
|[ModSecurity](https://github.com/spiderlabs/modsecurity/)|Web application firewall|
|[mruby](https://github.com/matsumotory/ngx_mruby)|Embedded mruby script language for nginx-module|
|[Nchan](https://github.com/slact/nchan)|Pubsub server for Websockets, Long-Poll, EventSource etc.|
|[PAM Authentication](https://github.com/sto/ngx_http_auth_pam_module)|HTTP Basic Authentication using PAM|
|[RTMP](https://github.com/arut/nginx-rtmp-module)|RTMP protocol support. Live streaming and video on demand|
|[Upload Progress](https://github.com/masterzen/nginx-upload-progress-module)|nginx_upload_progress_module is an implementation of an upload progress system, that monitors RFC1867 POST upload as they are transmitted to upstream servers|
|[Upstream Fair Balancer](https://github.com/gnosek/nginx-upstream-fair)|Distributes incoming requests to least-busy servers|
|[WebDAV](https://github.com/arut/nginx-dav-ext-module)|nginx WebDAV PROPFIND, OPTIONS, LOCK, UNLOCK support|

### Suggest version changes

Would you like to suggest a version change? Email us at support@cloud66.com