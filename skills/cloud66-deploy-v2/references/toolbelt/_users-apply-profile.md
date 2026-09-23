# users apply profile


Apply Profile allows you to apply a user’s Access Profile to another one. To use this command you need to have an Access Profile as a `json` file. This can be generated using the `users show` command with the `json` option. Once you have the file you can modify it to make any changes you require in the Access Profile.

Any missing attribute for the `json` Access Profile will be left unchanged even if `override` is used. Also, `override` doesn’t have any effect on the contents of the `account_profile` section.

```shell
$ cx users apply-profile <user email> --json <access profile>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `<user email>` | yes | — | The email address associated with the user's Cloud 66 account |
| `--json <access profile>` | yes | — | The access profile to be applied to the user |
| `--override` | no | — | Will override the access rights instead of append |

#### Examples

```shell
$ cx --org My_Awesome_org users apply-profile jack@gmail.com --json /tmp/jim_profile.json
$ cx --org My_Awesome_org users apply-profile jack@gmail.com --json /tmp/jim_profile.json --override
```