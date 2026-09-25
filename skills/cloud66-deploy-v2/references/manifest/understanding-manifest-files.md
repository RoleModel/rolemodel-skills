# Understanding Manifest Files


## Understanding manifest files

### Classes of manifest file settings

Although manifest files are a powerful tool for defining the composition of an application, it is vital to understand their limits and exceptions. 

There are three broad classes of settings in manifest files:

1. Settings that only apply when an application is deployed for the first time (e.g. how much RAM your server should have)
2. Settings that only apply after a specific action is taken (e.g. using Toolbelt to force Nginx to refresh its configuration)
3. Settings that apply each time an application is redeployed

#### Class 1: Once-off settings

These are almost exclusively confined to the `server` settings. For instance, changing the cloud vendor in your manifest will not automatically migrate your server to that provider. 

Class 1 settings include:

* Disk size 
* Disk type
* Vendor
* Region
* Size

#### Class 2: Sticky settings

These are settings that require a specific action to trigger their roll-out. 

For example, in order to implement changes to cross-origin scripting (CORS) settings in Nginx, you need to use the `reconfigure.nginx` command in [Cloud 66 Toolbelt](../toolbelt/_settings-set.md) to force the settings to propagate.

#### Class 3: Flexible settings

These are settings which will be applied as soon as the application is re-deployed following a change to its manifest file. This includes all the settings that don't fall into classes 1 or 2 above.

## Key to table headings

Throughout the manifest documentation, you'll see tables with the following headings:

* **Option** - the name of the setting as used in the YAML of your Manifest file
* **Applied on** - the type of deployment required to update this setting. In many cases settings only apply when an application is first built, or when new servers are created or it is cloned. Hover over the names of each condition to see more info.
* **Clouds** - the cloud providers on which a setting can be used.

### Applied on Icons

-  - Applied when the application is first built or when new servers are created
-  - Applied on each redeployment
-  - Applied when upgrading components