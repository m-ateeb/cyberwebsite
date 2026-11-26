"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ARCHITECTURE_LAYERS,
  type ArchitectureLayerId,
  type ArchitectureScenarioId,
} from "@/lib/architecture";

interface CloudSecurity3DSceneProps {
  selectedLayerId: ArchitectureLayerId;
  onSelectLayer: (layerId: ArchitectureLayerId) => void;
  scenarioId: ArchitectureScenarioId;
  blockedLayerId: ArchitectureLayerId | null;
  activeStepIndex: number;
  resetSignal: number;
}

interface ProjectedNodeLabel {
  id: ArchitectureLayerId;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  visible: boolean;
}

const NODE_POSITIONS: Record<ArchitectureLayerId, [number, number, number]> = {
  identity: [-3.45, 0, 0.35],
  network: [-1.15, 0, -0.35],
  workload: [1.15, 0, 0.35],
  data: [3.45, 0, -0.35],
};

const NODE_META: Record<
  ArchitectureLayerId,
  { title: string; subtitle: string; labelY: number }
> = {
  identity: {
    title: "01 · Client",
    subtitle: "SPIFFE / OIDC",
    labelY: 1.25,
  },
  network: {
    title: "02 · ZTNA Gate",
    subtitle: "mTLS Edge",
    labelY: 1.9,
  },
  workload: {
    title: "03 · K8s + eBPF",
    subtitle: "Kernel Ring-0",
    labelY: 1.35,
  },
  data: {
    title: "04 · DB + KMS",
    subtitle: "AES-256 Vault",
    labelY: 1.45,
  },
};

const STEP_ORDER: ArchitectureLayerId[] = ["identity", "network", "workload", "data"];

