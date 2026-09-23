# Load testing


## Load testing

To ensure that your application performs well under pressure, you may find load testing services like [K6](https://k6.io/) useful. There are also open source tools like [AB](https://httpd.apache.org/docs/current/programs/ab/) to load test your applications.

We use [Fail2Ban](https://www.fail2ban.org/wiki/index.php/Main_Page) to protect your servers from malicious activity, and load testing servers often trigger security blocks. As such, before you start load testing, please [SSH to your servers](../servers/ssh-to-server.md) and disable Fail2Ban temporarily by issuing `fail2ban-client stop`. Once your testing is done, you can start it again with `fail2ban-client start`.

Your application performance is dependant on many factors, such as code efficiency, server performance, networking and so on. Answering these two questions helps us gauge your requirements and recommend a custom solution:

1.  What is the desired traffic level you want to be able to handle (e.g. users/sec)?
2.  What is the average response time of your application?

As an example, an application that takes 1 second to respond and which is running on a server with 1 worker (thread) would need 1,000 servers to handle 1,000 concurrent connections. If your servers have 10 workers, you would need 100 servers. The more workers you have, the more resources you require, and consequently the more concurrent requests you can handle.

Determining the number of Unicorn workers you can have on your server [depends on many factors](https://stackoverflow.com/questions/11056362/unicorn-which-number-of-worker-processes-to-use) (e.g. what types of operations your application is performing), so it's good to test this to find a sweet spot. You can generally test using up to 5 times the number of cores for your workers during a load test to see how it's handled (e.g. 2 cores = up to 10 workers). [Set the number of Unicorn workers](https://bogomips.org/unicorn/) in your `config/unicorn.rb` file.

## Preparing for server load

There are a number of steps you can take when expecting an increase in server load. It's always best to scale _before_ you need it - the relative cost for more servers for a few days is worth more than the potential lost traffic, and you can always scale down easily.

1.  [Add a load balancer to your application](../load-balancers/load-balancer.md), and point your DNS to it. It will distribute traffic across your web servers, and offers benefits such as maximizing throughoutput, minimizing response times and avoiding overload on any single server.
2.  [Scale your application servers horizontally](../servers/scaling.md) to the extent that you require.
3. [Monitor your servers](../build-and-config/setting-up-custom-livelogs.md) to ensure that they are able to serve your users.