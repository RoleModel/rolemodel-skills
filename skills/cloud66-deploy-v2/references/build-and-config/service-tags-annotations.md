# Service Tags and Annotations


## Service tags

Service Tags are arbitrary strings of text which you can add to your services. When a service is deployed, these tags are transformed into [Kubernetes labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). 

Service Tags are added via the `tags` key in your service definition (`service.yml`). They are formatted as an array of strings that can have an optional key/value delimiter of `=` or `:`. Because they are propagated into Kubernetes, tags must follow the [Kubernetes requirements](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels#syntax-and-character-set) for label string formats. Cloud 66 will warn you if your tags do not conform to these requirements.

Example:

```yaml
service:
  service-name:
    ...
    tags:
    - "environment=production"
    - "customer:fred"
    - "highvisibility"
```
(Read [our guide to using service.yml](../build-and-config/docker-service-configuration.md) for more help on customizing your service configuration.)

When you deploy the service defined above, the following labels will be added to your Kubernetes Workload Resources for this service (ie. Deployments, Daemonsets, Jobs and Pods):

```yaml
metadata:
  ...
  labels:
    ...
    environment: "production"
    customer: "fred"
    highvisibility: ""
```

Kubernetes expects a key/value pair for every label, so if one of your tags does not have a `=` or `:` delimiter we will create a label with an empty key value. You can see an example of this above with the `highvisibility` tag.

 Cloud 66 will add some additional labels automatically to ensure your selectors are configured correctly. 

## Service Annotations

Service Annotations are a collections of arbitrary key/value pairs. When a service is deployed, these collections are transformed into [Kubernetes annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/). 

Service Annotations are added via the `annotations` key in your service definition (`service.yml`). They are a hash of the key/value pairs. Because they are propagated into Kubernetes, annotations must follow the [Kubernetes requirements](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations#syntax-and-character-set) for annotation formats. Cloud 66 will warn you if your annotations do not conform.

Example:

```yaml
service:
  service-name:
    ...
    annotations:
      me.com/environment: "production"
      me.com/customer: "fred"
      visibility: "high"
```

When you deploy the service defined above, the following annotations will be added to your Kubernetes Workload Resources for this service (ie. Deployments, Daemonsets, Jobs and Pods):

```yaml
metadata:
  ...
  annotations:
    ...
    me.com/environment: "production"
    me.com/customer: "fred"
    visibility: "high"
```

Cloud 66 will add some additional annotations automatically for internal use.