export function CloudSecurity3DScene({
  selectedLayerId,
  onSelectLayer,
  scenarioId,
  blockedLayerId,
  activeStepIndex,
  resetSignal,
}: CloudSecurity3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedLayerId);
  const scenarioRef = useRef(scenarioId);
  const blockedRef = useRef(blockedLayerId);
  const stepRef = useRef(activeStepIndex);
  const onSelectRef = useRef(onSelectLayer);
  const resetTargetRef = useRef<(() => void) | null>(null);

  const [webglFailed, setWebglFailed] = useState(false);
  const [labels, setLabels] = useState<ProjectedNodeLabel[]>([]);

  useEffect(() => {
    selectedRef.current = selectedLayerId;
  }, [selectedLayerId]);

  useEffect(() => {
    scenarioRef.current = scenarioId;
  }, [scenarioId]);

  useEffect(() => {
    blockedRef.current = blockedLayerId;
  }, [blockedLayerId]);

  useEffect(() => {
    stepRef.current = activeStepIndex;
  }, [activeStepIndex]);

  useEffect(() => {
    onSelectRef.current = onSelectLayer;
  }, [onSelectLayer]);

  useEffect(() => {
    if (resetSignal > 0) {
      resetTargetRef.current?.();
    }
  }, [resetSignal]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => setWebglFailed(true));
      return;
    }

    let width = container.clientWidth || 720;
    let height = container.clientHeight || 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    const fitCamera = (w: number, h: number) => {
      const aspect = Math.max(0.75, w / Math.max(1, h));
      const baseZ = aspect < 1.3 ? 13.4 : aspect < 1.8 ? 11.2 : 9.6;
      const baseY = aspect < 1.3 ? 5.8 : 4.5;
      camera.aspect = w / Math.max(1, h);
      camera.position.set(0.1, baseY, baseZ);
      camera.lookAt(0, 0.35, 0);
      camera.updateProjectionMatrix();
    };
    fitCamera(width, height);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const keyLight = new THREE.DirectionalLight(0xeef6ff, 1.7);
    keyLight.position.set(7, 11, 7);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x58c8ef, 2.0, 22);
    rimLight.position.set(-5, 4, 4);
    scene.add(rimLight);

    // Architectural blueprint floor grid
    const grid = new THREE.GridHelper(14, 28, 0x202b37, 0x101720);
    grid.position.y = -0.02;
    root.add(grid);

    const hitMeshes: THREE.Mesh[] = [];
    const nodeGroups: Record<
      ArchitectureLayerId,
      {
        group: THREE.Group;
        accentMat: THREE.MeshStandardMaterial;
        ringMat: THREE.MeshBasicMaterial;
        ring: THREE.Mesh;
        baseColor: number;
      }
    > = {} as never;

    const makePad = (id: ArchitectureLayerId, w: number, d: number, color: number) => {
      const g = new THREE.Group();
      const [x, y, z] = NODE_POSITIONS[id];
      g.position.set(x, y, z);
      root.add(g);

      const padMat = new THREE.MeshStandardMaterial({
        color: 0x111923,
        metalness: 0.45,
        roughness: 0.35,
      });
      const pad = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, d), padMat);
      pad.position.y = 0.06;
      pad.userData = { layerId: id };
      g.add(pad);
      hitMeshes.push(pad);

      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(Math.max(w, d) * 0.56, Math.max(w, d) * 0.62, 32), ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.02;
      g.add(ring);

      const accentMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.35,
        metalness: 0.35,
        roughness: 0.28,
      });

      nodeGroups[id] = { group: g, accentMat, ringMat, ring, baseColor: color };
      return { g, accentMat };
    };

    // 01: Client / Workload Laptop + Identity Badge
    {
      const { g, accentMat } = makePad("identity", 1.5, 1.35, 0xb7f36b);
      const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1e2b3a, metalness: 0.5, roughness: 0.3 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.08, 0.68), chassisMat);
      base.position.set(0, 0.16, 0.08);
      base.userData = { layerId: "identity" };
      const lid = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.6, 0.06), chassisMat);
      lid.position.set(0, 0.48, -0.24);
      lid.rotation.x = -0.18;
      lid.userData = { layerId: "identity" };
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.46), accentMat);
      screen.position.set(0, 0.48, -0.205);
      screen.rotation.x = -0.18;
      screen.userData = { layerId: "identity" };
      g.add(base, lid, screen);
      hitMeshes.push(base, lid, screen);
    }

    // 02: ZTNA Edge Gateway Arch + Inspection Shield
    const shieldWallMat = new THREE.MeshBasicMaterial({
      color: 0x58c8ef,
      transparent: true,
      opacity: 0.26,
      side: THREE.DoubleSide,
    });
    {
      const { g, accentMat } = makePad("network", 1.3, 1.6, 0x58c8ef);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e2b3a, metalness: 0.45, roughness: 0.3 });
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 0.22), frameMat);
      p1.position.set(0, 0.85, -0.58);
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 0.22), frameMat);
      p2.position.set(0, 0.85, 0.58);
      const top = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 1.42), accentMat);
      top.position.set(0, 1.62, 0);
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(1.06, 1.38), shieldWallMat);
      wall.rotation.y = Math.PI / 2;
      wall.position.set(0, 0.85, 0);
      [p1, p2, top, wall].forEach((m) => {
        m.userData = { layerId: "network" };
        g.add(m);
        hitMeshes.push(m);
      });
    }

    // 03: Kubernetes Node with visible eBPF Linux Kernel layer + 3 Container Pods
    {
      const { g, accentMat } = makePad("workload", 1.9, 1.65, 0xb7f36b);
      const kernelPlate = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.2, 1.42), accentMat);
      kernelPlate.position.y = 0.22;
      kernelPlate.userData = { layerId: "workload" };
      g.add(kernelPlate);
      hitMeshes.push(kernelPlate);

      const podMat = new THREE.MeshStandardMaterial({
        color: 0x1b2b3d,
        emissive: 0x58c8ef,
        emissiveIntensity: 0.22,
        metalness: 0.4,
        roughness: 0.3,
      });
      [
        [-0.5, -0.32],
        [0.0, 0.32],
        [0.52, -0.32],
      ].forEach(([px, pz]) => {
        const pod = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.42), podMat);
        pod.position.set(px, 0.58, pz);
        pod.userData = { layerId: "workload" };
        g.add(pod);
        hitMeshes.push(pod);
      });
    }

    // 04: Encrypted Database Cylinder + Cloud KMS Key Cube
    {
      const { g, accentMat } = makePad("data", 1.6, 1.55, 0x58c8ef);
      const dbBodyMat = new THREE.MeshStandardMaterial({ color: 0x1b2736, metalness: 0.5, roughness: 0.3 });
      [0, 0.32, 0.64].forEach((y) => {
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.22, 24), dbBodyMat);
        disc.position.set(-0.18, y + 0.24, 0);
        disc.userData = { layerId: "data" };
        g.add(disc);
        hitMeshes.push(disc);

        const trim = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.024, 8, 32), accentMat);
        trim.rotation.x = Math.PI / 2;
        trim.position.set(-0.18, y + 0.34, 0);
        g.add(trim);
      });

      // KMS Key Vault Cube sitting next to the DB
      const kms = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), accentMat);
      kms.position.set(0.46, 0.34, 0.32);
      kms.userData = { layerId: "data" };
      g.add(kms);
      hitMeshes.push(kms);
    }

    // Pipeline segments connecting the 4 staggered infrastructure nodes
    const segPairs: [ArchitectureLayerId, ArchitectureLayerId][] = [
      ["identity", "network"],
      ["network", "workload"],
      ["workload", "data"],
    ];
    const segMats = segPairs.map(([fromId, toId]) => {
      const [x1, , z1] = NODE_POSITIONS[fromId];
      const [x2, , z2] = NODE_POSITIONS[toId];
      const mat = new THREE.LineBasicMaterial({ color: 0x58c8ef, transparent: true, opacity: 0.7 });
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x1, 0.42, z1),
          new THREE.Vector3(x2, 0.42, z2),
        ]),
        mat
      );
      root.add(line);
      return mat;
    });

    // Animated request/attack packet travelling along the active hop path
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xb7f36b });
    const packetMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), packetMat);
    root.add(packetMesh);

    // Steady camera by default; smooth orbit only when user drags
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-99, -99);
    let isDragging = false;
    let dragMoved = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = -0.06;
    let targetRotX = 0.02;

    resetTargetRef.current = () => {
      targetRotY = -0.06;
      targetRotX = 0.02;
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      dragMoved = false;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMove = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY);
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
        targetRotY = Math.max(-0.85, Math.min(0.85, targetRotY + dx * 0.007));
        targetRotX = Math.max(-0.22, Math.min(0.32, targetRotX + dy * 0.005));
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!dragMoved) {
        updatePointer(e.clientX, e.clientY);
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(hitMeshes, false);
        if (hits.length > 0) {
          const hitId = hits[0].object.userData?.layerId as ArchitectureLayerId | undefined;
          if (hitId) onSelectRef.current(hitId);
        }
      }
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          width = w;
          height = h;
          fitCamera(w, h);
          renderer.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let lastTime = performance.now();
    const startTime = lastTime;
    let packetT = 0;
    let frameCount = 0;
    const proj = new THREE.Vector3();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      root.rotation.y += (targetRotY - root.rotation.y) * 0.1;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      dom.style.cursor = hits.length > 0 ? "pointer" : isDragging ? "grabbing" : "grab";

      const blockedId = blockedRef.current;
      const blockedIdx = blockedId ? STEP_ORDER.indexOf(blockedId) : 99;
      const currentStepIdx = stepRef.current;
      const isThreat = scenarioRef.current !== "zero-trust";

      STEP_ORDER.forEach((id, idx) => {
        const node = nodeGroups[id];
        const isSelected = selectedRef.current === id;
        const isBlocked = blockedId === id;
        const isIsolated = idx > blockedIdx;

        const targetScale = isSelected || isBlocked ? 1.08 : 1.0;
        node.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

        const col = isBlocked
          ? 0xf5b942
          : isIsolated
          ? 0x394959
          : node.baseColor;
        node.accentMat.color.lerp(new THREE.Color(col), 0.14);
        node.accentMat.emissive.lerp(new THREE.Color(col), 0.14);
        node.accentMat.emissiveIntensity = isBlocked
          ? 0.55 + 0.25 * Math.sin(elapsed * 6)
          : isSelected
          ? 0.55
          : isIsolated
          ? 0.08
          : 0.28;

        node.ringMat.color.setHex(col);
        node.ringMat.opacity = isBlocked
          ? 0.65 + 0.3 * Math.sin(elapsed * 6)
          : isSelected
          ? 0.85
          : 0.2;
      });

      shieldWallMat.color.setHex(blockedId === "network" ? 0xf5b942 : 0x58c8ef);
      shieldWallMat.opacity = blockedId === "network" ? 0.5 : 0.24;

      segMats.forEach((mat, idx) => {
        const isBlockedPast = idx >= blockedIdx;
        mat.color.setHex(isBlockedPast ? 0x2a3644 : isThreat ? 0xf5b942 : 0x58c8ef);
        mat.opacity = isBlockedPast ? 0.25 : 0.75;
      });

      // Animate packet cleanly along the staggered node positions up to the active/blocked hop
      const maxReachIdx = Math.min(currentStepIdx, blockedIdx);
      if (!prefersReduced) {
        packetT = (packetT + dt * 0.42) % 1;
      }
      if (maxReachIdx === 0) {
        const [sx, , sz] = NODE_POSITIONS.identity;
        packetMesh.position.set(sx, 0.52, sz);
      } else {
        const segFloat = packetT * maxReachIdx;
        const segIdx = Math.min(maxReachIdx - 1, Math.floor(segFloat));
        const localT = segFloat - segIdx;
        const [x1, , z1] = NODE_POSITIONS[STEP_ORDER[segIdx]];
        const [x2, , z2] = NODE_POSITIONS[STEP_ORDER[segIdx + 1]];
        const px = x1 + (x2 - x1) * localT;
        const pz = z1 + (z2 - z1) * localT;
        packetMesh.position.set(px, 0.48 + Math.sin(localT * Math.PI) * 0.28, pz);
      }
      packetMat.color.setHex(isThreat ? 0xf5b942 : 0xb7f36b);

      renderer.render(scene, camera);

      frameCount++;
      if (frameCount % 3 === 0) {
        root.updateMatrixWorld();
        const nextLabels: ProjectedNodeLabel[] = STEP_ORDER.map((id) => {
          const [nx, , nz] = NODE_POSITIONS[id];
          proj.set(nx, NODE_META[id].labelY, nz);
          proj.applyMatrix4(root.matrixWorld);
          proj.project(camera);
          const rawX = (proj.x * 0.5 + 0.5) * width;
          const rawY = (-proj.y * 0.5 + 0.5) * height;
          return {
            id,
            title: NODE_META[id].title,
            subtitle: NODE_META[id].subtitle,
            x: Math.max(82, Math.min(width - 82, rawX)),
            y: Math.max(76, Math.min(height - 76, rawY)),
            visible: proj.z < 1,
          };
        });
        setLabels(nextLabels);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      dom.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      renderer.dispose();
      if (dom.parentNode === container) {
        container.removeChild(dom);
      }
    };
  }, []);

  if (webglFailed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
          Static Architecture Fallback
        </p>
        <div className="grid w-full max-w-sm gap-2">
          {ARCHITECTURE_LAYERS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => onSelectLayer(l.id)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs ${
                selectedLayerId === l.id
                  ? "border-[#b7f36b] bg-[#16202c] text-[#b7f36b]"
                  : "border-[#202b37] bg-[#111923] text-[#9fb0c3]"
              }`}
            >
              {l.shortLabel}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={mountRef}
        className="h-full w-full select-none touch-none"
        aria-label="Interactive 3D Cloud and Security Architecture Diagram. Drag to inspect or click any node."
      />

      {/* Projected 3D Labels Directly Above Each Infrastructure Component */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {labels.map((lbl) => {
          if (!lbl.visible) return null;
          const isSelected = lbl.id === selectedLayerId;
          const isBlocked = lbl.id === blockedLayerId;
          return (
            <button
              key={lbl.id}
              type="button"
              onClick={() => onSelectLayer(lbl.id)}
              style={{
                transform: `translate3d(${Math.round(lbl.x)}px, ${Math.round(lbl.y)}px, 0) translate(-50%, -100%)`,
              }}
              className={`pointer-events-auto absolute top-0 left-0 hidden sm:flex flex-col items-center rounded-lg border px-2.5 py-1 text-center transition-colors backdrop-blur-sm ${
                isBlocked
                  ? "border-[#f5b942] bg-[#090d12]/95"
                  : isSelected
                  ? "border-[#b7f36b] bg-[#090d12]/95"
                  : "border-[#202b37] bg-[#090d12]/85 hover:border-[#58c8ef]"
              }`}
            >
              <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#eef2f6] whitespace-nowrap">
                {lbl.title}
                {isBlocked && (
                  <span className="rounded bg-[#f5b942] px-1 text-[9px] font-bold text-[#090d12]">
                    BLOCKED
                  </span>
                )}
              </span>
              <span className="font-mono text-[9px] text-[#9fb0c3] whitespace-nowrap">
                {lbl.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
