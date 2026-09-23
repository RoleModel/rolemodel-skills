# Integration with Circle CI


You can use Circle CI to accomplish continuous integration and deployment of your application together with Cloud 66.

To get your build hooked up to Circle CI, you need to use the [redeployment hook](../deployment/redeployment-hook.md) provided by Cloud 66:

1. Open your application's Overview page
2. Click on *Settings* in the left-hand nav
3. Click on the *Information* tab
4. Copy the **Redeployment Hook** URL
5. Add the URL to your Circle CI pipeline (refer to the [Circle CI documentation](https://circleci.com/docs/configuration) for more information).