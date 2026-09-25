# Running Toolbelt in different environments


## Installing on a server (headless)

To install Toolbelt on a server (without a browser):

1. Install and authenticate `cx` on your local machine (see above)
2. Log into your server via your terminal and move to the `.cloud66` directory (under `home`) 
3. Create a file named `cx.json` in that folder
4. Go to the terminal on your local machine, where you already have Toolbelt authorised and execute `cx dump-token`, which will give you your authorisation token
5. Copy this token and paste it into the (remote) `cx.json` file that you created in Step 3
6. Save the file and then run `cx stacks list` on the server to confirm that Toolbelt is initialised

## Running Toolbelt inside a Docker container

You can run the Cloud 66 Toolbelt inside a Docker container, although this is not officially supported. 

#### Step 1: Start an ubuntu container

We start a generic Ubuntu container (Cloud 66 runs on Ubuntu servers) 

```shell
$ docker run -it ubuntu:latest /bin/bash
```

#### Step 2: Install required/useful tools

Toolbelt relies on three tools - curl, nano and ssh - so we install these packages.

```shell
$ apt update
```

```shell
$ apt install curl nano ssh -y
```

#### Step 3: Create some default folders

We need to create some default folders to support Toolbelt’s requirements.

```shell
$ mkdir -p ~/.ssh
```

```shell
$ mkdir -p ~/.cloud66
```

#### Step 4: Install Toolbelt

Now we install the Toolbelt by CURLing the installation shell script on S3:

```shell
$ curl -sSL https://s3.amazonaws.com/downloads.cloud66.com/cx_installation/cx_install.sh | bash
```

#### Step 5: Register Toolbelt

Finally, we need to register Toolbelt:

1. Install and authenticate `cx` on your local machine
2. SSH into your container and move to the `.cloud66` directory (under `home`)
3. Create a file named `cx.json` in that folder
4. Go to the terminal on your local machine, where you already have Toolbelt authorised and execute `cx dump-token`, which will give you your authorisation token
5. Copy this token and paste it into the (container’s) `cx.json` file that you created in Step 3
6. Save the file and then run `cx stacks list` from inside the container to confirm that Toolbelt is initialised

After this, you should be able to use `cx` commands inside the container.