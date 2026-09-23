# Reserved tags


You can tag a variety of your infrastructural components, such as applications (stacks), servers, or firewall rules, in order to differentiate them from one another. Some tag names are reserved by Cloud 66 because they provide additional functionality to your infrastructure.

## Reserved tags
Cloud 66 currently reserves the following tags:

|Tag|Target|Description|
|--- |--- |--- |
|c66.delete.protection|server, formation|Prevents a component (e.g. server) from [being deleted](../servers/scaling.md#delete-protection) - including via the Toolbelt and API.|
|c66.migrations.run|server (Rails only)|Sets the given server as the [migrator](../databases/database-management.md) - migrations will run on that server *only*, and the rest of the servers will wait until the migrations are performed before continuing with the deployment.|
|c66.compilation.run|server (Rails only)|Nominates a Rails server to handle [asset pre-compilation workloads](../deployment/enable-disable-asset-pipeline.md#nominating-a-dedicated-compilation-server).|
|c66.build-commands.run|server (Rack only - does not apply to Rails)|Nominates a server to handle the workload of the declared custom build command (as specified in your [manifest](../manifest/what-is-a-manifest-file.md) or during the initial build process). Only applies during the initial build of the application.|
|c66.deploy-commands.run|server (Rack only - does not apply to Rails)|Nominates a server to handle the workload of the declared custom deploy command (as specified in your [manifest](../manifest/what-is-a-manifest-file.md) or during the initial build process). Applies during subsequent deployments of the application.|

## Adding tags to a server

To **add** a tag to a server:

1. Log into your Cloud 66 dashboard and click on your application
2. Click through to the server you'd like to tag
4. Click on *Add Server Tags* 🏷
5. Type in `c66.` and you will be prompted to autocomplete the tag you need - then click Save.
6. You will now be able to see the tag listed in the server panel