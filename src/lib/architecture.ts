export type ArchitectureLayerId = "identity" | "network" | "workload" | "data";
export type ArchitectureScenarioId = "zero-trust" | "shell-escape" | "token-replay";

export interface ArchitectureLayer {
  id: ArchitectureLayerId;
  index: string;
  shortLabel: string;
  name: string;
  layer: string;
  subtitle: string;
  accent: "blue" | "lime";
  threatVector: string;
  modernApproach: string;
  recommendedSlug: string;
  recommendedTitle: string;
  controls: string[];
  protocols: string[];
}

export interface ScenarioHop {
  layerId: ArchitectureLayerId;
  status: "pass" | "blocked" | "isolated";
  summary: string;
}

export interface ArchitectureScenario {
  id: ArchitectureScenarioId;
  title: string;
  shortTitle: string;
  badge: string;
  summary: string;
  blockedLayerId: ArchitectureLayerId | null;
  focusLayerId: ArchitectureLayerId;
  recommendedSlug: string;
  recommendedTitle: string;
  hops: ScenarioHop[];
}

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: "identity",
    index: "01",
    shortLabel: "Identity · SPIFFE / IAM",
    name: "Identity & Control Plane",
    layer: "01 · Identity & Control Plane",
    subtitle: "Human, CI/CD, and Workload Attestation",
    accent: "lime",
    threatVector:
      "Long-lived IAM keys, over-privileged roles, and static bearer token replay.",
    modernApproach:
      "Short-lived OIDC federation, SPIFFE/SPIRE X.509 SVIDs, and IAM Permission Boundaries.",
    recommendedSlug: "what-is-cloud-computing",
    recommendedTitle: "Cloud Computing Fundamentals",
    controls: ["OIDC Federation", "Permission Boundaries", "mTLS SVIDs"],
    protocols: ["SPIFFE", "X.509", "AWS IAM SCP"],
  },
  {
    id: "network",
    index: "02",
    shortLabel: "Edge · ZTNA Proxy",
    name: "Network & Edge Access",
    layer: "02 · Network & Edge Access",
    subtitle: "Ingress, East-West Mesh, and Private Connectivity",
    accent: "blue",
    threatVector:
      "Exposed VPN concentrators and flat RFC1918 subnet lateral movement.",
    modernApproach:
      "Identity-Aware ZTNA proxies with outbound-only VPC connectors and continuous device posture.",
    recommendedSlug: "what-is-cloud-computing",
    recommendedTitle: "Cloud Computing Fundamentals",
    controls: ["Zero Inbound Ports", "Per-App AuthZ", "Device Posture"],
    protocols: ["mTLS", "ZTNA", "TLS 1.3"],
  },
  {
    id: "workload",
    index: "03",
    shortLabel: "Runtime · eBPF / K8s",
    name: "Kernel & Workload Runtime",
    layer: "03 · Kernel & Workload Runtime",
    subtitle: "Kubernetes Pods, Containers, and Linux Syscalls",
    accent: "lime",
    threatVector:
      "Container escapes, indirect RBAC escalation, and blind user-space proxy sidecars.",
    modernApproach:
      "eBPF kernel-level syscall/network enforcement paired with Restricted Pod Security Standards.",
    recommendedSlug: "what-is-cloud-computing",
    recommendedTitle: "Cloud Computing Fundamentals",
    controls: ["eBPF TracingPolicy", "Pod Security Restricted", "No Auto-Token"],
    protocols: ["eBPF / XDP", "Cilium", "Tetragon"],
  },
  {
    id: "data",
    index: "04",
    shortLabel: "Data · Cloud KMS Vault",
    name: "Data & Cryptographic Plane",
    layer: "04 · Data & Cryptographic Plane",
    subtitle: "Storage Encryption, KMS, and Secrets Lifecycle",
    accent: "blue",
    threatVector:
      "Cross-tenant ciphertext swapping, KMS throttling, and unencrypted snapshots.",
    modernApproach:
      "Envelope encryption (AES-256-GCM DEK + Cloud KMS KEK) with strict AAD EncryptionContext.",
    recommendedSlug: "what-is-cloud-computing",
    recommendedTitle: "Cloud Computing Fundamentals",
    controls: ["AES-256-GCM DEK", "KMS AAD Binding", "Auto KEK Rotation"],
    protocols: ["Cloud KMS", "AEAD / GCM", "HSM"],
  },
];

