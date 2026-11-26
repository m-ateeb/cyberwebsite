---
title: "CIDR, Subnetting, VLSM & Public vs. Private Subnets Explained Simply"
slug: "cidr-subnetting-vlsm-public-private-subnets"
description: "Master IPv4 CIDR notation, subnetting, Variable Length Subnet Masking (VLSM), RFC 1918 private ranges, and what actually makes a subnet public or private—with interactive visualizers."
category: "Networking"
subcategory: "IP Addressing & Subnetting"
tags:
  - CIDR
  - Subnetting
  - VLSM
  - Public Subnet
  - Private Subnet
  - VPC
  - Networking
author: "StratumSec"
publishedAt: "2026-11-26"
updatedAt: "2026-11-26"
difficulty: "Beginner"
featured: true
draft: false
seoTitle: "CIDR, Subnetting, VLSM & Public vs. Private Subnets Explained Simply — StratumSec"
seoDescription: "Interactive beginner-friendly guide to CIDR notation, subnetting, VLSM, route tables, NAT gateways, and public vs. private subnets."
learningExperience:
  status: "published"
  id: "subnetting-cidr-vlsm-01"
  title: "Interactive CIDR, VLSM & Subnet Routing Simulator"
  type: "network-topology"
---

> [!IMPORTANT]
> **The Simple Definitions:**
> - **CIDR** (`10.0.1.0/24`) is a compact way to write an **IP address range** by telling routers how many leading bits identify the **network** (the street) and how many remain for **devices** (the houses).
> - **Subnetting** is slicing one large network into smaller, isolated networks (like dividing a floor into separate rooms).
> - **VLSM (Variable Length Subnet Masking)** is slicing those rooms into **different custom sizes** so you don't waste IP addresses.
> - **Public vs. Private Subnets** aren't just labels—a subnet is **Public** if its route table points to an **Internet Gateway**, and **Private** if it has no direct route from the Internet.

New to IP addresses and routers? Start with [What Is Networking?](/notes/what-is-networking), or see how these exact subnets power real cloud apps in [What Is VPC & What Is ECS?](/notes/what-is-vpc-and-ecs).

## 1. CIDR Notation Made Effortless

Every IPv4 address (like `10.0.1.25`) is really **32 binary bits** split into four 8-bit numbers (`0–255`).

In **CIDR (Classless Inter-Domain Routing)**, the slash number (like `/24` or `/26`) simply tells you **how many of those 32 bits are locked as the Network Prefix**. Whatever bits are left over (`32 - prefix`) are free for your devices!

Try **Tab 1 ("1. CIDR Slicer")** in the simulator above and click `/24`, `/25`, `/26`, `/28`, and `/30` to watch the 32 bits shift in real time:

| CIDR Prefix | Subnet Mask | Host Bits (`32 - N`) | Total IPs (`2^hosts`) | Standard Usable (`-2`) | AWS / Azure Usable (`-5`) | Typical Real-World Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`/16`** | `255.255.0.0` | 16 | 65,536 | 65,534 | 65,531 | Entire Cloud VPC (`10.0.0.0/16`) |
| **`/24`** | `255.255.255.0` | 8 | 256 | 254 | 251 | Standard office or VPC subnet |
| **`/25`** | `255.255.255.128` | 7 | 128 | 126 | 123 | Medium app / container tier |
| **`/26`** | `255.255.255.192` | 6 | 64 | 62 | 59 | Database or microservice subnet |
| **`/27`** | `255.255.255.224` | 5 | 32 | 30 | 27 | Load balancer / NAT subnet |
| **`/28`** | `255.255.255.240` | 4 | 16 | 14 | 11 | Small bastion subnet (AWS min) |
| **`/30`** | `255.255.255.252` | 2 | 4 | 2 | 0 | Point-to-point router link |

> [!NOTE]
> **Why `-2` on standard networks and `-5` in the cloud?**
> In every IPv4 subnet, the **first IP** (e.g., `.0`) is reserved as the **Network ID** and the **last IP** (e.g., `.255`) is the **Broadcast Address**—leaving `Total - 2` usable IPs. Cloud providers like AWS and Azure reserve **3 extra IPs** (for the VPC router `.1`, internal DNS `.2`, and future use `.3`), leaving `Total - 5` usable IPs.

## 2. Why We Subnet (Instead of One Giant Flat Network)

If your company gets `10.0.0.0/16` (65,536 IPs), putting every laptop, load balancer, container, and database into one giant room is a terrible idea:

1. **Security Isolation:** You want public-facing load balancers separated from private databases so firewalls can strictly filter traffic between rooms.
2. **Less Broadcast Noise:** Smaller subnets keep noisy "who has this IP?" broadcast packets contained locally.
3. **High Availability:** In cloud platforms like AWS, each subnet lives in a specific **Availability Zone**—so multiple subnets let you spread your app across multiple physical data centers.

## 3. VLSM (Variable Length Subnet Masking): Stop Wasting IPs

