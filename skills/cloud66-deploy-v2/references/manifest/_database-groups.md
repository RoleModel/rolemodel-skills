# Database Groups


## Database Groups

Database groups allow you to run multiple separate instances of the same database type, each with their own configuration. This is useful when you need different versions or configurations of the same database for different purposes.

The `groups` setting is used to define these separate database instances. The name of each group in your Manifest must match the names configured in your Dashboard.

### Supported Databases

Database groups are supported for:
- MySQL
- PostgreSQL
- MongoDB
- Redis
- ElasticSearch

### Example: Multiple MySQL Groups

```yaml
mysql:
  groups:
    default:
      configuration:
        version: 5.7
        root_disk_size: 100
      servers:
      - server:
          unique_name: mysql-main
          size: m3.medium
    analytics:
      configuration:
        version: 8.0
        root_disk_size: 500
        engine: percona
      servers:
      - server:
          unique_name: mysql-analytics
          size: m3.xlarge
```

### Example: Multiple Redis Groups

```yaml
redis:
  groups:
    cache:
      configuration:
        version: 5.0.5
      servers:
      - server:
          unique_name: redis-cache
          size: m3.small
    sessions:
      configuration:
        version: 6.0.0
      servers:
      - server:
          unique_name: redis-sessions
          size: m3.medium
```

### Important Notes

- Group names must match exactly with those configured in your Dashboard
- Each group can have its own version, configuration, and server specifications
- The `default` group is typically used as the primary database instance
- You can run different versions of the same database in parallel using groups

For more information about attaching and managing multiple databases, please see our [guide on attaching multiple databases](../databases/attaching-multiple-databases.md).