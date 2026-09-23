# Using Web Application Firewalls


## Overview

Every application managed by Cloud 66 has a Web Application Firewall (WAF) automatically configured. The WAF runs on Nginx (which acts as a reverse proxy for all Cloud 66 applications) and is powered by [ModSecurity](https://github.com/SpiderLabs/ModSecurity). 

Your application's WAF is a **separate and different component** from the traditional (IP-table-based) [firewall](../security/firewall-rule.md) that we install on each server we provision. The WAF allows you to set up a richer and more customisable set of access rules for your application's components than would be possible with IP tables.

 Older applications will need to apply an [application update](../build-and-config/application-updates.md) to install the latest version of NGINX and the components that enable WAF. 

If the only rule you need to apply is to force all traffic to your servers to flow through your load balancer(s) then you can find that rule under [Traffic Filters](../networking/network-configuration.md).

## Configuring your Web Application Firewall

Your application's WAF relies on rules being added to its ModSecurity config file in order to manage traffic flows. We have provided two ways to add rules:

1. Manually, via the ModSecurity [CustomConfig](../custom-config/custom-config.md) file
2. Automatically using OWASP rules ([see below](#using-owasp-rules-with-your-waf))

You can add rules via either or both of these methods, though you should take care to ensure that the rules meet your applications traffic requirements.

### Enabling and disabling your WAF

You can enable or disable your WAF via your [Cloud 66 Dashboard](https://app.cloud66.com/):

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Web* in the left-hand nav
3. Click on *Traffic* in the sub nav
4. Click on the *Web Application Firewall* tab above the main panel
5. Check or uncheck the *Enable Web Application Firewall (via ModSecurity)* box 
6. Click *Review Changes* 
7. Review the rules that will be applied and then click *Apply Changes* 

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Application* in the left-hand nav
3. Click on *Traffic* in the sub nav
4. Click on the *Web Application Firewall* tab above the main panel
5. Check or uncheck the *Enable Web Application Firewall (via ModSecurity)* box 
6. Click *Review Changes* 
7. Review the rules that will be applied and then click *Apply Changes* 

Given the nature of firewalls, we strongly recommend you test any changes wherever possible, and that you check any configurations carefully before applying them. Incorrect or faulty rules can make your application inaccessible to your customers.

### Adding rules manually to ModSecurity

If you would like to apply custom rules to your WAF, you can do so by editing the ModSecurity CustomConfig file for that application. To do this:

1. Open your application via your [Dashboard](https://app.cloud66.com/)
2. Click through to one of your **web** or **application** servers
3. Click the *&#8615; More* button (top right of the panel) and select *NGINX Custom Config*.
4. Click on *NGINX - ModSecurity* in the top tab
5. Edit the config as needed and then click the green *Preview* button
6. Review the resulting (parsed) configuration template and, if it's correct, add a commit message and click *Commit to Server*.  

This will immediately apply the new rule to your Nginx server, so we recommend testing the change in a non-production environment beforehand. 

## Using OWASP rules with your WAF

The [Open Web Application Security Project](https://owasp.org/about/) (OWASP) is a nonprofit foundation that works to improve the security of software. The foundation provides a set of recommended rules for use with ModSecurity. You can apply these to your application's WAF via your [Cloud 66 Dashboard](https://app.cloud66.com/):

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Web* in the left-hand nav
3. Click on *Traffic* in the sub nav 
4. Click on the *OWASP Rules* tab above the main panel
6. Check all of the boxes next to the rules you would like to apply
7. Click *Review Changes* 
8. Review the changes to your configuration and click *Apply Changes* if you're satisfied, or the *Back to Edit link* at the top of the panel if you're not.

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Web* in the left-hand nav
3. Click on *Traffic* in the sub nav 
4. Click on the *OWASP Rules* tab above the main panel
6. Check all of the boxes next to the rules you would like to apply
7. Click *Review Changes* 
8. Review the changes to your configuration and click *Apply Changes* if you're satisfied, or the *Back to Edit link* at the top of the panel if you're not.

The OWASP rules will now be applied to your Nginx server, which will be reloaded as a result. 

### Applying "relevant configurations"

If the rule-set you added does have "relevant configuration sections", you should now review and update the OWASP [CustomConfig](../custom-config/custom-config.md) file accordingly. 

This config file is automatically included (nested) in the main ModSecurity config file for your application, so you should treat it with the same level of caution. To edit your OWASP config file: 

1. Open your application via your Dashboard
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on *Configuration Files* in the sub-nav that opens
4. Click on *NGINX - OWASP* in the tabs
5. Edit the config as needed and then click the green *Preview* button
6. Review the resulting (parsed) configuration template and, if it's correct, add a commit message and click *Commit to Server*.  

This will immediately apply the new rule to your Nginx server, so we recommend testing the change in a non-production environment beforehand.