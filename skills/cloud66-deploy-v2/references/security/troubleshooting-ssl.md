# Troubleshooting SSL certificates


## Overview 

If you run into difficulties configuring SSL certificates with Cloud 66, this guide may be able to help. 

## Non-secure HTTP endpoint required

Let's Encrypt needs a non-secure HTTP endpoint - i.e. `<your-application-domain>/.well-known/acme_challenge/*` to invoke and reissue certificates.

If you have your application set to redirect from HTTP to HTTPS you will need to deactivate this. 

## Trouble downloading challenge file

If, while configuring a [standard](../security/ssl.md#configuring-standard-certificates) (i.e. NOT wildcard) Let's Encrypt certificate you see an error similar to this:

```shell
Wrote file to /etc/cloud66/webroot/FILENAME, but couldn't download http://DNS_NAME/.well-known/acme-challenge/FILENAME 
```
...you need to go through the following steps:

1. Delete the SSL certificate (vital)
2. If you use Cloudflare, ensure you have have Page Rule in place ([see above](#configuring-lets-encrypt-with-cloudflare))
3. There could be some sections missing (or misconfigured) in your Nginx config, probably due to customization or config file not being up to date. The following blocks take care of redirections. Ensure these sections of your own Nginx config match up with the examples below. 

```liquid
http {
    .
    .
    .
    server {
        .
        .
        .
        ## This block gives HTTP access to LetsEncrypts to validate the certificate issuance

        location /.well-known/acme-challenge/ {
            <If letsencrypt_primary_address == empty>
            # serve letsencrypt requests from here
            alias /etc/cloud66/webroot/;
            try_files $uri =404;
            <Else >
            # serve letsencrypt request from another host
            proxy_pass  http://{{ letsencrypt_primary_address }};
            <Endif >
        }

        ## From here is for taking care of redirections settings for your application
        
        <If red_http_to_https == true>
        <If has_load_balancer>
        set $http_rewrite 0;
        if ($http_x_forwarded_proto = "http") {
            set $http_rewrite 1;
        }
        if ($http_x_forwarded_proto = "") {
            set $http_rewrite 1;
        }
        if ($request_uri ~ ^/.well-known/acme-challenge/.*$) {
            set $http_rewrite 0;
        }
        if ($http_rewrite = 1) {
            rewrite ^(.*) https://$host$1 permanent;
        }
        <Else >
        if ($request_uri !~ ^/.well-known/acme-challenge/.*$) {
            rewrite ^(.*) https://$host$1 permanent;
        }
        <Endif >
        <Endif >

        <If red_www == 0>
        server_name             _;
        <Endif >
        <If red_www == 2>
        set $www_rewrite 0;
        if ($http_host ~ ^(?!www\.)(.*)) {
            set $www_rewrite 1;
            set $www_host $1;
        }
        if ($request_uri ~ ^/.well-known/acme-challenge/.*$) {
            set $www_rewrite 0;
        }
        if ($www_rewrite = 1) {
            return 301 $scheme://www.$www_host$request_uri;
        }
        <Endif >
        <If red_www == 1>
        set $www_rewrite 0;
        if ($http_host ~ ^www\.(.*)$) {
            set $www_rewrite 1;
            set $www_host $1;
        }
        if ($request_uri ~ ^/.well-known/acme-challenge/.*$) {
            set $www_rewrite 0;
        }
        if ($www_rewrite = 1) {
            return 301 $scheme://$www_host$request_uri;
        }
        <Endif >

        .
        .
        .
        }
    }

```