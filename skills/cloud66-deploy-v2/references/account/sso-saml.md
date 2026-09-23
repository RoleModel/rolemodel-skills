# Single Sign-On, SAML and Automatic User Provisioning


## Overview

Depending on your plan type, Cloud 66 supports both Single Sign-On (SSO) via SAML and Automatic User Provisioning (AUP). 

- Automatic User Provisioning - Team plans (and above)
- SSO via SAML - Business plans

## Automatic User Provisioning

Account owners can enable AUP for their Cloud 66 organization for *either* of these two signup methods:

1. Sign-ups that use i.e that use the “Google” button when creating an account
2. Sign-ups via SAML (see the Configuring AUP with SSO section)

### What is AUP?

Automatic User Provisioning assigns a set of predefined permissions to any new team members that meet on of these predefined criteria: 

- *Either* their email address is from a verified domain
- *Or* they sign in via an SSO-enabled account

It acts as a kind of open, “forward looking” invitation to any eligible user who meets one of these criteria. 

### Setting up AUP for Google sign-ups

Automatic User Provisioning for Google sign-ups is based on the **email domain** associated with the Google account. 

In other words, you would specify your organization’s domain (e.g. “mycompany.net”) and then any sign-ups from Google accounts that use email addresses with that domain will be automatically added to your Cloud 66 account.

To set up AUP for Google sign-ups

1. Verify of your organization’s email domain
2. Configure AUP settings

Follow the instructions below to do both:

### Domain verification

You must verify any domain before you can use it for Google-based AUP. To do this, you will need to add a TXT record to your DNS by following these steps:

