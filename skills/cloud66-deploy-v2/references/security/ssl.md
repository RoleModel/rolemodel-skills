# Adding SSL certificates to apps


## Overview

Cloud 66 supports three kinds of SSL certificates:

1. [Standard certificates](#standard-certificates) (via Let’s Encrypt)
2. [Wildcard certificates](#wildcard-certificates) (via Let’s Encrypt)
3. [External certificates](#external-certificates)

These solutions are mutually exclusive per app - you cannot mix them (with some servers using #1 and the rest #3, for example).

We describe how to set up each type of certificate below.

## Standard certificates

Standard certificates use Let's Encrypt to provision certificates for your domains.

### Adding a standard certificate

To add a standard certificate:

1. If you have not already done so, you must add (or update) your [DNS records](../networking/configure-dns.md) to point to your application (either directly, or via your load balancer) 
2. Open your application in your [Cloud 66 Dashboard](https://app.cloud66.com/) 
3. Click on *Web* → *SSL Certificate* in the left-hand nav 
4. Click *Add SSL Certificate*
5. Add your domain name and any subdomains (wildcards aren’t supported for this kind of certificate) 
6. Check or uncheck the *SSL termination* option (depending on your requirements)
7. Click *Create*

1. If you have not already done so, you must add (or update) your [DNS records](../networking/configure-dns.md) to point to your application (either directly, or via your load balancer) 
2. Open your application in your [Cloud 66 Dashboard](https://app.cloud66.com/) 
3. Click on *Application* → *SSL Certificate* in the left-hand nav 
4. Click *Add SSL Certificate*
5. Add your domain name and any subdomains (wildcards aren’t supported for this kind of certificate) 
6. Check or uncheck the *SSL termination* option (depending on your requirements)
7. Click *Create*

Cloud 66 will now attempt to add a standard certificate based on your configuration. Watch the timeline to see the outcome. 

**Cloudflare** users need to [add a Page Rule](../security/troubleshooting-ssl.md#configuring-let-s-encrypt-with-cloudflare) to their Cloudflare configuration in order for the process described above to work.  If you run into any other problems, consult our [troubleshooting doc](../security/troubleshooting-ssl.md).

Let's Encrypt needs to be updated every 3 months, so you should keep this configuration in place to allow for automatic renewal. 

#### How standard certificates work

For standard (i.e. non-wildcard) certificates we create a file with a random name under `/etc/cloud66/webroot/` on one of your web servers. [Let's Encrypt](https://letsencrypt.org/docs/challenge-types/#http-01-challenge) then tries to connect to your server and download that file via HTTP (i.e. port `80`). This confirms that you own and control the domain and thus that a certificate can be issued.

Let's Encrypt needs a non-secure HTTP endpoint - i.e. `<your-application-domain>/.well-known/acme_challenge/*` to invoke and reissue certificates.

## Wildcard certificates

Wildcard certificates rely on a different method for proving your domain’s ownership. Instead of adding a file to your server, we add a special record (provided by [Let’s Encrypt](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge)) to your DNS. 

### Step 1: Set up a DNS provider

In order to enable a wildcard certificate, you first need to set up a DNS provider with Cloud 66. To do so:

1. Set your domain to be managed by one of the DNS providers below
2. Configure your DNS provider to allow us to access it securely (see box below for instructions per provider)
3. Log into your Cloud 66 account and navigate to: 
Account Settings → External services → DNS Providers
4. Give your DNS account a name and select your provider from the list 
5. Add the credentials obtained in point 2
6. Click save

Each DNS provider has specific credentials that need to be created and then added to your Cloud 66 account. Find your provider below for more details.

If your provider is not listed, consider using [RFC 2136](https://www.rfc-editor.org/rfc/rfc2136) if your provider supports the protocol.

### Step 2: Add a wildcard certificate

Once you have have a DNS provider, you can set up a certificate:

1. Navigate to your application and click on *Web* → *SSL Certificate* in the left-hand nav 
2. Click *Add SSL Certificate*
3. Choose your DNS provider from the dropdown
4. Add your (wildcard) domain name
5. Check or uncheck the *SSL termination* option (depending on your requirements)
6. Click *Create*

1. Navigate to your application and click on *Application* → *SSL Certificate* in the left-hand nav 
2. Click *Add SSL Certificate*
3. Choose your DNS provider from the dropdown
4. Add your (wildcard) domain name
5. Check or uncheck the *SSL termination* option (depending on your requirements)
6. Click *Create*

Cloud 66 will now attempt to add a wildcard LetsEncrypt certificate based on your configuration. Watch the timeline to see the outcome.

## External certificates

External certificates are SSL certificates that you have obtained from another provider (not Cloud 66) and you are importing into your Cloud 66 application.

### Adding an external certificate

To set up an external SSL certificate:

1. Generate a private key and create a certificate signing request through your command line, without specifying a passphrase
2. Provide this CSR file to your certificate authority, who will, in turn, provide you with a certificate (CRT) file (download it to your local machine and keep it somewhere safe).
3. Open your application in your [Cloud 66 Dashboard](https://app.cloud66.com/) 
4. Click on *Web* → *SSL Certificate* in the left-hand nav 
5. Click *Add SSL Certificate* and click the *External* tab
6. Copy the contents of your private `.key` and `.crt` files into their respective fields 
7. You can also add intermediate certificates and specify allowed server names if needed - [see below for instructions](#intermediate-certificates).
8. Check or uncheck the *SSL termination* option (depending on your requirements)
9. Click *Add SSL Certificate* 

1. Generate a private key and create a certificate signing request through your command line, without specifying a passphrase
2. Provide this CSR file to your certificate authority, who will, in turn, provide you with a certificate (CRT) file (download it to your local machine and keep it somewhere safe).
3. Open your application in your [Cloud 66 Dashboard](https://app.cloud66.com/) 
4. Click on *Application* → *SSL Certificate* in the left-hand nav 
5. Click *Add SSL Certificate* and click the *External* tab
6. Copy the contents of your private `.key` and `.crt` files into their respective fields 
7. You can also add intermediate certificates and specify allowed server names if needed - [see below for instructions](#intermediate-certificates).
8. Check or uncheck the *SSL termination* option (depending on your requirements)
9. Click *Add SSL Certificate*

Cloud 66 will now attempt to add the certificate based on your configuration. Watch the timeline to see the outcome.

### Intermediate certificates

Some SSL certificate authorities (CA), like RapidSSL, issue certificates that are not fully compatible with all devices (specifically Android devices). This is because they are not the ultimate CAs and usually act as a reseller for other authorities (like VeriSign).

Cloud 66 supports fully these CAs. To use them, copy the contents of your intermediate certificate into the *Add SSL Certificate* interface (see above).

#### Multi-domain certificates

When installing multi-domain certificates, certificate authorities such as Comodo typically send you four files:

1. Root CA Certificate - e.g. *AddTrustExternalCARoot.crt*
2. Intermediate CA Certificate - e.g. *COMODORSAAddTrustCA.crt*
3. Intermediate CA Certificate - e.g. *COMODORSAExtendedValidationSecureServerCA.crt*
4. Your COMODO EV Multi-Domain SSL Certificate - *14637732.crt*

To use these, you have to concatenate all files except for the last one (the certificate):

```bash
$ cat COMODORSAExtendedValidationSecureServerCA.crt COMODORSAAddTrustCA.crt AddTrustExternalCARoot.crt > bundle_file
```

You will then copy the contents of the entire bundle file into the **Intermediate Certificate** field.

## Configuring Let's Encrypt with Cloudflare

If you route your application traffic through Cloudflare and use a [Standard certificate](#standard-certificates) you will need to add a [Page Rule](https://support.cloudflare.com/hc/en-us/articles/218411427-Understanding-and-Configuring-Cloudflare-Page-Rules-Page-Rules-Tutorial-) to your Cloudflare configuration in order for the server challenge process (see above) to work.

The URL for the page rule should be the challenge URL for your server: http://YOURSITE.com/.well-known/acme-challenge/

To set up your application:

1. Ensure the challenge file is in the folder
2. Log into your Cloudflare dashboard and create a new Page Rule
3. Set the challenge URL as an exact match for the Page
4. Set *SSL* to "off"
5. Set *Automatic HTTPS Rewrites* to "off"
6. Set *Browser Integrity Check* to "off"
7. Save and deploy the rule (after testing)

The challenge should now succeed. If it does not, read the rest of this guide. 

Let's Encrypt needs to be updated every 3 months, so you should keep all configurations in place to allow for automatic renewal. 

## Using Cloudflare SSL certificates with Cloud 66

If you’d like to use a certificate **issued by Cloudflare** (i.e. use Cloudflare as your CA) with your application on Cloud 66, we recommend you use their [Full - SSL/TLS encryption mode](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/) rather than the default Flexible mode. To enable this:

1. Generate an [Origin CA certificate](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/#deploy-an-origin-ca-certificate) on your Cloudflare account
2. Add the resulting certificate as an [External Certificate](https://help.cloud66.com/docs/security/ssl#adding-an-external-certificate) on your Cloud 66 account 
3. Enable Full SSL/TLS encryption mode on your Cloudflare account

For Rails apps, we suggest you set the `force_ssl` option to `true`.