# Getting Git information from your Rails servers


## Overview

If you need to check which version of your code is deployed on a Rails application server, you can do so one of two ways:

1. You can read the `REVISION` file in the root path of your application. This file contains the full Git reference (ie. `git rev-parse HEAD`) hash of your currently deployed code. This file is here for convenience as running the git command directly may not work for some repositories.
2. You can query the Cloud 66 [metadata API endpoint](https://help.cloud66.com/docs/servers/querying-server-metadata#4-find-out-which-version-of-the-code-is-deployed)

## Reading the REVISION file 

To do this manually you can [SSH into the server](https://help.cloud66.com/docs/servers/ssh-to-server#ssh-using-cloud-66-toolbelt-cli) and `cat` the file. You can also fetch the git ref using Ruby from within your application as follows:

```ruby
current_git_hash = ::File.read(::File.join(ENV["STACK_PATH"], "REVISION")).strip
```

## Querying via the metadata API endpoint

Our API has a metadata endpoint (`app.cloud66.com/api/tooling/metadata/`) that allows you to query metadata directly from your servers. This can be done automatically or manually, an example of retrieving this manually is:

1. [Log into your server via SSH](https://help.cloud66.com/docs/servers/ssh-to-server#ssh-using-cloud-66-toolbelt-cli)
2. Run the command below:

```bash
$ curl -s -H "Accept: application/json" https://$CLOUD66_ACCOUNT_API_KEY:X@app.cloud66.com/api/tooling/metadata/$CLOUD66_APPLICATION_API_KEY/deployment/source | jq -r '.response'
```

**Note:**

- Even though you are logged into your server, you still need to pass your Cloud 66 API key and Application API key in the query (for security reasons). These are both available as Environment Variables on your server.
- We are setting the header to "Accept: application/json" - this allows our curl command to correctly format the data, which is returned in JSON format.

This will return your git ref in the following format: 

```json
{
  "app": {
    "repo": "git://github.com/cloud66-samples/rails-mysql",
    "hash": "a99f026df617************1fb1c4497189afd8"
  }
}
```