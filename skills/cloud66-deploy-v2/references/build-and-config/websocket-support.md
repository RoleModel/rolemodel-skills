# Websocket Support


## Overview

WebSocket is a protocol that allows bi-directional web communication between client and server. You can configure your application to communicate via WebSocket using the method below.

AWS Classic Load Balancers do not support websockets natively. We recommend switching to one of Amazon's newer load balancers.

## Configuring for WebSocket

Cloud 66 opens ports **8080** and **8443** by default on your servers to allow you to use WebSocket. To work with optimally Cloud 66, your WebSocket servers need to listen to these ports.

To configure your Cloud 66 app to communicate with your WebSocket server, you need to set up your [Service's ports](../networking/service-networking.md#mapping-container-ports) to allow your container to communicate via port 8080 (or 8443 for TLS). 

For example, this service (**ws-app**) is running on port `3000`, and communicating with WebSocket via `8080`:

```yaml
    version: 2
    services:
      ws-app:
        ports:
        - container: 3000
          http: 8080
```    

Cloud 66 opens ports **8080** and **8443** (for TLS) by default on your servers to allow you to use WebSocket. To work with optimally Cloud 66, your WebSocket servers need to listen to these ports.

### Using custom ports for WebSocket

If necessary you can use different ports for WebSocket, but you will need to [manually open those ports](../networking/network-configuration.md#firewall)  on Cloud 66 to allow external connections to your servers. 

## Testing a WebSocket connection

To test if your WebSocket server is connecting to your application correctly, you can create a `/` file with the code below. Make sure to replace **your_address** with your WebSocket server IP address and finally, open it in a web browser.

```html
    
      
        ">
          
          $(document).ready(function(){
            function debug( str ) {
              $("#debug").append( str );
            }
    
            ws = new WebSocket("ws://your address");
            ws.onmessage = function(evt) {
              $("#msg").append("evt.data");
            };
            ws.onclose = function() {
              debug("socket closed");
            };
            ws.onopen = function() {
              debug("connected...");
              ws.send("hello server");
            };
          });
        
      
      
        
        
      
    
```
## WebSocket through a load balancer

You can use WebSocket if your application is using a load balancer, but you may need to make some configuration changes (depending on the load balancer). Cloud 66's default load balancer is HAProxy. 

### Using WebSocket via HAProxy

By default, all HAProxy servers configured by Cloud 66 will redirect all WebSocket traffic from ports **80** or **443** to ports **8080** or **8443** of your web servers, so it should work with no additional configuration (assuming your WebSocket server uses the default ports).

To bypass this redirection by HAProxy, you can connect your WebSocket servers via ports **8080** and **8443**. The HAProxy server is configured to pass through all traffic on ports **8080** and **8443** to the corresponding ports on the web servers.

### Using WebSocket via native cloud load balancers

If you have manually set up a native load balancer with your cloud provider, and you are using it to distribute traffic to your application, you should consult your cloud provider's documentation to ensure you've configured the load balancer to handle WebSocket traffic appropriately.