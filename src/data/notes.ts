export type NoteDomain = "cybersecurity" | "cloud" | "architecture";
export type NoteDifficulty = "Foundational" | "Deep Dive" | "Architecture";

export interface SimulationStep {
  sectionId: string;
  label: string;
  diagramMode: "threat" | "defense" | "hybrid";
  activeNodes: ("client" | "edge" | "mesh" | "kernel" | "vault")[];
  blockedAt?: "edge" | "mesh" | "kernel" | "vault";
  packetPath: "bypass" | "double-hop" | "kernel-fast" | "mtls-direct";
  caption: string;
  telemetry: { label: string; value: string; status: "warn" | "ok" | "info" }[];
}

export interface NoteSection {
  id: string;
  heading: string;
  body: string[];
  callout?: {
    type: "threat" | "approach" | "takeaway";
    title: string;
    text: string;
  };
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  simulation?: SimulationStep;
}

export interface TechnicalNote {
  slug: string;
  title: string;
  subtitle: string;
  domain: NoteDomain;
  difficulty: NoteDifficulty;
  tags: string[];
  readTime: string;
  updatedAt: string;
  featured?: boolean;
  tldr: string;
  deepDiveSummary: string;
  threatOrProblem: string;
  modernApproach: string;
  keyTakeaways: string[];
  sections: NoteSection[];
}