1. Log into your [Cloud 66 Dashboard ](https://app.cloud66.com/)
2. Click on your avatar (top right) and choose *Account Settings*
3. Click on *Verified Domains* in the **Settings** panel on the left
4. Copy the unique TXT record provided at the top of the page
5. Log into the DNS management interface of your domain provider
6. Add the TXT record you copied above at the root level of the domain (usually denoted as`@`) and submit it. If you’re not sure how to add a TXT record, check the help docs of your domain provider.
7. Go back to Cloud 66, input your domain name and click *Add Domain* 
8. We’ll test your domain repeatedly for a day or two. You can click on the *Domain Verification Running* link to see the logs from our attempts.

If your domain is not verified within a couple of days. You can manually trigger a check by using the retry button that will appear if the first attempt at verification fails.

Once your domain is verified, you can configure AUP for your organization (see the next section). 

### Configuring AUP settings for Google sign-ups

To configure AUP for Google sign-ups:

1. Log into your [Cloud 66 Dashboard](https://app.cloud66.com/) 
2. Click on your avatar (top right) and choose Account Settings
3. Click on *Members* in the **Collaboration** panel on the left
4. Find your verified domain in the **Automatic User Provisioning for Verified Domains** panel and click the *Setup Rules* button next to the domain in question
5. Set default permissions for automatically provisioned accounts 
6. Click *Save Rules* at the bottom of the page

You can have different AUP policies for different verified domains. Only one AUP policy can be linked to a each verified domain.

You can edit an existing AUP by clicking the edit icon (pencil and paper) or remove AUP for an SSO provider by clicking the delete icon (trashcan).

AUP will now begin working for all new sign-ups to Cloud 66 that use your email domain. 

Permissions granted when you configure AUP only apply to signups that happen after configuration. Any team member provisioned individually, using a different AUP configuration will not have their permissions changed. Updating existing AUP permissions will not affect the permissions of accounts that signed up before the update.

## SSO integration

Cloud 66 uses Security Assertion Markup Language (SAML) to enable Single Sign-On (SSO). We support any SAML-compatible external Identity Provider (IdP) - including Okta, Auth0, OneLogin, Microsoft, Google and thousands more. You can have **multiple SAML integrations** per Cloud 66 organization. 

Setting up a SAML integration with your preferred IdP requires two things:

1. Configuring your Identity Provider (IdP) to recognise Cloud 66 as a Service Provider (SP)
2. Configuring your Cloud 66 account with details of your (SAML) IdP

You can enable SSO without automatic user provisioning. In that case users will need to sign up for Cloud 66 accounts using the email associated with their SSO credentials and you can then manually add them to your team and provision them as per usual.

These are the official guides for some popular SAML IdPs:

- [Google (Workspace) SSO](https://support.google.com/a/answer/12032922?hl=en) and [custom SAML application](https://support.google.com/a/answer/6087519?hl=en&ref_topic=7559288&sjid=8610277301201604403-EU) guides
- [Okta SAML app guide](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm) and [field reference guide](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- Microsoft Azure AD [add enterprise application](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/add-application-portal) and [enable SSO for an enterprise app](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/add-application-portal-setup-sso) guides
- [OneLogin Advanced Custom Connector](https://onelogin.service-now.com/support?id=kb_article&sys_id=8a1f3d501b392510c12a41d5ec4bcbcc&kb_category=93e869b0db185340d5505eea4b961934) guide

### Configuring Cloud 66 as a SAML Service Provider

Your SAML Identity Provider (IdP) needs to be configured to recognize Cloud 66 as an approved Service Provider (SP) for your IdP account. This requires two URLs: 

- An ACS URL
- An Entity URL

Cloud 66 also requires your IdP to send a custom **email attribute** in its SAML assertion. This attribute tells Cloud 66 which email address to sign the user in with (see below for details).

Different IdPs have different names for the configuration URLs, here are some examples

| IdP | ACS URL name | Entity URL name |
| --- | --- | --- |
| Okta | Single sign-on URL | Audience URI |
| OneLogin | ACS (Consumer) URL and Recipient | Audience |
| Auth0 | Post-back URL | Entity ID |
| Google | ACS URL | Entity ID |
| Microsoft (Azure AD) | Reply URL | Identifier |

The values for Cloud 66 are the same for all accounts:

- ACS URL: `https://app.cloud66.com/users/saml/auth`
- Entity URL: `https://app.cloud66.com/users/saml/metadata`
- If there’s an option for “Signed response” you should select / enable it

Name this attribute `email`. Cloud 66 identifies users by it and does **not** read or validate the SAML NameID, so you don’t need to set a specific NameID format - just make sure your IdP sends the `email` attribute.

If your IdP is Microsoft Entra ID (formerly Azure AD), the attribute must be named `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` instead of `email`. Every other IdP uses `email`.

To configure your IdP: 

1. Log into the admin interface 
2. Follow the instructions to add a new SAML service provider (also known as an “application”). 

Once Cloud 66 is set up as an SP you can move onto the next step.

### Connecting your Cloud 66 account to your IdP

Now that your IdP will recognize your Cloud 66 account, you need to point your account at that IdP to allow the exchange of credentials. To do this, you’ll first need to add some information from your IdP to your Cloud 66 account:

- An Entity ID (usually a URL)
- An SSO URL
- A certificate **or** fingerprint (and algorithm)

You’ll notice the names of these URLs are very similar (or identical) to the ones used to set up an SP. This can be confusing, so be sure you are looking at the fields for **Identity Provider** (and not Service Provider) - many SSO platforms can act as either SPs or IdPs (or even both). It’s needlessly confusing, we know. 

If your IdP uses fingerprints rather than certificates, you will need to specify a fingerprinting algorithm. We currently support SHA1, SHA256, SHA384 and SHA512

Once you have found all of the above info, you will need to add it to your Cloud 66 accounts. Do this this:

1. Log into your [Cloud 66 Dashboard](https://app.cloud66.com/) 
2. Click on your avatar (top right) and choose Account Settings
3. Click on *Login & Security* in the **Account** panel on the left
4. Scroll down to the form and add the required info
5. Click the *Add SAML Single Sign-On* button

You should now see your provider listed in the Single Sign-On Providers panel. 

We strongly recommend thoroughly testing that SSO works before beginning to enforce it. Most IdPs have a test mechanism in their admin interfaces.

By default existing users can continue to log into their accounts with their old credentials as well as SAML. Account owners can limit this for existing users by enabling the [SSO-only setting](#enforcing-sso-only-logins) on their account. Users created with SAML SSO will only be able to login with SAML.

### Signing in via SSO

To sign into Cloud 66 via SSO you will need to use **the URL provided by your IdP**, which you’ll find on their admin dashboard. It will be under the Cloud 66 application (or service) that you configured in the first step above.

If you enforce SSO-only sign-ins (see next section) then you will not be able to use the normal Cloud 66 login page - you will be forced to use the SSO URL. 

### Enforcing SSO-only logins

You can force all your team members to use SSO for added security. To enable this:

1. Log into your [Cloud 66 Dashboard](https://app.cloud66.com/) 
2. Click on your avatar (top right) and choose Account Settings
3. Click on *Login & Security* in the **Account** panel on the left
4. Click on the *Enable SSO Only* button (at the bottom of the page)

You can disable this mode using the same steps. 

### Configuring AUP with SSO

You can set up automatic user provisioning for anyone with SSO credentials. To do this, first set up SSO (see above) and then:

1. Log into your [Cloud 66 Dashboard ](https://app.cloud66.com/)
2. Click on your avatar (top right) and choose Account Settings
3. Click on *Members* in the **Collaboration** panel on the left
4. Find the SSO provider in the **Automatic User Provisioning for Single Sign-On Providers** panel and click the *Setup Rules* button
5. Set default permissions for automatically provisioned accounts 
6. Click *Save Rules* at the bottom of the page

You can have different AUP policies for different SAML providers, and thus grant different access rights to users based on their SSO provider. Only one AUP policy can be linked to a each SAML configuration.

You can edit an existing AUP by clicking the edit icon (pencil and paper) or remove AUP for an SSO provider by clicking the delete icon (trashcan).

### Account switching for SAML users

All accounts on Cloud 66 have their personal logins, but can be members of other organizations. If a user is a member of a SAML-only organization, they will not be able to switch to that organization in the Cloud 66 dashboard if they are not logged in using SAML. They will need to log out and log back in using SAML before they will be able switch.

If a user logs in via SAML (SSO), they can switch to organizations (including their personal one) that have lower security requirements.

### Two-factor authentication (2FA) and SAML

Logins via SAML are exempt from 2FA requirements. If 2FA or FIDO keys are setup on a login, they will not be used if the user logs in with SAML. If SSO-only is not enabled, non-SAML logins will still be subject to the organization’s 2FA requirements.