# Cloud 66 Deploy v2 vs v3


Cloud 66 Deploy v3 is a major upgrade from Deploy v2, designed to offer more flexibility, reliability, and alignment with modern Kubernetes practices.

Both versions share the same foundation: Kubernetes, BuildGrid for building container images, a hosted image repository, and support for both AMD and ARM CPUs, but each has its own strengths.

Deploy v3 introduces a new architecture that better meets today’s operational and cost requirements, while Deploy v2 continues to provide mature features that remain valuable for many use cases.

## Deploy v2: How It Works

Deploy v2 builds a managed Kubernetes cluster across a group of servers. These servers can function as:

* **Master nodes** (handling control plane tasks),
* **Worker nodes** (running application workloads), or
* **Shared nodes** (performing both roles).

Key characteristics of Deploy v2:

* Clusters are tightly coupled to the underlying servers.
* Scaling or changing availability requires manual adjustments at the server level.
* Offers a wide set of proven features developed over several years.

Deploy v2 remains a solid choice for workloads that depend on its mature feature set or require capabilities not yet covered by v3.

## Deploy v3: What’s New

Deploy v3 introduces **two cluster types** to provide clearer options based on cost and reliability:

* **Reduced Availability (RA)**

* Lower server requirements and reduced Cloud 66 per‑cluster pricing (TBD).
* Well suited for development, testing, or smaller production workloads.
* Provides limited redundancy and resilience.

* **High Availability (HA)**

* Built for production resilience, with redundancy across servers.
* Requires more infrastructure but delivers stronger reliability.
* Recommended for mission‑critical workloads.

**Upgrade path:** RA clusters will soon support upgrades to HA. This will provide a low‑cost entry point with the flexibility to move to a highly resilient setup later. (The reverse—HA to RA—is not supported.)

Additional highlights of Deploy v3:

* Runs on **Flatcar Linux** as a read‑only, immutable OS for security and reduced maintenance.
* Introduces **node pools**, allowing targeted workloads (e.g., GPUs for AI, high‑IO nodes for databases).
* Supports **GPUs**.
* Enables **auxiliary services** like databases to run inside clusters.
* Provides **shared and scalable persistent storage**.
* Generates **native Kubernetes manifests**, which can be customized and extended, unlocking the full Kubernetes ecosystem.
* Initial cloud support includes **DigitalOcean**, **Hetzner**, and **Vultr**, with more providers on the roadmap.

## Benefits of Deploy v3

* **Flexibility:** Start small with RA, scale up to HA as needed.
* **Resilience:** Stronger reliability and redundancy options out of the box.
* **Kubernetes‑native architecture:** A cleaner, more modern design that reduces complexity.
* **Improved user experience:** Clearer choices and easier management.

## Feature Coverage

Deploy v3 also introduces several new capabilities not available in Deploy v2:

* Support for **GPUs**
* Ability to run **auxiliary services** such as databases inside containers and clusters
* **Shared and scalable persistent storage** using cloud‑native disks or Longhorn
* **Deep cloud integration** with the cluster through cloud‑native CSI and CNI
* Cluster interaction model: v3 generates **native Kubernetes manifests** that can be finely tuned, exposing the full Kubernetes feature set to users (v2 communicates directly with the Kubernetes API)

These features highlight the forward‑looking design of Deploy v3 and open up new possibilities for advanced workloads.

Deploy v3 also introduces the concept of **node pools**, which allow different workloads to be targeted to specific types of nodes. For example, GPU‑enabled nodes can be dedicated to AI workloads, while high‑IO nodes can be reserved for running databases. This enables more efficient resource allocation and better performance tuning for diverse applications.

## Comparison at a Glance

| Feature                   | Deploy v2                                              | Deploy v3                                                        |
|---------------------------|--------------------------------------------------------|------------------------------------------------------------------|
| Cluster model             | Tightly bound to underlying servers                    | Kubernetes‑native, decoupled from servers                        |
| Node roles                | Master, worker, or shared                              | Defined RA or HA cluster types                                   |
| Availability options      | Manual setup with proven flexibility                   | RA (cost‑effective) or HA (resilient)                            |
| Upgrade path              | Manual scaling and adjustments                         | RA → HA supported  |
| Feature set               | Mature, broad capabilities                             | Focused, expanding feature set                                   |
| Best suited for           | Established workloads, advanced features               | Production workloads, evolving needs                             |
| Node OS                   | Ubuntu                                                 | Flatcar (read‑only)                                              |
| Node pools                | Not supported                                          | Supported (target workloads to GPU, high‑IO, etc.)               |
| Cloud-native CSI/CNI      | Not supported                                          | Supported                                                        |
| Supported cloud providers | AWS, DigitalOcean, Google Cloud, Azure, Hetzner, Vultr | DigitalOcean, Hetzner, Vultr (initial)                           |

## Summary

Deploy v2 and v3 complement each other. Deploy v2 offers a mature, feature‑rich platform with capabilities that have been battle‑tested over time. Deploy v3 provides a modernized, Kubernetes‑native architecture with new options for cost and availability, and is designed to evolve quickly.

Choosing between them depends on workload requirements: stick with Deploy v2 where its features are essential, or adopt Deploy v3 for a flexible, future‑oriented approach with a smooth path to high availability.

## Looking Ahead

Cloud 66 will continue to fully support Deploy v2. Its broad feature set, cloud coverage, and component support remain important for many workloads. At the same time, the focus is on rapidly developing Deploy v3 to reach feature parity with v2—matching its capabilities while also expanding into new areas.

Deploy v3 has been released as an **early access product**, available free of charge. The goal is to collect real‑world feedback, integrate it into the product, and accelerate its evolution. This approach ensures that v3 develops in the right direction while maintaining the reliability and maturity that Deploy v2 already provides.

## Choosing Between Deploy v2 and v3

When deciding which version to use, consider the following:

* **Choose Deploy v2 if:**

* You need the most mature and feature‑complete platform today.
* Your workloads depend on v2’s current integrations such as broad cloud coverage, built‑in auxiliary services, or features not yet in v3.
* Stability and proven reliability are your highest priorities.

* **Choose Deploy v3 if:**

* You want a modern, Kubernetes‑native architecture with a focus on flexibility and growth.
* You plan to take advantage of features such as node pools, GPUs, and native manifest generation.
* You are comfortable adopting an early access product and contributing feedback to shape its future.

In practice, many teams may use both: continuing established workloads on Deploy v2 while exploring Deploy v3 for new projects or environments that benefit from its emerging capabilities.