export const NOTES: TechnicalNote[] = [
  {
    slug: "ebpf-kernel-observability-vs-sidecars",
    title: "eBPF Kernel-Level Security vs. Service Mesh Sidecars",
    subtitle:
      "Why modern cloud-native security is moving from per-pod proxy sidecars into verified Linux kernel hooks.",
    domain: "cloud",
    difficulty: "Deep Dive",
    tags: ["eBPF", "Kubernetes", "Cilium", "Runtime Security"],
    readTime: "9 min read",
    updatedAt: "Nov 2026",
    featured: true,
    tldr: "Sidecar proxies intercept traffic in user space at the cost of memory and latency per pod. eBPF runs sandboxed bytecode directly in the Linux kernel, giving node-wide L3/L4/L7 visibility and syscall enforcement with near-zero overhead.",
    deepDiveSummary:
      "By attaching verified eBPF programs to kprobes, tracepoints, and socket/XDP hooks, platforms like Cilium and Tetragon enforce network policy and detect container escapes before a packet or syscall ever reaches user space.",
    threatOrProblem:
      "In dense Kubernetes clusters, sidecar containers multiply memory consumption, add two extra TCP/loopback hops per request, and can be bypassed if an attacker exploits a kernel vulnerability or escapes the pod network namespace.",
    modernApproach:
      "Deploy a single node-level eBPF daemon that inspects socket operations and syscalls kernel-side, decoupling security policy enforcement from application pod lifecycles.",
    keyTakeaways: [
      "eBPF eliminates per-pod proxy memory overhead by operating once per host kernel.",
      "The kernel verifier guarantees eBPF programs terminate safely without crashing the host.",
      "Pair eBPF network policies (L3/L4) with syscall monitoring (execve, setuid) for full runtime defense.",
    ],
    sections: [
      {
        id: "the-sidecar-tax",
        heading: "1. The Hidden Cost of User-Space Sidecars",
        body: [
          "Traditional service meshes inject an Envoy proxy into every pod. While this provides mTLS and L7 telemetry without changing application code, every inbound and outbound packet traverses the Linux TCP/IP stack twice.",
          "At 500+ pods per cluster, sidecar memory reservations and context-switching overhead become a measurable cloud bill line item—and a blind spot for non-HTTP syscalls.",
        ],
        callout: {
          type: "threat",
          title: "Blind Spot Alert",
          text: "Network-only sidecars cannot see a container executing `curl` against a metadata IP via raw sockets or spawning a reverse shell.",
        },
        simulation: {
          sectionId: "the-sidecar-tax",
          label: "Step 1 · User-Space Sidecar Tax",
          diagramMode: "threat",
          activeNodes: ["client", "edge", "mesh"],
          packetPath: "double-hop",
          caption:
            "Packets traverse the TCP/IP stack twice per pod. Raw syscalls (execve) bypass the user-space proxy completely.",
          telemetry: [
            { label: "Proxy Hops", value: "2x TCP Loopback", status: "warn" },
            { label: "Syscall Visibility", value: "Blind", status: "warn" },
          ],
        },
      },
      {
        id: "how-ebpf-hooks-work",
        heading: "2. How eBPF Hooks Into the Kernel Safely",
        body: [
          "eBPF programs are compiled to bytecode, checked by the Linux kernel verifier for bounded loops and valid memory access, and JIT-compiled to native CPU instructions.",
          "For cloud security, two hook families matter most: socket/XDP hooks for high-speed packet filtering, and LSM/tracepoint hooks for process execution and file-access enforcement.",
        ],
        codeSnippet: {
          language: "yaml",
          filename: "tetragon-execve-policy.yaml",
          code: `apiVersion: cilium.io/v1alpha1
kind: TracingPolicy
metadata:
  name: block-shell-in-prod-pods
spec:
  kprobes:
    - call: "sys_execve"
      syscall: true
      args:
        - index: 0
          type: "string"
      selectors:
        - matchArgs:
            - index: 0
              operator: "Postfix"
              values: ["/sh", "/bash"]
          matchActions:
            - action: Sigkill`,
        },
        simulation: {
          sectionId: "how-ebpf-hooks-work",
          label: "Step 2 · Kernel-Level eBPF Hook",
          diagramMode: "defense",
          activeNodes: ["client", "edge", "kernel", "vault"],
          blockedAt: "kernel",
          packetPath: "kernel-fast",
          caption:
            "eBPF TracingPolicy attaches directly to sys_execve in the Linux kernel—terminating unauthorized /bin/sh spawns before execution.",
          telemetry: [
            { label: "Enforcement", value: "Kernel Ring-0", status: "ok" },
            { label: "Pod Overhead", value: "~0 MB/pod", status: "ok" },
          ],
        },
      },
      {
        id: "when-to-keep-proxies",
        heading: "3. Modern Hybrid Pattern: eBPF + Waypoint Proxies",
        body: [
          "You do not need to abandon L7 routing. The modern approach uses eBPF for L3/L4 enforcement, mTLS identity, and syscall auditing, while delegating complex L7 retries or gRPC transcoding to shared per-node or per-namespace waypoint proxies.",
        ],
        callout: {
          type: "approach",
          title: "Modern Architecture Rule",
          text: "Keep L3/L4 and syscall enforcement in eBPF; reserve user-space proxies only for workloads that genuinely need L7 traffic shaping.",
        },
        simulation: {
          sectionId: "when-to-keep-proxies",
          label: "Step 3 · Hybrid eBPF + Waypoint",
          diagramMode: "hybrid",
          activeNodes: ["client", "edge", "mesh", "kernel", "vault"],
          packetPath: "mtls-direct",
          caption:
            "eBPF handles L3/L4 mTLS & syscall security at wire speed while shared per-node waypoints manage complex L7 routing.",
          telemetry: [
            { label: "L3/L4 + Syscall", value: "eBPF Fast Path", status: "ok" },
            { label: "L7 Routing", value: "Shared Waypoint", status: "info" },
          ],
        },
      },
    ],
  },
  {
    slug: "spiffe-spire-workload-identity-mtls",
    title: "Zero-Trust Workload Identity with SPIFFE/SPIRE & mTLS",
    subtitle:
      "Eliminating static API keys and long-lived secrets using cryptographic workload attestation.",
    domain: "cybersecurity",
    difficulty: "Architecture",
    tags: ["Zero Trust", "SPIFFE", "mTLS", "Identity"],
    readTime: "11 min read",
    updatedAt: "Nov 2026",
    featured: true,
    tldr: "IP addresses and static bearer tokens are brittle in ephemeral cloud environments. SPIFFE issues short-lived X.509 SVID certificates based on kernel/cloud attestation, letting services prove who they are with automatic rotation.",
    deepDiveSummary:
      "SPIRE attests both the node (via AWS IID, GCP, or TPM) and the workload (via Kubernetes pod UID, cgroup, or Unix user) before minting a short-lived SPIFFE ID URI SAN certificate.",
    threatOrProblem:
      "Static secrets in environment variables or ConfigMaps leak via logs, SSRF, and CI/CD artifacts. Once stolen, an attacker can replay them from anywhere.",
    modernApproach:
      "Replace shared secrets with short-lived, automatically rotated X.509 SVIDs bound to workload identity and mutual TLS.",
    keyTakeaways: [
      "Identity is derived from runtime attestation, never hardcoded credentials.",
      "Short TTLs (e.g., 1 hour) shrink the blast radius of any memory-dump compromise.",
      "SPIFFE IDs (`spiffe://trust-domain/ns/prod/sa/payments`) work across multi-cloud and bare metal.",
    ],
    sections: [
      {
        id: "why-ips-fail",
        heading: "1. Why IP-Based Trust Breaks in the Cloud",
        body: [
          "In autoscaling clusters, a pod's IP address is recycled in minutes. Firewall rules tied to CIDR blocks either become stale or overly permissive.",
          "SPIFFE shifts authentication from 'where is this packet coming from?' to 'which cryptographically attested workload sent this?'",
        ],
      },
      {
        id: "attestation-flow",
        heading: "2. Node & Workload Attestation Flow",
        body: [
          "A SPIRE Agent running on each host proves the host's identity to the SPIRE Server using cloud metadata or hardware TPM.",
          "When a workload starts, it queries the local Unix domain socket. The Agent inspects the caller's Linux cgroup and Kubernetes pod metadata, then hands over an X.509 SVID.",
        ],
        codeSnippet: {
          language: "text",
          filename: "spiffe-id-anatomy.txt",
          code: `spiffe://prod.stratumsec.internal/ns/checkout/sa/ledger-api
└─scheme─┘└────────trust domain───────┘└─────workload path─────┘`,
        },
        callout: {
          type: "takeaway",
          title: "Key Design Win",
          text: "Workloads never store private keys on disk—SVIDs live in memory and rotate seamlessly via the Workload API.",
        },
      },
    ],
  },
  {
    slug: "aws-iam-permission-boundaries-scps",
    title: "Taming AWS IAM Blast Radius: Permission Boundaries & SCPs",
    subtitle:
      "How to let developers ship IAM roles safely without handing out Organization-wide admin escalation.",
    domain: "cloud",
    difficulty: "Deep Dive",
    tags: ["AWS", "IAM", "Least Privilege", "Governance"],
    readTime: "8 min read",
    updatedAt: "Nov 2026",
    tldr: "Granting `iam:CreateRole` without guardrails is equivalent to granting full admin. Combine Organization SCPs (account ceiling) with IAM Permission Boundaries (role ceiling) so teams can self-serve safely.",
    deepDiveSummary:
      "AWS evaluates effective permissions as the intersection of identity policies, resource policies, SCPs, and permission boundaries. An explicit deny or missing allow in any layer blocks the action.",
    threatOrProblem:
      "Developers need to create Lambda/ECS execution roles in CI/CD, but unrestricted `iam:CreateRole` + `iam:AttachRolePolicy` lets a compromised pipeline attach `AdministratorAccess` to itself.",
    modernApproach:
      "Require every newly created role to carry a standardized Permission Boundary via an IAM condition key (`iam:PermissionsBoundary`), enforced at both IAM and SCP layers.",
    keyTakeaways: [
      "SCPs protect account boundaries; Permission Boundaries protect individual roles.",
      "Always pair `iam:CreateRole` with `Condition: StringEquals iam:PermissionsBoundary`.",
      "Block `iam:DeleteRolePermissionsBoundary` from non-security roles.",
    ],
    sections: [
      {
        id: "the-intersection-model",
        heading: "1. The Policy Intersection Model",
        body: [
          "A common misconception is that a Permission Boundary grants permissions. It does not—it only defines the maximum permissions a role can ever exercise, even if someone attaches `AdministratorAccess` to it.",
        ],
        codeSnippet: {
          language: "json",
          filename: "enforce-boundary-condition.json",
          code: `{
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
}`,
        },
      },
    ],
  },
  {
    slug: "kubernetes-rbac-privilege-escalation",
    title: "Kubernetes RBAC Privilege Escalation Paths & Hardening",
    subtitle:
      "The subtle RBAC verbs (`escalate`, `bind`, `impersonate`, `pods/exec`) that silently grant cluster-admin.",
    domain: "cybersecurity",
    difficulty: "Deep Dive",
    tags: ["Kubernetes", "RBAC", "Hardening", "AppSec"],
    readTime: "10 min read",
    updatedAt: "Oct 2026",
    tldr: "Even without `cluster-admin`, permissions like `pods/create` (mounting hostPath or privileged service accounts), `secrets/get`, or `roles/bind` let an attacker pivot to full cluster control.",
    deepDiveSummary:
      "Kubernetes API server enforces escalation checks on `create`/`update` of Roles, unless the actor holds `escalate` or `bind`. Meanwhile, indirect paths via `pods/exec` or daemonset creation bypass RBAC limits through node credentials.",
    threatOrProblem:
      "Teams audit for `verbs: ['*']` but miss indirect escalation paths like creating a pod that mounts a high-privilege ServiceAccount token in the same namespace.",
    modernApproach:
      "Disable `automountServiceAccountToken` by default, restrict `pods/exec` in production, and run automated RBAC graph audits in CI.",
    keyTakeaways: [
      "Audit indirect escalation verbs: `bind`, `escalate`, `impersonate`, `pods/exec`.",
      "Set `automountServiceAccountToken: false` on every workload that does not talk to the K8s API.",
      "Enforce Pod Security Standards (`restricted`) via Admission Control.",
    ],
    sections: [
      {
        id: "indirect-paths",
        heading: "1. Indirect Escalation Through Pod Creation",
        body: [
          "If a CI runner can create pods in a namespace that also contains a privileged `ClusterRoleBinding` ServiceAccount, the runner can schedule a pod referencing that `serviceAccountName` and read its projected token.",
        ],
        callout: {
          type: "threat",
          title: "Common Misconfiguration",
          text: "Granting `pods: create` in `kube-system` or `argocd` namespaces is effectively equivalent to cluster admin.",
        },
      },
    ],
  },
  {
    slug: "envelope-encryption-cloud-kms",
    title: "Envelope Encryption & Key Rotation at Scale with Cloud KMS",
    subtitle:
      "Why you never send raw application payloads to KMS—and how DEKs + KEKs keep latency low and compliance happy.",
    domain: "cloud",
    difficulty: "Foundational",
    tags: ["Cryptography", "KMS", "Data Security", "Cloud"],
    readTime: "7 min read",
    updatedAt: "Oct 2026",
    tldr: "Cloud KMS APIs have strict rate limits and 4KB payload caps. Envelope encryption generates a fast local Data Encryption Key (DEK) for your data, then encrypts only that DEK with a KMS Key Encryption Key (KEK).",
    deepDiveSummary:
      "By storing the KMS-encrypted DEK alongside the ciphertext, applications decrypt locally in memory after a single KMS `Decrypt` call—and can cache DEKs briefly with strict TTLs.",
    threatOrProblem:
      "Calling KMS directly per database row throttles under load, increases p99 latency, and exposes plaintext over network boundaries unnecessarily.",
    modernApproach:
      "Use standard envelope encryption (AES-256-GCM DEK + KMS KEK) with authenticated encryption context (AAD) bound to tenant ID.",
    keyTakeaways: [
      "Always bind `EncryptionContext` (AAD) to tenant/record ID to prevent ciphertext swapping.",
      "Rotating the KEK in KMS does not require re-encrypting terabytes of existing data.",
      "Zeroize plaintext DEKs from memory after use where language runtimes permit.",
    ],
    sections: [
      {
        id: "encryption-context",
        heading: "1. Preventing Confused Deputy Attacks with AAD",
        body: [
          "Passing `tenant_id` in KMS `EncryptionContext` cryptographically binds the wrapped DEK to that tenant. Even if an attacker swaps encrypted blobs between rows, decryption fails.",
        ],
      },
    ],
  },
  {
    slug: "ztna-vs-legacy-vpn-architecture",
    title: "Replacing Legacy VPNs with Zero-Trust Network Access (ZTNA)",
    subtitle:
      "Moving from flat subnet tunnels to identity-aware, per-application proxies with continuous device posture.",
    domain: "architecture",
    difficulty: "Architecture",
    tags: ["ZTNA", "Zero Trust", "Networking", "Modern Approach"],
    readTime: "9 min read",
    updatedAt: "Nov 2026",
    tldr: "VPNs place authenticated users onto a trusted internal network, enabling lateral movement if a laptop is compromised. ZTNA brokers per-app connections after verifying identity, device posture, and context on every session.",
    deepDiveSummary:
      "With an outbound-only connector inside private VPCs, internal apps never expose public inbound ports. Users authenticate at an edge Identity-Aware Proxy before a single packet reaches the origin.",
    threatOrProblem:
      "VPN concentrators are prime targets for unauthenticated RCEs, and once inside the tunnel, attackers scan internal RFC1918 subnets freely.",
    modernApproach:
      "Eliminate inbound VPN ports using outbound-initiated ZTNA connectors + OIDC + device posture checks.",
    keyTakeaways: [
      "Zero inbound firewall ports open on your private cloud VPC.",
      "Access is scoped to a specific app (`grafana.internal`), never a whole `/16` subnet.",
      "Session policies re-evaluate device disk encryption and OS patch level continuously.",
    ],
    sections: [
      {
        id: "outbound-connectors",
        heading: "1. Outbound-Only Connectors Eliminate Attack Surface",
        body: [
          "Instead of exposing a VPN gateway on port 443/UDP 1194, a lightweight connector inside your VPC dials out to the ZTNA control plane over mutual TLS.",
        ],
      },
    ],
  },
];

