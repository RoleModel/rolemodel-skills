# Memcached Configuration


## Memcached

[Memcached](https://memcached.org/) is a general-purpose distributed memory-caching system. It is often used to speed up dynamic database-driven websites by caching data and objects in RAM to reduce the number of times an external data source must be read.

The following settings are available via the Manifest file :

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`listen_ip`||Specify which IP address to listen on (default value is `0.0.0.0`)|All|
|`memory`||Specify maximum memory (in MB) that can be used (default is `64`)|All|
|`port`||Specify connection port (default is `11211`)|All|

### Example YAML for Memcached

```yaml
memcached:
  configuration:
    memory: 1024
    port: 11211
    listen_ip: 127.0.0.1
```