With **Fixed-Length Subnetting**, every subnet gets the exact same size. Suppose you have one `10.0.1.0/24` block (256 IPs) and four teams:
- **App Servers:** need **55 IPs**
- **Databases:** need **20 IPs**
- **Load Balancers:** need **10 IPs**
- **Router-to-Router Link:** needs **2 IPs**

If you use **Fixed Subnetting** (four `/26` slices of 64 IPs each), the 2-IP router link hogs 64 IPs and wastes 62 of them—leaving **zero space** for future teams!

Now switch **Tab 2 ("2. VLSM vs. Fixed")** above to **VLSM (Right-Sized!)**:
- **Step 1 (Always start with the largest need first):** Give App Servers a **`/26`** (`10.0.1.0/26` → 64 IPs).
- **Step 2:** Give Databases a **`/27`** (`10.0.1.64/27` → 32 IPs).
- **Step 3:** Give Load Balancers a **`/28`** (`10.0.1.96/28` → 16 IPs).
- **Step 4:** Give the Router Link a **`/30`** (`10.0.1.112/30` → 4 IPs).

**Result:** All four teams fit cleanly with zero overlap, and **140 IP addresses (`10.0.1.116 – .255`) remain completely free** for future growth!

## 4. Public Subnets vs. Private Subnets (The Real Difference)

Many beginners think a subnet is "public" just because you name it `public-subnet` or pick a special IP range. **That is a myth.** Both public and private subnets inside a [VPC](/notes/what-is-vpc-and-ecs) use private RFC 1918 addresses (like `10.0.1.0/24` and `10.0.2.0/24`).

What *actually* makes a subnet **Public** or **Private** is its **Route Table**—test all three scenarios in **Tab 3 ("3. Public vs. Private")** above:

| Property | Public Subnet | Private Subnet |
| :--- | :--- | :--- |
| **Default Route (`0.0.0.0/0`)** | Points directly to an **Internet Gateway (IGW)** | Points to a **NAT Gateway** (or no Internet route at all) |
| **Public IP Addresses** | Resources can receive Public IPs | Private IPs only (hidden from the Internet) |
| **Direct Inbound from Internet?** | **Yes** (if Firewall / Security Group allows it) | **No — impossible to reach directly** |
| **Outbound to Internet?** | Directly via Internet Gateway | Safely one-way via **NAT Gateway** (for OS/security updates) |
| **What Belongs Here?** | Load Balancers, NAT Gateways, Bastion/Jump hosts | [ECS containers](/notes/what-is-vpc-and-ecs), App servers, Databases, Caches |

## 5. Related Concepts You Will Always See Together

- **Private IP Ranges (RFC 1918):** Three special IP blocks reserved exclusively for private LANs and Cloud VPCs (never routed directly on the public Internet):
  - `10.0.0.0/8` (16.7 million IPs — most popular for Cloud VPCs)
  - `172.16.0.0/12` (1 million IPs — often used by Docker & corporate networks)
  - `192.168.0.0/16` (65,536 IPs — your home Wi-Fi router!)
- **Route Table:** The GPS inside your VPC. Every subnet is attached to a Route Table containing rules like `10.0.0.0/16 → local` and `0.0.0.0/0 → igw-12345`.
- **Internet Gateway (IGW) vs. NAT Gateway:** An **IGW** is a two-way front door for Public Subnets. A **NAT Gateway** is a one-way mailroom that lets Private Subnets download updates *out* without letting attackers initiate connections *in*.
- **Longest Prefix Match:** If a route table has two matching routes (`0.0.0.0/0` and `10.0.0.0/16`), routers **always pick the most specific route** (the larger `/prefix` number).

## 6. How to Explain CIDR, VLSM & Subnets in 25 Seconds

> [!TIP]
> **Your 25-Second Explanation:**
> *"**CIDR** (like `10.0.1.0/24`) tells a network how many bits define the street and how many remain for devices. **Subnetting** divides a big network into smaller, safer rooms, and **VLSM** lets each room be custom-sized so we don't waste IPs. In the cloud, a subnet is **Public** if its route table points to an **Internet Gateway**, and **Private** if it stays hidden behind a **NAT Gateway**—so only load balancers face the Internet while your apps and databases stay protected."*

## Key Takeaways

- Every time you add `+1` to a CIDR prefix (`/24 → /25`), you **cut the subnet size in half** and **double the number of subnets**.
- Always allocate **VLSM** subnets from **largest to smallest** to avoid overlapping ranges and preserve free IP space.
- A subnet's **Route Table**—not its name—decides whether it is **Public** (`→ IGW`) or **Private** (`→ NAT` or local-only).
- Continue the series: [What Is Networking?](/notes/what-is-networking) → **CIDR, Subnetting & VLSM** → [What Is VPC & What Is ECS?](/notes/what-is-vpc-and-ecs).

## References

- [RFC 4632: Classless Inter-Domain Routing (CIDR)](https://datatracker.ietf.org/doc/html/rfc4632)
- [RFC 1918: Address Allocation for Private Internets](https://datatracker.ietf.org/doc/html/rfc1918)
- [AWS Documentation: VPC Subnets and Route Tables](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
