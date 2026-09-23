# Generating local SSH keys


## Generate Keys on Linux and Mac

You can access your servers (managed by Cloud 66) using SSH (Secure Shell Protocol). When you [connect via SSH](../servers/ssh-to-server.md), you will authenticate using a private key file on your local machine. As such you need to create your own SSH key. To do this:

You can now [add your public key](../servers/ssh-to-server.md#adding-your-public-key-to-your-cloud-66-account) to your Cloud 66 account, and connect to your servers via SSH. The quickest and easiest way to to this is using your Toolbelt's [`ssh` command](../toolbelt/_ssh.md).

## Generate Keys on Windows

If you're using PuTTY in Windows for SSH services, you can still use SSH keys. PuTTY can generate keys using the puttygen program, [download PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/).

[More information regarding SSH Keys](http://library.linode.com/security/ssh-keys)