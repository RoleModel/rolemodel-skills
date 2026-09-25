# Connecting git repositories


## Overview

Cloud 66 builds and deploys your code directly from your own git repositories. In order to do so, we need (read-only) access to those repositories. This guide explains the different options for granting access, depending on your git provider and on whether the repo in question is public or private. The options are:

- [Private GitHub repos](#private-github-repositories) (using our Cloud 66 Deployments GitHub app)
- [Manually configured GitHub access](#manually-configuring-github-access) (using an SSH key)
- Other [private (non-Github) repositories](#other-private-repositories) (using an SSH key)
- [Public repositories](#public-repositories)

## Private GitHub repositories

Cloud 66 offers a native integration with GitHub. When creating a new application, click on the *Deploy from Github* link and we will install the **Cloud 66 Deployments** GitHub application on the account or organisation you specify. This gives us read-only access to the repositories which you specify *within* that account or organisation.

### Working with multiple GitHub accounts

If your code is spread across several accounts or organisations, you will need to install the **Cloud 66 Deployments** GitHub application on each of them, and grant us access to all the relevant repositories. This is particularly important if your application has code dependencies in other private repositories. 

Installing the **Cloud 66 Deployments** GitHub application does not add a Cloud 66 SSH key to GitHub accounts or organisations *except for your personal account* (where we do add the key). In general we make use of the **GitHub app token** to access repos. As such it is vital that you ensure you install the application on **all** the repositories on which your application relies.

If the solution below is not suitable for your needs, we have a [manual solution](#manually-configuring-github-access) which is more flexible but requires more set up.

### Adding or updating GitHub accounts

If you have access to multiple GitHub accounts or organizations, you will need to add each separately. To add more accounts or orgs:

1. Log into your [Cloud 66 Dashboard](https://app.cloud66.com/)
2. Click on your avatar (top right) and then *Account Settings*
3. Click on *External Services* in the **Settings** panel (on the left)
4. Click the *Configure GitHub app* link next to the GitHub app - you will be sent to GitHub to configure your access
5. Click on the name of the GitHub account or organization you wish to add or update
6. Select the required repositories (or the entire account / org)
7. Click *Authorize & Request* 
8. You will be redirected back to Cloud 66

If the account or organization you’ve added requires someone to approve access, you will need to get that approval before its repositories will be available via Cloud 66.

### Manually configuring GitHub access

If the automated / GitHub application solution above does not suit your needs, you can manually grant us access. To do this, add your Cloud 66 SSH key to either: 

- Your **primary (personal) GitHub account**, or
- A standalone **Cloud 66 GitHub** **user** (that you have created) - make sure this has all the required permissions

To add your Cloud 66 SSH key to the chosen GitHub account, first find your **Cloud 66 SSH key**:

1. Open your Cloud 66 [Dashboard](https://app.cloud66.com/dashboard)
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click on *Git Repo SSH Keys* in the **Settings** panel on the left
4. Copy the **Git public SSH Key** 

...then add it to **Github**:

1. Log into the **GitHub** account you wish to use with Cloud 66
2. Click on your avatar (top-right) and select *Settings*
3. Click on *SSH and GPG* keys in the left-hand navigation panel
4. Click the green *New SSH key* button (top right)
5. Give the key a title and paste in your Cloud 66 SSH key 
6. Click *Add SSH Key*

You should now be able to deploy your code, and all its dependencies, via Cloud 66. If you are still having trouble please log a support call (see below).

### Deploying manually configured GitHub repos

If you have used the manual method above, then you have two options when first deploying your application:

1. You can add the **Cloud 66 Deployments** GitHub application to your primary application repo during the deployment process
2. You can click *I'd rather enter a git repo URL*

The first option is convenient because your repo will be automatically listed in the repo dropdown, but it may not suit your security (or other) requirements. If so, use the second method.

## Other private repositories

For Cloud 66 to access your private (non-GitHub) repositories (with read-only access), you first need to add the SSH key provided by Cloud 66 to your account with your git provider. To find this key:

1. Open your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click on *Git Repo SSH Keys* in the **Settings** panel on the left
4. Copy the **Git public SSH Key** and add it to your Git repo provider

You can add this SSH key globally to your git provider by adding it to your **Account settings**, or allow access to a specific repository by adding it to that repository as a **deploy key**.

Once this is done, use a Git URL in the following format:

```shell
git@<git provider>:<username>/<repository>.git
```

### BitBucket example

#### Adding the SSH key globally
   
To add the SSH key globally: 

* Go to *View Profile*
* Click on *SSH keys* and then *Add key*. 
* Paste the key you copied from Cloud 66 into the text box
* Click *Add key*

Once this is done, use a Git URL in the following format in the Cloud 66 UI:

```shell
git@bitbucket.org:<username>/<repository>.git
```

#### Adding the SSH key to a specific repository

To add the SSH key to a specific repository: 

* Access the Settings menu for that repository (top right)
* Click Deployment keys 
* Paste the key you copied from Cloud 66 into the text box
* Click *Add key*

Once this is done, use a Git URL in the following format in the Cloud 66 UI:

```shell
git@bitbucket.org:<username>/<repository>.git
```

## Public repositories

For public Git repositories, you don't need to add the SSH key provided to your Git account. You simply need to provide the Git URL. This differs depending on provider.

### Public GitHub repos

To access public repositories on GitHub, you must use:

```shell
https://github.com/<username>/<repository-name>.git
```

GitHub no longer supports other URL formats for public repos.

 We only support `https://` for GitHub repos. For other providers please use `http://` or `git://` 

### Other public repos

For **non-GitHub** providers you can use either:

```shell
http://<git provider>/<username>/<repository>.git
```

or   

```shell
git://<git provider>/<username>/<repository>.git
```

This URL is often automatically generated by your Git provider.

## Querying git hashes

When we pull code from a git repo, we store the most recent commit hash in your application’s metadata. You can fetch this hash value in three ways:

1. by querying from inside your app code: e.g. `git_ref = 'git rev-parse HEAD'.strip`
2. by querying our [metadata service](../servers/querying-server-metadata.md)
3. by calling the [API deployment method](https://developers.cloud66.com#deployment) which returns details on applications including `git_hash`

## Querying git hashes for services

When we pull code from a git repo to build a service in Cloud 66, we store the most recent commit hash as an environment variable. You can fetch this hash value in three ways:

1. by querying the environment variable named `CLOUD66_SERVICE_GIT_REF`
2. by querying from inside your app code: e.g. `git_ref = 'git rev-parse HEAD'.strip`
3. by calling the [API container show method](https://developers.cloud66.com#container-show) which returns details on services running in containers including `git_hash`

## Using Github with Cloud 66

For a tutorial on how to build code from Github into a service for use with Cloud 66, please follow our [Getting Started](../getting-started/deploy-your-first-app.md) guide which walks you through the process.