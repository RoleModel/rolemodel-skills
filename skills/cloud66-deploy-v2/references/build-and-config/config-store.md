# Using ConfigStore


## Overview

ConfigStore provides way to store, track, manage and share configuration data in a centralised, version-controlled repository. Each ConfigStore record contains **Key**, **Value**, and **Metadata** information that can be shared across all of your applications.

Some of the advantages of using ConfigStore are:

* Common configuration variables can be shared between different applications (even if they use different cloud providers, different regions or different frameworks)
* Configuration variables are pulled from a central repo and don't need to be hardcoded into configuration files and shipped out to servers. This makes updating variables quicker and more reliable
* Variables can be queried via the API
* ConfigStore supports wildcards in keys to allow for filtering and contextual lookups

You can use ConfigStore with any Cloud 66 application. One example of a use case might be a centralised place to store different webhooks per environment for a monitoring service like New Relic or Scout, or API parameters for a push notification service like OneSignal or Amazon SES.

## ConfigStore vs environment variables

When you add environment variables to your application they become Linux operating system environment variables.

ConfigStore provides an alternative place to store centralised information that will not be exposed in OS level environment variables.

## ConfigStore Data Structure

Data edited in ConfigStore via the [Dashboard](https://app.cloud66.com/dashboard) is text only and is structured as:

* **Key** &mdash; A text based `Key`.
* **Value** &mdash; A text based `Value`.
* **Metadata** &mdash; A comma separated list of `key=value` pairs. For example: `key1=value1, key2=value2`

## Levels of ConfigStore

There are two levels of ConfigStore:

* At application level
* At account level

### Application-level 

To access ConfigStore for a particular application:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on the *ConfigStore* in the sub-nav

This page provides a way to store information where the scope is **limited to a specific application**. Variables stored in this repository will not automatically be available to any other application in your account. This is useful for storing variables that are either very application-specific or where the risk of sharing outweighs the benefits of centralisation.

### Account-level 

To access your account-wide ConfigStore:

1. Open your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click on *ConfigStore* in the **Account** panel on the left

This provides a way to store config information **globally** that can be referenced by all of your applications. This is useful for sharing common variables and variable patterns across all of your applications. 

This approach requires some additional care and planning to prevent unintended consequences, such as applications connecting to incorrect resources or cloud services and creating confusion or dirty data. 

## ConfigStore metadata

The *Metadata* field in ConfigStore is intended to store useful reminders about the nature of the configuration variable being stored. This can include:

* The type of value (e.g. *integer*, *string*, *GUID* etc.)
* A description of the configuration variable
* Valid format(s) for the variable (e.g. `mm/dd/yy` vs `dd/mm/yyyy`)

...and essentially anything else that might be useful to know about any configuration variable.

## Namespaces

Every ConfigStore has its own unique namespace in the form of a 36-character GUID. This includes both account level and application level ConfigStores. 

You can find the namespace:

* For an application: under **Config** &rarr; *ConfigStore* tab 
* For an account: under **Account Settings** &rarr; *ConfigStore*

This namespace can be used to reference a particular ConfigStore, either via the API or using placeholders in configuration templates (see below).

## Accessing ConfigStore Variables

You access ConfigStore data by using the following syntax:

### Environment Variables

To load values from ConfigStore as environment variables in any application, open the [Environment Variables](../build-and-config/env-vars.md) interface via your Dashboard and use the following format as the *value* for any key:

```shell
_configstore(NAMESPACE_UUID.KEY)
```

### Service.yml placeholder

The following syntax must be used for service.yml:

```yaml
envs:
  - ABC: _env(XYZ)
```

This will define `XYZ` as an environment variable for the given service, which pulls `ABC` from the Application which in turn could come from the ConfigStore.