export const ARCHITECTURE_SCENARIOS: ArchitectureScenario[] = [
  {
    id: "zero-trust",
    title: "Verified Zero-Trust Request Flow",
    shortTitle: "Zero-Trust Flow",
    badge: "All 4 Strata Verified",
    summary:
      "Watch a legitimate service call pass cryptographic workload attestation, outbound-only ZTNA routing, eBPF socket policy, and AAD-bound KMS decryption.",
    blockedLayerId: null,
    focusLayerId: "identity",
    recommendedSlug: "what-is-cloud-computing",
    recommendedTitle: "Cloud Computing Fundamentals",
    hops: [
      {
        layerId: "identity",
        status: "pass",
        summary: "SPIRE Agent mints short-lived X.509 SVID after kernel cgroup attestation.",
      },
      {
        layerId: "network",
        status: "pass",
        summary: "ZTNA proxy verifies mTLS identity and routes strictly to target service.",
      },
      {
        layerId: "workload",
        status: "pass",
        summary: "eBPF socket hook verifies pod identity and allows L3/L4 fast path.",
      },
      {
        layerId: "data",
        status: "pass",
        summary: "Cloud KMS unwraps tenant-bound DEK using matching AAD EncryptionContext.",
      },
    ],
  },
  {
    id: "shell-escape",
    title: "Container Reverse-Shell & Escape Attempt",
    shortTitle: "eBPF Syscall Block",
    badge: "Intercepted at Layer 03",
    summary:
      "A compromised pod attempts to spawn /bin/sh via sys_execve and exfiltrate secrets. Tetragon eBPF intercepts and kills the process in kernel Ring-0 before Data Plane access.",
    blockedLayerId: "workload",
    focusLayerId: "workload",
    recommendedSlug: "what-is-cloud-computing",
    recommendedTitle: "Cloud Computing Fundamentals",
    hops: [
      {
        layerId: "identity",
        status: "pass",
        summary: "Initial HTTP ingress reached an application pod with a vulnerability.",
      },
      {
        layerId: "network",
        status: "pass",
        summary: "Malicious payload arrived over allowed port 443 inside application traffic.",
      },
      {
        layerId: "workload",
        status: "blocked",
        summary: "BLOCKED: eBPF kprobe on sys_execve matches /bin/sh and issues SIGKILL in kernel.",
      },
      {
        layerId: "data",
        status: "isolated",
        summary: "ISOLATED: KMS keys and database credentials are never reached.",
      },
    ],
  },
  {
    id: "token-replay",
    title: "Stolen Credential Replay from Unmanaged Host",
    shortTitle: "ZTNA + SVID Block",
    badge: "Blocked at Layer 01–02",
    summary:
      "An attacker replays a leaked credential from outside the VPC. Because ZTNA requires device posture and SPIFFE binds identity to runtime attestation, the attempt dies at the edge.",
    blockedLayerId: "network",
    focusLayerId: "network",
    recommendedSlug: "what-is-cloud-computing",
    recommendedTitle: "Cloud Computing Fundamentals",
    hops: [
      {
        layerId: "identity",
        status: "pass",
        summary: "Attacker presents a stolen static token from an unattested external device.",
      },
      {
        layerId: "network",
        status: "blocked",
        summary: "BLOCKED: ZTNA Edge rejects missing mTLS SVID & failed device posture check.",
      },
      {
        layerId: "workload",
        status: "isolated",
        summary: "ISOLATED: Zero inbound VPC ports exist; Kubernetes workloads stay unreachable.",
      },
      {
        layerId: "data",
        status: "isolated",
        summary: "ISOLATED: Cryptographic data plane receives zero packets.",
      },
    ],
  },
];
