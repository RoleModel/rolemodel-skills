# Seeding your database


## Seed script

Simply add a bash script to your repository that contains the script for seeding your database.

This could be a *custom script*, a *custom rake command*, or the default Rails `rake db:seed command` depending on your requirements/implementation.
In our example, we will use the default Rails [rake db:seed command](https://edgeguides.rubyonrails.org/migrations#migrations-and-seed-data).

Create the file `/.cloud66/dbseed.sh` as below:

```shell
#!/bin/bash
cd $STACK_PATH
bundle exec rake db:seed
```

Create a *custom script* with the following content:

Create the file `/.cloud66/dbseed.sh` as below:

```shell
#!/bin/bash
# Read SQL file into database
mysql -u $DB_USER -p$DB_PASS $DB_NAME < /path/to/seed.sql

# Or for PostgreSQL
PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d $DB_NAME -f /path/to/seed.sql
```

## Deploy hook

Add a deploy hook to execute the above script during the first deploy (on the first server only).

Create the file `.cloud66/deploy_hooks.yml` as below (replacing *production* with your target environment).

```yaml
production:
  after_symlink: # Or use after_rails depending on your application
    - source: /.cloud66/dbseed.sh
      destination: /tmp/dbseed.sh
      target: rails # or deploy or a specific server group
      execute: true
      run_on: single_server
      apply_during: build_only
```

## Note

The deploy hook example above will only execute during the _build_ for a new application. If you want to seed an existing application you could either

*   Execute the seed command manually, or
*   Change the `apply_during` specification of the deploy hook (could be used for DB data resets during subsequent testing deploys for instance)