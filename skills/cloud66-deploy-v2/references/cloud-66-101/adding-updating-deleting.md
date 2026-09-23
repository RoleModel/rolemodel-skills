# Editing, cloning & deleting apps


## Building an application

To build your first application, see our [Getting Started guide](../getting-started/deploy-your-first-app.md). If you have existing application(s), simply click _New Application_ from your Cloud 66 [Dashboard](https://app.cloud66.com/dashboard).

## Updating application properties

You can access your *Settings* page from the left-hand nav of your application. 

This allows you to edit your application name and other global settings. You can also click the *Show More* link to see and edit your API and deployment keys. For more detailed app info click the *More information* link in the Application Type row.

## Clone an application

Cloning allows you to quickly duplicate the core settings and components of your application without starting from scratch. Cloning will create a new application with copies of the following:

- Your servers and services
- Your component configuration files (e.g. DB configs)
- Your environment variables

### Limitations of cloning an application

Cloning does not duplicate every aspect of your application. For example (but not limited to) it does not copy across any of the following:

- Data inside databases or replicas
- Database replication setups
- Load balancers
- Firewall rules
- Jobs
- SSL certifications

### How to clone an app

To clone an application, open the *Settings* page from the left-hand nav of your application and click *Clone* under the **Actions** panel. This will prompt you to choose a new application name and environment.

## Deleting an application

Deleting an application will not delete your cloud servers - remember to delete the servers from your cloud account.

To clone an application, open the *Settings* page from the left-hand nav of your application and click _Delete_ under the **Actions** panel. You will have to confirm this action.