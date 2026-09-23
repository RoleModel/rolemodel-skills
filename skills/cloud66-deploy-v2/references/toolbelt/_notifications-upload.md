# notifications upload


Uploads notifications in a YAML formatted file. Settings in the file will replace any existing settings. If an application group is specified, all of the apps in the group will be updated.

```shell
$ cx notifications upload [--stack <application name> | --application-group <group name>] --file <filename>
```

#### Options

| Arguments | Required? | Default | Description |
| --- | --- | --- | --- |
| -stack, -s \<application name\> | either/or | — | The name of the application to be updated  |
| --application-group, -a \<group name\> | either/or | — | The name of the application group to be updated |
| --file, -f \<filename\> | yes | — | The name of the file containing the notification settings that will be uploaded |

#### Examples

```shell
$ cx notifications upload -a production-group -f my-notification-settings.yml
```