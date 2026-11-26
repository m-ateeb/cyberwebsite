---
title: "Taming AWS IAM Blast Radius: Permission Boundaries & SCPs"
slug: "aws-iam-permission-boundaries-scps"
description: "How to let developers ship IAM roles safely without handing out Organization-wide admin escalation."
category: "Cloud Infrastructure"
subcategory: "AWS"
tags:
  - AWS
  - IAM
  - Least Privilege
  - Governance
author: "StratumSec"
publishedAt: "2026-11-10"
updatedAt: "2026-11-26"
difficulty: "Intermediate"
featured: true
draft: false
seoTitle: "Taming AWS IAM Blast Radius: Permission Boundaries & SCPs — StratumSec"
seoDescription: "Combine AWS Organization SCPs with IAM Permission Boundaries to allow self-service role creation without privilege escalation."
learningExperience:
  status: "not-created"
  id: null
---

> [!IMPORTANT]
> **TL;DR:** Granting `iam:CreateRole` without guardrails is equivalent to granting full admin. Combine Organization SCPs (account ceiling) with IAM Permission Boundaries (role ceiling) so teams can self-serve safely.

## Overview: Problem vs. Modern Approach

- **Core Threat:** Developers need to create Lambda/ECS execution roles in CI/CD, but unrestricted `iam:CreateRole` + `iam:AttachRolePolicy` lets a compromised pipeline attach `AdministratorAccess` to itself.
- **Modern Approach:** Require every newly created role to carry a standardized Permission Boundary via an IAM condition key (`iam:PermissionsBoundary`), enforced at both IAM and SCP layers.

AWS evaluates effective permissions as the **intersection** of identity policies, resource policies, SCPs, and permission boundaries. An explicit deny or missing allow in any layer blocks the action.

## 1. The Policy Intersection Model

A common misconception is that a Permission Boundary grants permissions. It does not—it only defines the **maximum permissions** a role can ever exercise, even if someone attaches `AdministratorAccess` to it.

```json title="enforce-boundary-condition.json"
{
  "Sid": "AllowRoleCreationOnlyWithBoundary",
  "Effect": "Allow",
  "Action": [
    "iam:CreateRole",
    "iam:AttachRolePolicy"
  ],
  "Resource": "arn:aws:iam::123456789012:role/app-*",
  "Condition": {
    "StringEquals": {
      "iam:PermissionsBoundary": "arn:aws:iam::123456789012:policy/AppDeveloperBoundary"
    }
  }
}
```

> [!WARNING]
> **Critical Guardrail:** Always add an explicit `Deny` on `iam:DeleteRolePermissionsBoundary` and `iam:PutRolePermissionsBoundary` (unless matching your approved boundary ARN) for non-security roles.

## Key Takeaways

- SCPs protect account ceilings; Permission Boundaries protect individual roles.
- Always pair `iam:CreateRole` with `Condition: StringEquals iam:PermissionsBoundary`.
- Block `iam:DeleteRolePermissionsBoundary` from non-security roles.

## References

- [AWS IAM Permissions Boundaries Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html)
- [AWS Organizations Service Control Policies (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)
