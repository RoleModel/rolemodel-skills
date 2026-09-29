# Advanced firewall rules


## Overview

Cloud 66 manages your basic firewall rules for each application automatically, but some applications need more advanced setups - in particular if they need access to your other applications on Cloud 66. In this guide we explore some advanced options for firewalling.

This guide assumes you already know the basics of working with firewall rules on Cloud 66. If you don't, please read the [tutorial on the subject](../security/firewall-rule.md). 

## Understanding automated rules

The automated firewall rules on your applications are **role-based** rather than **IP-based**. This means that when you add, for example, a new MySQL server it will be automatically added to your firewall rules.

This means you don't need to individually configure native components or servers within a Cloud 66 application - they will inherit rules from your existing roles. This logic also applies when components are removed - they will automatically be removed from your firewall.

However, what if you have two applications on Cloud 66 that need to communicate with each other? These basic automated rules cannot automatically deal with that use-case, but our cross-application rules (see below) allow a very similar level of automation once they are set up.

## Cross-application firewall rules

All Cloud 66 applications can be configured to allow communication with components from other applications on your account. This allows you to have, for example, completely separate applications for your frontend and backend, or to allow limited communication between the dev and live versions of an application. 

To set up a cross-application rule, you will need:

- At least two separate applications running in Cloud 66
- Admin access on each of the applications in question
- A working knowledge of the [basics of firewall](../security/firewall-rule.md) rules on Cloud 66

### Example of a cross-application firewall rule

In this example we are giving the web server of one application access to all the MySQL servers on another application. To do this we would:

1. Open your Cloud 66 [Dashboard](https://app.cloud66.com/dashboard)
2. Click on the **source** application (the one with the MySQL server)
3. Click on *Network* in the left-hand nav
4. Click on the green *+ Add a new firewall rule* button
5. In the *From* dropdown, find the name of the **requesting** web server that needs to access the databases and select it.
6. In the *To* dropdown, select **MySQL Servers**
7.  Set the *Protocol* to **TCP**
8. Set the *Port* to **3306** 
9. Click the green *Apply Rules* button.

Now wait a few minutes to allow the rules to propagate and you will have access to any of the MySQL servers on the source application via their IP addresses.

### Automated updates for cross-application firewall rules

If you have set up a role-based cross-application rule like the one above, any changes to the source servers will be automatically propagated to the firewall rules as new servers are added or existing ones removed.

The obvious caveat to this is if you remove all the servers for that particular role, or delete the **source** application. This will, as expected, cause problems for any **requesting** applications.