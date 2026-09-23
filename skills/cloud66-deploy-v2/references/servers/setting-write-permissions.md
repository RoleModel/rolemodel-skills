# Setting permissions for writing to web servers


## Overview

If your Rails application needs to support the ability to write to a directory on your web server (for example file uploads from users) you will need to ensure that the permissions for that directory are correctly configured or the write process will fail consistently.

## Cloud 66 default Linux users and groups

When Cloud 66 configures your servers, we create two Linux users:

- `nginx` which handles the front-end
- `cloud66-user` which handles the backend

In order to bridge the (intentional) gap between these users, we place them both in the same Linux group called `app_writers` - this allows for use cases where a feature needs access to both frontend and backend processes. 

The `nginx` user is limited and **cannot** be escalated to a super user using the `su` command. This helps to ensure it cannot be abused by unauthorised public users.

## Setting permissions for your writable directory

In order to make a directory writable:

- You need to ensure the directory owner group is `app_writers`
- File permissions must be set to `0660`
- Directory permissions should be set to `0770`
- The process writing to the directory should run as the `nginx` user

If you're relying on a third-party library or gem, you will need to adjust its configuration to ensure it creates directories with the correct permissions and does not try to run as an exotic or custom user.