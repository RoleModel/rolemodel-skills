# ssh_config


Displays and/or sets the public key associated with your Cloud 66 account.

```shell
$ cx ssh-config get-public-key
$ cx ssh-config set-public-key --public-key "<full contents of public SSH key file>"
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `get-public-key` | either/or | — | Prints the contents of the public SSH key currently added to your Cloud 66 account |
| `set-public-key` | either/or | — | Sets a public SSH key for your Cloud 66 account. Requires the `--public-key` argument below.  |
| `--public-key` | no | — | The full contents of the public SSH key. Normally begins `ssh-ed25519...` or `ssh-rsa` |

#### Examples

```shell
$ cx ssh-config set-public-key --public-key "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDCalpYu7uLUGhZyzXvgFE4eDO6y0rrdMIgy7yOC0XnOZm+bctQDd/QsQhg7F4EgoXPnMvsNIB44bVb3cFd3MEVKZXd745kYMK2RqcGPz5SfbN5eCpaPyW9Mmcb2bEUrT7VO0/BUkf+QxQKTwkwPkG7i3uoQ5Ks7QEua25UoaiOqMseurq1tkP3gTwMXzl9rpUCN5eHbH+wjbvBEC/G1JY8F3j07lHL+U/0EhCSfs8DHmuAe/SnXdD0rVKVd5xAMv/DXf2+QhoXscI0meMNxRTNqTdO8Mnx+z1o0rV5/WB3ZTHTS2y8txEB2lVUrjv+fYqJQe6X0h8cWTHicAaJa0X7"
```