---
title: "Cloud Computing Fundamentals: Architecture, Service Models & Elasticity"
slug: "what-is-cloud-computing"
description: "How shared on-demand compute, storage, and SaaS platforms serve desktops, laptops, and mobile devices over the internet—explained from first principles."
category: "Cloud Infrastructure"
subcategory: "Cloud Fundamentals"
tags:
  - Cloud Computing
  - IaaS
  - PaaS
  - SaaS
  - Elasticity
author: "StratumSec"
publishedAt: "2026-11-26"
updatedAt: "2026-11-26"
difficulty: "Beginner"
featured: true
draft: false
coverImage: "/images/uploads/cloud-computing-overview.jpg"
seoTitle: "Cloud Computing Fundamentals: Architecture, Service Models & Elasticity — StratumSec"
seoDescription: "Understand how Cloud Computing delivers on-demand compute, file sync, messaging, and real-time analytics across every connected device."
learningExperience:
  status: "published"
  id: "cloud-computing-fundamentals-01"
  title: "Interactive Cloud Computing Visualizer"
  type: "architecture-explorer"
---

> [!IMPORTANT]
> **Core Definition:** Cloud computing is the on-demand delivery of IT resources—compute, storage, databases, networking, and software—over the internet with pay-as-you-go pricing, replacing upfront physical hardware with elastic, remotely managed data centers.

## 1. Reading the Cloud Computing Model

Look at the architecture diagram above. Instead of every laptop, desktop, or smartphone storing all files locally and running heavy workloads on its own CPU, **a shared cloud layer sits at the center** and delivers four everyday capabilities over standard network connections:

1. **Analytics & BI Workstations (Left Desktop):** Heavy data queries and dashboard aggregations execute on remote cloud clusters rather than exhausting local RAM.
2. **Cross-Device File Storage & Sync (Laptop):** Files uploaded from one machine are durably replicated across multiple availability zones in object storage and synchronized everywhere.
3. **Cloud Messaging & SaaS (Smartphone):** Email, collaboration, and identity services run continuously in the cloud so thin mobile clients only fetch what they need.
4. **Real-Time Metrics & Elastic Compute (Right Monitor):** Dashboards stream live telemetry while cloud autoscalers add or remove servers automatically as load fluctuates.

## 2. The Five Essential Characteristics (NIST)

According to NIST SP 800-145, true cloud infrastructure exhibits five defining properties:

- **On-Demand Self-Service:** Provision servers, databases, or storage via API/CLI in seconds without human intervention.
- **Broad Network Access:** Workloads and data are reachable securely over standard HTTPS/TLS protocols from desktops, laptops, and mobile devices.
- **Resource Pooling:** Physical servers, disks, and networks are virtualized and shared across multiple tenants using strict hypervisor and network isolation.
- **Rapid Elasticity:** Compute capacity scales out automatically during traffic spikes and scales back in when demand subsides—eliminating over-provisioning.
- **Measured Service:** Usage is metered transparently (per CPU-second, gigabyte-month, or request), aligning cost directly with consumption.

## 3. Cloud Service Models: IaaS vs. PaaS vs. SaaS

Choosing a cloud service model is fundamentally a decision about **how much of the stack you want to operate yourself** versus delegating to the cloud provider.

| Layer | On-Premises | IaaS (e.g., EC2, GCE) | PaaS (e.g., App Runner, Vercel) | SaaS (e.g., Gmail, Slack) |
| :--- | :--- | :--- | :--- | :--- |
| **Applications & Data** | You manage | You manage | You manage | Provider manages |
| **Runtime & Middleware** | You manage | You manage | Provider manages | Provider manages |
| **Operating System** | You manage | You manage | Provider manages | Provider manages |
| **Virtualization & Servers** | You manage | Provider manages | Provider manages | Provider manages |
| **Networking & Data Center** | You manage | Provider manages | Provider manages | Provider manages |

> [!NOTE]
> **Practical Rule of Thumb:** Default to **SaaS** for commodity tools (email, CRM), **PaaS** for standard web services where speed matters, and **IaaS** when you need fine-grained control over OS kernels, custom networking, or specialized GPUs.

## 4. Cloud Deployment Models

- **Public Cloud:** Multi-tenant infrastructure operated by providers like AWS, Azure, or Google Cloud—maximum elasticity and global reach.
- **Private Cloud:** Dedicated infrastructure operated exclusively for one organization (on-premises or hosted), often used for strict regulatory isolation.
- **Hybrid Cloud:** Connects on-premises data centers with public cloud regions over encrypted VPN/Direct Connect links so workloads can burst or remain compliant.
- **Multi-Cloud:** Distributes workloads across two or more public cloud providers to avoid vendor lock-in or leverage best-of-breed services.

## 5. Provisioning Cloud Resources via Infrastructure as Code

In modern cloud engineering, teams avoid clicking manually through consoles. Instead, compute and storage are declared as version-controlled code:

```hcl title="main.tf"
resource "aws_s3_bucket" "synced_files" {
  bucket = "stratumsec-shared-documents"
}

resource "aws_autoscaling_group" "web_pool" {
  min_size         = 2
  max_size         = 8
  desired_capacity = 2
}
```

## Key Takeaways

- Cloud computing shifts IT from **fixed capital hardware** to **elastic, API-driven utility infrastructure**.
- Every connected device—desktop, laptop, or smartphone—acts as a lightweight window into shared compute, storage, and analytics pools.
- Understand the **Shared Responsibility Model**: even when the provider secures the physical data center, **you remain responsible for identity, encryption, and access control** over your data.

## References

- [NIST SP 800-145: The NIST Definition of Cloud Computing](https://csrc.nist.gov/publications/detail/sp/800-145/final)
- [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)
