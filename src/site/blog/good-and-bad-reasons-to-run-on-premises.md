---
title: 'The Good and Bad Reasons to Run On-Premises'
date: 2019-09-17T08:09:26-07:00
tags: ['draft']
authors: ["jessie-frazelle"]
description: What are the good reasons for running on-premises? What are the bad reasons?
---

> **NOTE:** this is a draft still working through the wording

A question we get asked frequently is: What are the good and bad reasons to run
on-premises? Economics, security, latency and regulatory compliance are some of
the good reasons for running on-premises and we will cover each of these in
detail.

<!--more-->

## Good Reasons

### Economics

At scale, the unit cost economics of running in the cloud versus on-premises
leans towards on-premises being much cheaper. There have been a few examples of
this written about as well. 

[Bank of America](https://www.businessinsider.com/bank-of-americas-350-million-internal-cloud-bet-striking-payoff-2019-10)
reported saving 2.1 billion dollars by keeping their infrastructure in their 
private cloud. While some of this might be news fluff, the sentiment is clear:
at the scale Bank of America is running it is more cost effective to run an
on-premises cloud than to run workloads in the public cloud.

[Facebook](https://www.facebook.com/notes/facebook-engineering/building-efficient-data-centers-with-the-open-compute-project/10150144039563920/) 
reported 38% less energy usage and a cost savings of 24% due to fewer parts and 
less sheet metal when they switched to their Open Compute Project hardware. Due
to the high density design, better power distribution, and more efficient
cooling of the Open Compute Project hardware, businesses consuming it can see
much better unit cost economics for their on-premises infrastructure.

[Dropbox](https://www.geekwire.com/2018/dropbox-saved-almost-75-million-two-years-building-tech-infrastructure/) 
reported saving almost 75 million dollars by moving their infrastructure from 
the public cloud to on-premises. Like Facebook, they used the Open Compute
Project hardware designs and built out their own on-premises cloud
infrastructure.

[Something about Uber]

### Security

Running compute workloads and storing data side-by-side other tenants 
in a public cloud is not in the cards for businesses that have highly
confidential, valuable data. The security breach on 
[Capital One](https://www.cnn.com/2019/07/29/business/capital-one-data-breach/index.html) 
earlier this year, yielded 100 million credit card applications and accounts 
to the clever hacker. Folks with data that they want to ensure is isolated 
from the risk of a breach outside their control should run on-premises to help 
negate that risk.

### Latency

Latency refers to the delay before a transfer of data begins after a request 
for its transfer. In businesses like high frequency trading, internet service
providers, and cable providers, latency can make or break a business. For these
businesses, a slow in latency can cost millions, if not billions, of dollars. 
Running on-premises allows these companies to control their latency to degrees
not available by running in the public cloud. These companies are
likely already running custom kernel patches, FPGAs, and performing other 
highly technical feats just to get nanoseconds of latency better than their 
competitors.

### Regulatory Compliance

Regulatory compliance ensures a company follows the laws enforced by governing 
bodies in their geography or rules required by voluntarily adopted industry 
standards. For IT regulatory compliance, people and processes monitor corporate
systems in an effort to detect and prevent violations of policies and 
procedures established by these governing laws, regulations, and standards. 
This in turn applies to a wide array of monitoring and enforcement processes. 
Depending on the industry and geography, these processes can become lengthy 
and complex.

Maintaining regulatory compliance is challenging for multinational 
organizations, especially in heavily regulated industries like healthcare and 
financial services. Regulations can often change frequently which also
complicates matters. For these companies, running on-premises and staying up to
date with their specific regulations might be the only solution.

### Strategic

Much like the above example of latency, certain businesses might have other
strategic reasons for running on-premises. If their business requires special
workloads or configurations not offered in public clouds, they remain
on-premises to deliver the same workload constraints to their internal teams.

For businesses that need highly available services like retail on Black Friday,
on-premises can provide additional availability and resiliency in the case of
failover of other deployments.

## Bad Reasons

If you do not fall into the above reasons and are still running on-premises, it
might be for a bad reason, rather than good. It can also mean we missed a good
reason and we would love to hear about it if so.
