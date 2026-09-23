# notifications download


Download all the alert settings for a given application as a YAML formatted file.

```shell
$ cx notifications download --stack <application name> --file <filename>
```

#### Options

| Arguments | Required? | Default | Description |
| --- | --- | --- | --- |
| -stack, -s \<application name\> | yes | — | The name of the application |
| --file, -f \<filename\> | yes | — | The name of the file in which the notification settings will be saved. |

#### Examples

```shell
$ cx notifications download -s my-stack --file my-stack-alerts.yml
```