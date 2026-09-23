# Accessing your Kubernetes instance directly


## Overview

Although Cloud 66 is designed to make managing your clusters a hands-off experience, you still have full access to all the features of Kubernetes whenever you need them. If you'd like to access a Kubernetes instance directly (for example to perform in-depth debugging) you can easily access your cluster using one of the two methods below. 

 We don't recommend that users who are new to Kubernetes access their cluster directly on production environments until they're comfortable with doing so in testing environment (like minikube). 

## Method 1: Connect to the server

You can access you cluster directly by connecting to your cluster's master server via SSH in your terminal. The quickest and easiest way to do this is to use [Cloud 66 Toolbelt](../toolbelt/_ssh.md). 

Once you have Toolbelt installed, run the following command, replacing the placeholder with your application's name:

```
cx ssh -s myapp <YOUR APP NAME> master
```

You can now access your cluster and run whatever commands you need using the certificate on the server. For example:

```bash
sudo kubectl --kubeconfig=/etc/kubernetes/admin.conf get nodes
```

This method is best if you only need to access you cluster occasionally. If you need to access it regularly, we recommend using method 2 below. 

## Method 2: Connect from your own machine

This method downloads a `kubeconfig` file to your computer that allows you to run commands (such as `kubectl`) remotely.

To set this up, you first need to have Kubernetes installed on your local machine. Once that is done:

1. Open your app in Cloud 66 Dashboard
2. Click on *Network* in the left-hand nav
3. Set up firewall rule that allows access FROM your **own IP address** (or range) TO your **master** server using **TCP** and port **6443**. (If you need help, please read our [Firewall guide](../security/firewall-rule.md))
4. Click through to your master server (click the *Applications* in the left hand nav and then *Servers*)
5. Click the *&#8615; More* button at the top right of the Master Server panel and choose *Download Kubeconfig file* 
6. Set the environment variable using `export KUBECONFIG=/file/path`
7. You can now access your cluster and run whatever commands you need using the certificate on your computer. For example:

```bash
kubectl get nodes
```

Because this method gives a remote machine direct, super-admin-style access to a cluster, we recommend using it with caution and treating the `kubeconfig` file with care.