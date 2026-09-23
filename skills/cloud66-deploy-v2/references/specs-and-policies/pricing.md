# Pricing and plans


## Overview

Cloud 66 charges based on the number of servers we manage for you. These prices **do not** include the cost of the servers themselves (i.e. the charges paid to your cloud provider).

Cloud 66 charges based on the number of static sites we manage for you. These prices **do not** include the cost of the block storage services themselves (i.e. the charges paid to your cloud provider).

Please see the [pricing page](https://www.cloud66.com/pricing) on our main site for our latest rates.

See below for details on how our plans work, and the limits per plan, as well as the practical implications of moving between plans. 

## Payment plans

Our plans are structured by tier, and depend on three things:

- The **number of servers** we’re managing for you (including web servers, databases and other standalone component servers)
- The number of **load balancers** you have
- The number of free **build minutes** included

- The **number of static sites** we’re managing for you 
- The traffic served by your site (in GB)
- The number of free **build minutes** included

These may change from time to time, so please check our official pricing page for the latest numbers. We offer both monthly and annual payments, and you can move between these as needed (see below for details).

### How the free plan works

Our free plan is **free forever** and **requires no credit card**. It includes:

- 1 free deployment server (can be shared with a database)
- 1 load balancer
- 50 build minutes (hard limited)

In addition backups on free plans are limited to 100MB in size. 

- 1 static site
- 1GB traffic limit
- 50 build minutes (hard limited)

If you need more of any of these things, you will need to upgrade to the Developer plan.

## Understanding hard and soft limits

Some resources are hard limited according to your plan, which means you can’t add more of them without upgrading. 

- For Developer or Team plans, **only servers** are hard limited. For example, if you need 5 servers you will need to upgrade from Developer to Team, and you can then add up to 10 servers. (Servers are *soft-limited* on Business)
- For our *free* plan, deployment servers, load balancers, [build minutes](../account/build-minutes.md) and backups are all hard limited

Other resources are either soft limited or metered from the start: 

- [Build minutes](../account/build-minutes.md) are soft limited for paid plans and you pay $0.03 per minute for overage
- Managed database backups are unlimited for paid plans and cost $0.38 / GB per month
- Load balancers are unlimited for all paid plans

- For Developer plans, **only sites** are hard limited. For example, if you need 6 sites you will need to upgrade from Developer to Team, and you can then have up to 10 sites. (Sites are *soft-limited* on Team and Business)
- For our *free* plan, sites, traffic and [build minutes](../account/build-minutes.md) are all hard limited.

Other resources are either soft limited or metered from the start: 

- [Build minutes](../account/build-minutes.md) are soft limited for paid plans and you pay $0.03 per minute for overage
- Traffic for paid plans is soft limited and costs $0.20 / GB for overage

## Upgrading and downgrading monthly plans

If you **upgrade** a monthly plan, we immediately move you up to your chosen tier and increase all your limits accordingly. We then charge you on a pro-rata basis for your new plan when we bill you. So, for example, if you upgrade 10 days before we bill you, we charge you the higher rate for those 10 days. 

To **downgrade** your plan, you’ll need to reduce your resource usage to within the limits of your new plan. We will then bill you at the lower rate on a pro-rata basis. 

## Changing between monthly and annual payments

If you switch **from a monthly to a yearly plan** we will instantly switch you to your new plan and immediately charge you for a year. This will set your renewal date to exactly a year from the date you changed your plan to annual.

If you switch **from a yearly to the same kind of monthly plan or higher** we will switch you to monthly payments at the end of your current annual plan.

If you downgrade **from a yearly plan to a lower tier monthly plan**, we will only be able to check your eligibility for downgrade when your annual plan expires. If when your annual plan expires it is over the limits of the intended monthly plan, we will switch you to the equivalent tier of monthly plan and alert you. 

## Changing between different kinds of annual payments

If you **upgrade to a higher tier of annual plan** then:

- We switch you to the new plan instantly (and raise your limits)
- We credit your account for the remaining balance of your existing annual plan, and offset that amount against a pro-rated cost for the remainder of the period (until your renewal date).
- At renewal date we charge you for your new plan

If you **downgrade to a lower tier of annual plan**, we will only be able to check your eligibility for downgrade when your current plan expires. If, when your current plan expires, it is over the limits of the intended annual plan, we will switch you to the appropriate tier of monthly plan and alert you.