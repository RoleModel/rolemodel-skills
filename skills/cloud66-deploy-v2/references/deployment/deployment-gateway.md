# Deploying behind a gateway server


## About deployment gateways

If you want to deploy your application in a DMZ, you should prepare a bastion server which enables you to connect to your DMZ. You should define a **Deployment Gateway** in your Cloud 66 account and specify the information of the bastion server, then you will be able to deploy your application in the DMZ.

 Team members must have **Edit Deploy Gateways** access rights to be able to use the deployment gateway. 

## How to deploy your application behind a gateway server

Gateway management is available through [toolbelt](https://help.cloud66.com/deploy/2/toolbelt/_gateways-add) .

First you need to define a gateway:

```shell
$ cx gateways add --name aws_bastion --address 1.1.1.1  --username ec2-user  --private-ip 2.2.2.2
```

In order to use this gateway for application deployment, you need to first specify it in the manifest:

```yaml
production:
   	gateway:
   	    name: aws_bastion
   	    username: ec2-user
```

and then make it available before you start the deployment:

```shell
$ cx gateways open --name aws_bastion --key /tmp/gateway.pem
```

Now you can start deploying your application.

After the deployment is finished you can invalidate the gateway or leave it until the TTL is over.

```shell
$ cx gateways close --name aws_bastion
```

## Adding servers behind an on-premises gateway

You can add [registered servers](../servers/registered-servers.md#register-a-server) to Cloud 66 via an on-premises gateway server as long as:

1. The registered servers are on the same network as the gateway
2. You are deploying a Rails application

To add a server behind your gateway:

1. SSH to the server and run the registered server [registration script](../servers/registered-servers.md#register-a-server) **with** the `--header X-Fixed-IP:123.123.123.123` option - where `X-Fixed-IP` is set to the IP address that the gateway will use to access the server (usually the private IP address of the server).
2. Set up the gateway server and configure your application to use it via the manifest as specified above
3. Open the gateway and add the newly registered server to your application. Because the application is configured to use the gateway, it will go through the gateway and then direct requests to the IP address under `X-Fixed-IP`.

## Accessing your servers behind the gateway server

If you want to connect to your servers behind the bastion server firstly you will need to have access to the bastion server's key, then you can use toolbelt to connect to your server:

```shell
$ cx ssh --gateway-key ~/.ssh/bastion_key  -s "My Awesome App" Lion
```