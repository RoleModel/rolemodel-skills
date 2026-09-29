# Securely managing secrets


## Overview

The Secrets feature gives you a secure way to make application secrets (such as passwords or API keys) available on your server without exposing them as environment variables or in your code repository. Secrets are available as readonly files on your servers and in your containers.

## Managing Secrets

Secrets are managed via your Cloud 66 dashboard. Secrets can be set at two levels:

1. Account level - these will be set on all applications under the account
2. Application level - these will be set only on the respective application

If an identically named Secret is set at both account and application level, the application level instance will be used.

Secrets are stored as read-only files on each server (or container) under the path `/mnt/cloud66/secrets`. Each Secret uses its **key as its filename**, and its **value as the content** of the file. They can be accessed and read like any other file. 

### Adding Secrets to your account

1. Log into your Dashboard 
2. Click your avatar (top right) and select *Account Settings*
3. Click *Settings* in the left-hand Nav
4. Click *Variables* in the sub-nav
5. Add a key and value for the Secret 

Keys must use only alphanumeric characters, with periods (.), hyphens (-), and underscores (_) as separators. Remember that this key will be used as the name of the Secret file. 

You can also **update** an existing secret by simply editing its values. Be cautious when updating any Secrets that might currently be in use by your production applications. 

Secret files are updated on your servers as soon as you change them, but you may need to redeploy to force your application code or components to recognise a new value. 

### Adding Secrets to your application

To add secrets to your application:

1. Log into your Dashboard and click through to your application
2. Clicks on Settings in the left-hand navigation
3. Click on Variables in the sub-menu 
4. Click the Secrets tab above the man section
5. Add a key and value for the Secret 

Keys must use only alphanumeric characters, with periods (.), hyphens (-), and underscores (_) as separators. Remember that this key will be used as the name of the Secret file. 

You can also **update** an existing secret by simply editing its values. Be cautious when updating any Secrets that might currently be in use by your production application. 

Secret files are update on your servers as soon as you change them, but you may need to redeploy to force your application code or components to recognise a new value. 

### Deleting Secrets

For both Account and Application Secrets:

- Follow steps 1 - 4 in the previous sections
- Click on the delete icon on the right-hand side of the Secret you wish to delete

Before deleting, make sure that your production application does not rely on a secret. 

## Using Secrets in your application

Secrets are available as files under `/mnt/cloud66/secrets`. Your application code can read secret files like any other file on a server or in a container.

For example in Ruby, you could set a variable from a Secret named `api_key` as follows:

```ruby
def api_key
  return @api_key if defined?(@api_key)
  api_key_file = "/mnt/cloud66/secrets/api_key"
  @api_key = ::File.read(api_key_file) if ::File.exist?(api_key_file)
  raise "API key not available" if @api_key.nil?
  @api_key
end
```