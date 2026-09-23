# Adding memcached


[Memcached](https://memcached.org/) is an open source, high-performance, distributed memory object caching system, and it's easy to add to your application via the Cloud 66 Dashboard.

Cloud 66's Memcached component is designed for use with Rails and CSV1 (container stack, V1) applications. Newer containerized applications should implement [Memcached as a service](https://community.cloud66.com/t/how-do-i-add-memcached-to-my-application/54)

## Add Memcached

To add Memcached to your application:

1. Open your **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Data Sources* in the left-hand nav and then *Add Source* in the sub-nav
3. Click the green *+ Add Data Source* button and select *memcached*
4. A drawer will open from the left, with configuration options 
5. Click *Add Server* to start the process

You can now watch the logs, as usual to see the progress of the process.

## Customize Memcached
To customize Memcached, use the below syntax in your [manifest file](../manifest/what-is-a-manifest-file.md) and redeploy the application with `Apply security upgrades` option.

```shell
production:
    memcached:
        shared_group: db
        configuration:
            memory: 1024
            port: 11215
            listen_ip: 127.0.0.1
```

For containerized applications Memcached will be added to the host, not as a container.

## Check Memcached

You can find the details about Memcached under *Settings* in the left-hand nav. Since having Memcached as a separate server will not improve performance, Cloud 66 will install it on each web server, not as a standalone server.