# users show


Returns details about a user. You can dump these as a json file for use with the `users apply-profile` function.

```shell
$ cx users show <user email> --json <filename>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `<user email>` | yes | — | The email address associated with the user's Cloud 66 account |
| `--json <filename>` | no | — | Dumps the profile data as a json formatted file. |

#### Examples

```shell
$ cx users show jim@gmail.com --json /tmp/jim_profile.json
```