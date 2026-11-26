---
title: "Kubernetes RBAC Privilege Escalation Paths & Hardening"
slug: "kubernetes-rbac-privilege-escalation"
description: "The subtle RBAC verbs (escalate, bind, impersonate, pods/exec) that silently grant cluster-admin."
category: "Cybersecurity"
subcategory: "Cloud Security"
tags:
  - Kubernetes
  - RBAC
  - Hardening
  - AppSec
author: "StratumSec"
publishedAt: "2026-10-28"
updatedAt: "2026-11-26"
difficulty: "Intermediate"
featured: false
draft: false
seoTitle: "Kubernetes RBAC Privilege Escalation Paths & Hardening — StratumSec"
seoDescription: "Identify and harden indirect Kubernetes RBAC privilege escalation paths including bind, escalate, impersonate, and pods/create."
learningExperience:
  status: "not-created"
  id: null
---

> [!IMPORTANT]
> **TL;DR:** Even without `cluster-admin`, permissions like `pods/create` (mounting hostPath or privileged service accounts), `secrets/get`, or `roles/bind` let an attacker pivot to full cluster control.

## Overview: Problem vs. Modern Approach

- **Core Threat:** Teams audit for `verbs: ['*']` but miss indirect escalation paths like creating a pod that mounts a high-privilege ServiceAccount token in the same namespace.
- **Modern Approach:** Disable `automountServiceAccountToken` by default, restrict `pods/exec` in production, and run automated RBAC graph audits in CI.

The Kubernetes API server enforces escalation checks on `create`/`update` of Roles, unless the actor holds `escalate` or `bind`. Meanwhile, indirect paths via `pods/exec` or DaemonSet creation bypass RBAC limits through node credentials.

## 1. Indirect Escalation Through Pod Creation

If a CI runner can create pods in a namespace that also contains a privileged `ClusterRoleBinding` ServiceAccount, the runner can schedule a pod referencing that `serviceAccountName` and read its projected token.

> [!WARNING]
> **Common Misconfiguration:** Granting `pods: create` in `kube-system` or `argocd` namespaces is effectively equivalent to `cluster-admin`.

## High-Risk RBAC Verbs to Audit

| Verb / Resource | Escalation Mechanism | Hardening Control |
| :--- | :--- | :--- |
| `roles/bind`, `clusterroles/bind` | Bind higher-privilege roles to self | Restrict to cluster-bootstrap controllers |
| `impersonate` on `users`/`serviceaccounts` | Act as `system:masters` or privileged SA | Deny across all application roles |
| `pods/create` | Mount privileged SA or `hostPath` | Enforce `restricted` Pod Security Standard |
| `pods/exec` | Execute into privileged workloads | Restrict via break-glass JIT access |

## Key Takeaways

- Audit indirect escalation verbs: `bind`, `escalate`, `impersonate`, `pods/exec`.
- Set `automountServiceAccountToken: false` on every workload that does not talk to the Kubernetes API.
- Enforce Pod Security Standards (`restricted`) via Admission Control.

## References

- [Kubernetes RBAC Authorization Good Practices](https://kubernetes.io/docs/concepts/security/rbac-good-practices/)
- [Kubernetes Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
