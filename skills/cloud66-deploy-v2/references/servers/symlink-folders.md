# Using symbolic links


## Public folder

If it's acceptable to serve your files from your public directory, you can re-use the public/system folder which is already auto-symlinked to shared/system on each deploy. The down-side of doing this is that it bypasses your application and your files get served directly by Nginx without security.

## Symbolic link

Alternatively, you can use [deploy hooks](../deploy-hooks/deploy-hooks.md) to create the symbolic link. Also, you can use _$STACK_BASE_ for your stack base path (e.g. _$STACK_BASE/shared/uploads_) for your deploy hook script.

To create the symbolic link, your deploy hook script could contain this:

```shell
mkdir -p $STACK_BASE/shared/uploads
chown nginx:app_writers $STACK_BASE/shared/uploads
rm -rf $STACK_PATH/uploads
ln -nsf $STACK_BASE/shared/uploads $STACK_PATH/uploads
```
The reason we run _rm -rf_ on the _$STACK_PATH/uploads_ directory is due to the way that the _ln_ command works. When you issue the _ln_ command,
it places a link to the source directory inside the target directory, so we have to remove the directory before creating the symbolic link.

The deploy hook would look like this:

```yaml
production:
    after_symlink:
      - source: /.cloud66/my_script.sh
        destination: /tmp/my_script.sh
        target: rails
        execute: true
        sudo: true
        apply_during: all
        run_on: all_servers
```