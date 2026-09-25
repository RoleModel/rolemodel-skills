# What is a manifest file?


## What is a manifest file?

A manifest files allows you to be more explicit about your application composition and control settings that are not usually available through the user interface or Cloud 66 toolbelt. The file describes the setup of the components that make up your application.

These are just some examples of the settings you can control with a manifest file:

- Defining sizes and data center region for your servers
- Installing extra packages
- Specifying the version of a component
- Configuring application components to share a server
- Customizing component-specific configurations

    ## How do I use a manifest file?

    Manifest settings are defined in a file called `manifest.yml`. For Rails/Rack applications the path for `manifest.yml` is:

    ```shell
    <application-root>/.cloud66/manifest.yml
        ```

        To get started:

        1. Add this file to your code
        2. Populate it with appropriate values (see below for examples)
        3. Commit your changes to your repository
        4. Build your application

    ## Editing a manifest file

    Every application automatically has a manifest file. To edit the manifest file for a containerized application:

    1. Navigate to the application for the app in question
    2. Click on ⚙️ *Settings* in the left-hand nav
    3. Click on *Manifest File* in the sub-nav that opens

    You can now edit the text of your manifest file directly.

    Be cautious when editing the manifest file for any application particularly if it is running in a production environment. A single stray character or space can cause the application to fail to deploy or to deploy in a degraded state.

    The manifest file is YAML formatted. You can check its validity at [YAML Validator](https://codebeautify.org/yaml-validator) or with this command:
    `$ ruby -e "require 'yaml'; YAML.load_file('.cloud66/manifest.yml')"`