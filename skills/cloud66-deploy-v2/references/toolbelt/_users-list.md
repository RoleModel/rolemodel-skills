# users list


Shows a list of all the users in an organization that you have rights to manage. You can find your `<organization name>` by using `cx info`.

```shell
$ cx --org <organization name> users list
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--org <organization name>` | yes | — | The email address associated with the user's Cloud 66 account |

#### Examples

```shell
$ cx --org my-org users list
```