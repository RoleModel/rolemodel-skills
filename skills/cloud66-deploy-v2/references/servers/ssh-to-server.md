# How to SSH to Servers


## Overview

You can access any of your servers (that are being managed by Cloud 66) directly via SSH. For security reasons we only allow access using [SSH keys](../cloud-66-101/ssh-keys.md), and not usernames and passwords. See below for how to add your key to Cloud 66. 

## Adding your SSH key to your Cloud 66 account

Both of the methods below rely on SSH keys rather than username and password (which Cloud 66 does not support). As such you first need to give us your public SSH key, which we will add to all your servers (both existing and new) automatically. 

To add an SSH key to your Cloud 66 account:

1. Either generate new SSH keys (click "How to generate new SSH keys" above), or re-use one of your existing local SSH keys
2. Log into your Cloud 66 Dashboard, click on your avatar (top right) and select *Account Settings*
3. Click on *SSH keys* in the left navigation under **Settings** and then on the *SSH Access Key* tab.
4. Copy (or, if possible, `pbcopy`) the contents of your local **public** key (usually found at either `~/.ssh/id_rsa.pub` or `~/.ssh/id_ed25519.pub`), paste it into the text field and click *Update My SSH Key*

You’re now ready to SSH into your servers using one of the methods below. We provide two different ways for you to SSH to your servers - an automated way with Cloud 66 Toolbelt, or a manual way.