export interface ArchitectureLayer {
  id: string;
  layer: string;
  subtitle: string;
  threatVector: string;
  modernApproach: string;
  recommendedSlug: string;
  recommendedTitle: string;
  controls: string[];
}

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: "identity",
    layer: "01 · Identity & Control Plane",
    subtitle: "Human, CI/CD, and Workload Attestation",
    threatVector: "Long-lived IAM keys, over-privileged roles, and token replay.",
    modernApproach: "Short-lived OIDC federation, SPIFFE/SPIRE SVIDs, and IAM Permission Boundaries.",
    recommendedSlug: "spiffe-spire-workload-identity-mtls",
    recommendedTitle: "Zero-Trust Workload Identity with SPIFFE/SPIRE",
    controls: ["OIDC Federation", "Permission Boundaries", "mTLS SVIDs"],
  },
  {
    id: "network",
    layer: "02 · Network & Edge Access",
    subtitle: "Ingress, East-West Mesh, and Private Connectivity",
    threatVector: "Exposed VPN concentrators and flat RFC1918 lateral movement.",
    modernApproach: "Identity-Aware ZTNA proxies with outbound-only VPC connectors.",
    recommendedSlug: "ztna-vs-legacy-vpn-architecture",
    recommendedTitle: "Replacing Legacy VPNs with ZTNA",
    controls: ["No Inbound Ports", "Per-App AuthZ", "Device Posture"],
  },
  {
    id: "workload",
    layer: "03 · Kernel & Workload Runtime",
    subtitle: "Kubernetes Pods, Containers, and Linux Syscalls",
    threatVector: "Container escapes, RBAC escalation, and blind user-space proxies.",
    modernApproach: "eBPF kernel-level syscall/network enforcement + Restricted Pod Security.",
    recommendedSlug: "ebpf-kernel-observability-vs-sidecars",
    recommendedTitle: "eBPF Kernel-Level Security vs. Sidecars",
    controls: ["eBPF TracingPolicy", "Pod Security Restricted", "No Auto-Token"],
  },
  {
    id: "data",
    layer: "04 · Data & Cryptographic Plane",
    subtitle: "Storage Encryption, KMS, and Secrets Lifecycle",
    threatVector: "Cross-tenant ciphertext swapping and unencrypted backups.",
    modernApproach: "Envelope encryption (DEK + KMS KEK) with strict AAD EncryptionContext.",
    recommendedSlug: "envelope-encryption-cloud-kms",
    recommendedTitle: "Envelope Encryption & Key Rotation with KMS",
    controls: ["AES-256-GCM DEK", "KMS AAD Binding", "Auto KEK Rotation"],
  },
];
