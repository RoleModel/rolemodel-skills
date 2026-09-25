# Zero-downtime deployments


Depending on your application and requirements, you can achieve zero-downtime deployments in a number of ways.

## 1. Using a web server that supports hot rollover
Using a web server like Unicorn or Passenger Enterprise would allow you to achieve zero-downtime deployments even with a single application server. For example, with Unicorn, when you redeploy your application, we send a USR2 signal to Unicorn which tells it to:

* Fire up a new master in parallel
* Fire up new worker processes under the new master
* Quiet and shut down old worker processes
* Shut down the existing master

## 2. Deploying in serial

When you have a load balancer in front of your application servers, you can choose to deploy in serial. This would involve removing one server at a time from the load balancer, deploying your code to it and then re-adding it to the load balancer.

Assuming that you have more than one application server, this means that there will always be at least one server to respond to user requests while another server is being updated.

This is slightly more complicated if you're using Passenger as a web server, as depending on the size of your application, the Passenger warm-up time can be longer than each server deployment. This would result in application load time being visible to the visitor. Passenger load time does not bounce the server, but only holds sessions in a queue. This means that traffic is served with delay and as long as the application loads in a time shorter than the HTTP timeout, the user will see no errors.

There are a number of (non-optimal) ways to get around this, but ultimately we suggest using option 1.