If any of your servers are unreachable by Cloud 66 when you add your SSH key, then you will need to manually sync your SSH key to those servers using [the method described below](#server-was-unreachable-when-ssh-key-was-added).

## SSH using Cloud 66 toolbelt (CLI)

You can use [Cloud 66 Toolbelt](../toolbelt/using-cloud66-toolbelt.md) to easily SSH to your servers. In order to use this function you need to:

1. [Install the Toolbelt](../toolbelt/using-cloud66-toolbelt.md#install-toolbelt) on your local machine
2. Ensure you have [added your public SSH key](#adding-your-ssh-key-to-your-cloud-66-account) to your Cloud 66 account
3. Run one of the commands below

```shell
cx ssh [--gateway-key <The path to the key of gateway server>] [-s "your application name"] "your server name"|<server ip>|<server role> [-i <your private key>]
```

Many of these parameters are optional or mutually exclusive. For example you don't need to provide both the server name and the IP address.

#### Examples

```shell
cx ssh -s "My Awesome App" web
cx ssh --gateway-key ~/.ssh/bastion_key  -s "My Awesome App" Lion -e production
```

```shell
cx ssh [-s "your application name"] "your server name"|<server ip>|<server role> [-i <your private key>] 
```

Many of these parameters are optional or mutually exclusive. For example you don't need to provide both the server name and the IP address.

#### Examples

```shell
cx ssh -s "My Awesome App" web
cx ssh -s "My Awesome App" Lion -e production
```

See [toolbelt shortcuts](../toolbelt/using-cloud66-toolbelt.md), for information on to do this via our CLI.

## Manual SSH access

You can access your servers manually via SSH from any Linux-based operating system (including Mac OS X). To do this:

1. [Create an SSH key pair](../cloud-66-101/ssh-keys.md) on your local machine (or re-use an existing one) 
2. [Add your public SSH key](#adding-your-ssh-key-to-your-cloud-66-account) to your Cloud 66 account
3. **[Add a firewall rule](../security/firewall-rule.md#adding-a-custom-firewall-rule)** to your application to open port 22 to your own IP address (it is closed to outside traffic by default).
4. Open your terminal and SSH to your server using this command format:

```bash
$ ssh user_name@ip_address 
```

…or…

```bash
$ ssh user_name@ip_address -i <path to your private key>
```

## Troubleshooting

Cloud providers frequently change the public IP addresses of servers when they are restarted. This includes all events that require the server to be shut down - including things like adding more capacity, or upgrading software components. This can (temporarily) cause our firewall to block connections to or from that server until our system detects the IP change and updates the firewall rules. This problem should resolve itself within a few minutes. If you'd like to avoid this issue completely, we recommend buying static IP addresses from your cloud provider for use with mission critical servers.

### Server was unreachable when SSH key was added

If any of your servers are unreachable when you add your SSH key to your Cloud 66 account, then we will not be able to propagate your key to them, and manual SSH will not work. This includes:

- Servers that are offline for any reason (paused, unavailable etc)
- Servers behind gateways

To solve this issue, you need to use the [Toolbelt command](../toolbelt/_ssh.md) below to sync the key with your server and make manual SSH possible again.

```bash
$ cx ssh-config set-public-key --public-key "<full public key>”
```

### Update your toolbelt version

Toolbelt updates are normally applied automatically in the background, but in some cases these may not work. If so, you may need to [update the toolbelt manually](../toolbelt/using-cloud66-toolbelt.md#update-the-toolbelt).

### Toolbelt SSH asking for password

If your toolbelt SSH connection is asking for a password, there may be an issue with the local SSH key cache on your computer. To remove this cache, run the following commands:

```bash
mkdir ~/.ssh/old_cx
mv ~/.ssh/cx_* ~/.ssh/old_cx
```

This moves the cached SSH keys to a temporary folder, so that they are downloaded again.

### Toolbelt exits command

If the toolbelt SSH connection exits while running, it helps to check the output log from the command. To see this, simply prepend `CXDEBUG=1` to your command. For example, you can run:

```bash
CXDEBUG=1 cx ssh -s "My Awesome App" web
```

This will show at which point the command fails, and if you run this manually, you should see more error details.

### Toolbelt exit status 255

You may see this output from the bottom of the previous command:

```shell
`Running Command /usr/bin/ssh with ([<username>@<ip_address> -i /Users/<username>/.ssh/cx_<id>_pkey -o UserKnownHostsFile=/dev/null -o CheckHostIP=no -o StrictHostKeyChecking=no -o LogLevel=QUIET -o IdentitiesOnly=yes -A -p 22])
2020/07/23 17:41:12 error: exit status 255
```

In this case, there has likely been an issue running the SSH command, though no logs are output from it (given the `LogLevel=QUIET` directive). We'll want to run that command directly (and switch the `LogLevel` to `VERBOSE`):

```shell
`ssh <username>@<ip_address> -i /Users/<username>/.ssh/cx_<id>_pkey -o UserKnownHostsFile=/dev/null -o CheckHostIP=no -o StrictHostKeyChecking=no -o LogLevel=VERBOSE -o IdentitiesOnly=yes -A -p 22
```

The output from that command should help you understand what the root cause of the issue is.

### SSH timeout

SSH connection time-outs typically happen when the firewall connection isn't open. The toolbelt opens the firewall to your current IP address automatically, but your external IP address may change between this request and the actual connection. To verify this, try the manual connection method to see if you can connect.

### Check the permissions of your /home and .ssh directories

The SSH utility requires a certain level of permissions to be set in the `/home` directory of your Linux user before it will work. Those permissions are:

- `/home/your_username` must be set to (at most) `755 (drwxr-xr-x)`
- `/home/your_username/.ssh` must be set to `0700 (drwx------)`

In addition, make sure your `.ssh/authorized_keys` file is set to `600 (-rw-------)`.

If these permissions are set too "open" (for example `0777`) SSH will refuse to work as it sees this as insecure. Normally these directories are set to the correct permissions by default, but they can be changed by external processes or (unintentionally) by shell commands by team members.

### Debugging using verbose mode

Verbose mode gives you more information on the SSH command running. It is a good way of finding out more detail about what is preventing SSH from working. To run the SSH in verbose mode, use the following command:

```bash
cx ssh -vvv -s <APP_NAME> -e <ENVIRONMENT> <SERVER_NAME>
```

### Cloud provider's firewall API has delay

API delays with cloud firewalls can cause SSH to fail. This can often be solved by adding a short delay between the firewall request (`lease`) and the SSH attempt using the command below:

```bash
cx lease -s <APP_NAME> -e <ENVIRONMENT> -p 22 -t 10
sleep 10
cx ssh -s <APP_NAME> -e <ENVIRONMENT> <SERVER_NAME>
```

### Detected IP is different

Toolbelt detects your public IP, but some network providers may use a different IP addresses for different ports, or obscure your actual IP address in other ways, which will cause the firewall to block your attempts to SSH. 

To get around this, you will need to temporarily open your server to traffic from all IP addresses using the command below:

```bash
cx lease -s <APP_NAME> -e <ENVIRONMENT> -p 22 -t 10 -f 0.0.0.0/0
cx ssh -s <APP_NAME> -e <ENVIRONMENT> <SERVER_NAME>
```

### Prompted for password

If you are being prompted for the password using Toolbelt, it means either your user account doesn't exist on the server, or the key you are using doesn't match the one on the server. This can be because of an incomplete key on the server. 

In order to fix either of these issues, you will need an account admin to remove your user permission from that application and re-add your user again. This will push your "new" user account to the servers and should solve this issue.

Adding your user to servers may take up to 20 minutes as it is running in the background.