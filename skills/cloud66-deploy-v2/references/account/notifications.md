# Setting up Account Notifications


## Available settings

You can control when and how you would like to receive notifications from Cloud 66. There is a range of events that trigger notifications, which can be sent as emails or via Slack or Webhooks.

## Editing account notifications

1. Open your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click on *Notifications* in the left panel
4. Click on the tab for the notification type (either *Account notification* or *Application notifications*)
5. Next to each notification type, click on the icon(s) of the channel through which you want to be notified. (Clicking the icons of already active channels deactivates them)

 If you would prefer for your billing notifications to go straight to your finance team, you should [create a Finance user](../account/team-accounts.md#finance-users) using their email address, and then (optionally) deactivate finance notifications to your primary account. 

## Notification channels

### Browser notifications

Browser notifications use HTML5 to notify you of your selected events directly in supported browsers. Once enabled, your browser will ask your permission for these notifications to be shown.

### Emails

Email notifications are enabled by default for all users. By default, you will get an email for a number of events, with the exception of _account suspended_ notifications. You can easily turn email notifications _on_ or _off_ for each type by clicking on the email icon.

### Slack

[Slack](https://slack.com/) is a real-time messaging, archiving and search application developed by Tiny Speck.

Visit the Slack [Integrations page](https://slack.com/integrations) and select the Cloud 66 integration. Choose the channel you would like to receive notifications in (or create a new one), and click _Add Cloud 66 Integration_. You will then receive a URL, which you can provide in Cloud 66 integration modal.

### Webhooks

The [Webhooks](https://www.webhooks.org/) standard uses HTTP POST to connect different systems, and is very simple to use but very powerful.

All notification types from Cloud 66 can trigger a webhook. To setup your webhook, click on the _Webhook_ icon. There you can enter the URL for your webhook endpoint and test it to see how it behaves.

Each event type has its own payload that is sent to the endpoint via HTTP POST. The payload is the same as the one used with the API with two additional fields: _timestamp_ and _event_type.

For a detailed list of webhooks, event types and  payloads please see our [developers documentation](https://developers.cloud66.com).

## Service account notifications

Service accounts let you centralize your Slack notifications under a single account, so that people can leave and join your team(s) without any danger of disrupting or duplicating your notifications. 

Unlike normal account notifications, service account notifications are set at **application** level, rather than at **account** level. You can receive service account notifications via Slack or webhooks, but not via email because service accounts don't have (real) email addresses associated with them. 

For more detail on setting up service accounts please read our [separate guide](../account/service-accounts.md).

### Slack notifications for service accounts

To set up Slack notifications for a service account:

1. Ensure you have set up Slack as a notification channel
2. Create a service account & assign it permissions for the application
3. Open the application and click *Settings* in the left-hand nav
4. Click the *Notifications* tab
5. Click on the *Switch User* dropdown at the top-right of the **Personal Notifications** panel and select the service account
6. Click on the Slack icons next to the notifications you wish to enable

### Webhooks for service accounts

To set up webhooks for a service account:

1. Create a service account & assign it permissions for the application
2. Open the application and click *Settings* in the left-hand nav
3. Click the *Notifications* tab
4. Click on the *Switch User* dropdown at the top-right of the **Personal Notifications** panel and select the service account
5. Click on the Webhook icon next to a notification trigger that you wish to enable
6. Paste in the URL of the webhook you wish to call when that trigger occurs, and click *Enable Webhook*
7. Repeat for any other webhooks you would like to set up

### Copying notification settings between apps

Since service account notifications are at application level, it would be time consuming to drill down into each app one at a time to check on the settings. Instead you can use the admin interface to view and copy settings between your applications. To access the admin interface:

1. Click your avatar at the top right of the screen and then *Account Settings*
2. Click on *Notifications* in the **Account** panel on the left
3. Click the *Service Account Notifications* tab at the top of the main panel
4. Type in the **service account** you want to query in the format `user:username` and/or type in the name of the **app** that you wish to query in the format `app:app-name` 
5. You will now see a list of all of the apps that match your filter(s), along with the current notification settings for each one - you can copy notifications **into** an application by clicking the copy icon at the top-right of each application panel
6. A drawer will open from the left with dropdown that lets you select the source of the notifications (i.e. one of your other apps) that you want to copy
7. Check the notification settings are correct and then click the *Copy* button