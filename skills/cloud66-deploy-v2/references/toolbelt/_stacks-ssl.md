# stacks ssl


Add an SSL certificate to a stack.

```shell
$ cx stacks ssl --stack <application name> --type <certificate type> --domain <domain name> --ssl-termination --cert <certificate file> --key <SSL key file> --intermediate <intermediate cert file> --overwrite
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | The application name |
| `--type <certificate type>` | yes | — | The type of certificate (lets_encrypt or manual) |
| `--domain <domain name>` | Depends on --type | — | Domain name applicable to this SSL certificate (required for  lets_encrypt, optional for manual). Repeatable for multiple domains |
| `--ssl-termination` | no | — | Enable SSL termination |
| `--cert <certificate file>` | Depends on --type | — | SSL certificate file path (required for manual) |
| `--key <SSL key file>` | Depends on --type | — | SSL key file path (required for manual) |
| `--intermediate <intermediate cert file>` | no | — | SSL intermediate certificate file path |
| `--overwrite` | yes, if cert already exists | — | Required confirmation flag to update an existing SSL certificate |

#### Examples

```shell
$ cx stacks ssl add -s my-stack --type lets_encrypt --domain 'web.domain.com' --domain 'api.domain.com' --overwrite

$ cx stacks ssl add -s my-stack --type manual --cert /certs/my_certificate --key /ssl/my_key --intermediate /certs/my_intermediate_cert
```