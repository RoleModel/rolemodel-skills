# Sharing databases between applications


Ensure that you **do not** select the option for `db:schema:load` during the build of your second application, as this could destroy the data on the first application.

Firstly, you need to [open your firewall](../security/firewall-rule.md) on the first application to allow your second application's web servers to access the database.

You will then reference the database credentials from your first application in the database.yml of your second application. You can reference the environment variables for these credentials on your first application as follows:

```shell
{{ APP[APP_UID].ENV_VAR }}
```
(your application UID is available under the **Information** tab of your *Settings* page)

For example, your environment variables would be set like this:

```shell
MYSQL_ADDRESS={{ APP[xyz].MYSQL_ADDRESS_INT }}
MYSQL_DATABASE={{ APP[xyz].MYSQL_DATABASE }}
```

Database credentials such as username and password are not available for cross-application referencing for security reasons. Instead, copy and paste them across as environment variables. Your database.yml would look something like this:

```yaml
host: \<%= ENV['MYSQL_ADDRESS'] %\>
username: \<%= ENV['MYSQL_USERNAME'] %\>
password: \<%= ENV['MYSQL_PASSWORD'] %\>
database: \<%= ENV['MYSQL_DATABASE'] %\>
```