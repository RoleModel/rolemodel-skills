# Remove passphrase from certificate key


## Overview

Nginx does not support password protected certificate keys for SSL. If your keys are already password protected, you can remove them using the method below.

This method applies to OpenSSL. If you are using another SSL library or provider then this method will not apply. 

## Removing a passphrase using OpenSSL

1. Copy the private key file into your OpenSSL directory (or specify the path in the command below).

2. Run this command:
`openssl rsa -in [original.key] -out [new.key]`

3. Enter the passphrase for the original key when asked

4. The output file [new.key] should now be unencrypted. To verify this open the file with a text editor and check the headers.

Encrypted headers look like this:
```shell
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED DEK-Info: DES-EDE3-CBC,

6BD407785DD187EF...
-----END RSA PRIVATE KEY-----
```

Unencrypted headers look like this:
```shell
-----BEGIN RSA PRIVATE KEY-----
6BD407785DD187EF...
-----END RSA PRIVATE KEY-----
```