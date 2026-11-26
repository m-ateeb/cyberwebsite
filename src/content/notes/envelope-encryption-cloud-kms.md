---
title: "Envelope Encryption & Key Rotation at Scale with Cloud KMS"
slug: "envelope-encryption-cloud-kms"
description: "Why you never send raw application payloads to KMS—and how DEKs + KEKs keep latency low and compliance happy."
category: "Cloud Infrastructure"
subcategory: "Distributed Systems"
tags:
  - Cryptography
  - KMS
  - Data Security
  - Cloud
author: "StratumSec"
publishedAt: "2026-10-20"
updatedAt: "2026-11-26"
difficulty: "Beginner"
featured: false
draft: false
seoTitle: "Envelope Encryption & Key Rotation at Scale with Cloud KMS — StratumSec"
seoDescription: "Understand envelope encryption with local AES-256-GCM DEKs, Cloud KMS KEKs, and Authenticated Encryption Context (AAD)."
learningExperience:
  status: "not-created"
  id: null
---

> [!IMPORTANT]
> **TL;DR:** Cloud KMS APIs have strict rate limits and 4KB payload caps. Envelope encryption generates a fast local Data Encryption Key (DEK) for your data, then encrypts only that DEK with a KMS Key Encryption Key (KEK).

## Overview: Problem vs. Modern Approach

- **Core Threat:** Calling KMS directly per database row throttles under load, increases p99 latency, and exposes plaintext over network boundaries unnecessarily.
- **Modern Approach:** Use standard envelope encryption (`AES-256-GCM` DEK + KMS KEK) with authenticated encryption context (AAD) bound to tenant ID.

By storing the KMS-encrypted DEK alongside the ciphertext, applications decrypt locally in memory after a single KMS `Decrypt` call—and can cache DEKs briefly with strict TTLs.

## 1. Preventing Confused Deputy Attacks with AAD

Passing `tenant_id` in KMS `EncryptionContext` cryptographically binds the wrapped DEK to that tenant. Even if an attacker swaps encrypted blobs between database rows, decryption fails because the authenticated additional data (AAD) does not match.

```bash title="kms-generate-data-key.sh"
aws kms generate-data-key \
  --key-id alias/stratumsec-prod-kek \
  --key-spec AES_256 \
  --encryption-context tenant_id=tenant_42,table=billing_records
```

> [!NOTE]
> **Zero-Downtime Rotation:** Rotating the KEK in KMS automatically re-wraps new DEKs while keeping older key versions available for decrypting historical data—no terabyte-scale re-encryption required.

## Key Takeaways

- Always bind `EncryptionContext` (AAD) to tenant/record ID to prevent ciphertext swapping.
- Rotating the KEK in KMS does not require re-encrypting terabytes of existing data.
- Zeroize plaintext DEKs from memory after use where language runtimes permit.

## References

- [AWS KMS Cryptographic Details & Envelope Encryption](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping)
- [Google Cloud KMS Envelope Encryption](https://cloud.google.com/kms/docs/envelope-encryption)
