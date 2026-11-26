"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type HeroCompareMode = "ebpf" | "sidecar";

interface ProjectedTag {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  tone: "lime" | "blue" | "warn";
}

function samplePolyline(points: THREE.Vector3[], t: number, out: THREE.Vector3) {
  const segCount = points.length - 1;
  const scaled = Math.min(0.9999, Math.max(0, t)) * segCount;
  const idx = Math.floor(scaled);
  const localT = scaled - idx;
  out.lerpVectors(points[idx], points[idx + 1], localT);
  return out;
}

export function Hero3DCanvas({ mode }: { mode: HeroCompareMode }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef(mode);
  const [failed, setFailed] = useState(false);
  const [tags, setTags] = useState<ProjectedTag[]>([]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

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
      queueMicrotask(() => setFailed(true));
      return;
    }

    let width = container.clientWidth || 560;
    let height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 2.35, 7.6);
    camera.lookAt(0, 0.2, 0);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const keyLight = new THREE.DirectionalLight(0xeef6ff, 1.65);
    keyLight.position.set(5, 9, 7);
    scene.add(keyLight);

    const limeLight = new THREE.PointLight(0xb7f36b, 1.6, 16);
    limeLight.position.set(0, -1.5, 4);
    scene.add(limeLight);

    // UPPER TIER: User Space Plane (Translucent glass deck)
    const userPlane = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.08, 2.4),
      new THREE.MeshStandardMaterial({
        color: 0x162230,
        transparent: true,
        opacity: 0.55,
        roughness: 0.3,
      })
    );
    userPlane.position.y = 0.65;
    root.add(userPlane);
    const userEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(6.2, 0.08, 2.4)),
      new THREE.LineBasicMaterial({ color: 0x58c8ef, transparent: true, opacity: 0.45 })
    );
    userEdges.position.y = 0.65;
    root.add(userEdges);

    // LOWER TIER: Linux Kernel Ring-0 Slab
    const kernelMat = new THREE.MeshStandardMaterial({
      color: 0x101822,
      emissive: 0xb7f36b,
      emissiveIntensity: 0.22,
      metalness: 0.5,
      roughness: 0.3,
    });
    const kernelSlab = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.32, 2.4), kernelMat);
    kernelSlab.position.y = -0.95;
    root.add(kernelSlab);

    const kernelEdgeMat = new THREE.LineBasicMaterial({ color: 0xb7f36b });
    const kernelEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(6.2, 0.32, 2.4)),
      kernelEdgeMat
    );
    kernelEdges.position.y = -0.95;
    root.add(kernelEdges);

    // eBPF Fast-Path Bridge Bar inside the Kernel
    const ebpfBarMat = new THREE.MeshStandardMaterial({
      color: 0xb7f36b,
      emissive: 0xb7f36b,
      emissiveIntensity: 0.55,
      roughness: 0.25,
    });
    const ebpfBar = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.14, 0.42), ebpfBarMat);
    ebpfBar.position.set(0, -0.72, 0);
    root.add(ebpfBar);

    // Two Application Containers (Pod A on Left, Pod B on Right)
    const appMat = new THREE.MeshStandardMaterial({
      color: 0x1c2c3e,
      emissive: 0x58c8ef,
      emissiveIntensity: 0.32,
      metalness: 0.35,
      roughness: 0.28,
    });
    const podA = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.9, 1.05), appMat);
    podA.position.set(-2.1, 1.15, 0);
    root.add(podA);

    const podB = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.9, 1.05), appMat);
    podB.position.set(2.1, 1.15, 0);
    root.add(podB);

    // Two Sidecar Proxy Containers (Visible & elevated in Sidecar mode; retracted in eBPF mode)
    const sidecarMat = new THREE.MeshStandardMaterial({
      color: 0x3b2a12,
      emissive: 0xf5b942,
      emissiveIntensity: 0.42,
      transparent: true,
      opacity: 0.95,
      roughness: 0.3,
    });
    const proxyA = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.72, 0.72), sidecarMat);
    proxyA.position.set(-0.95, 1.06, 0);
    root.add(proxyA);

    const proxyB = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.72, 0.72), sidecarMat);
    proxyB.position.set(0.95, 1.06, 0);
    root.add(proxyB);

    // Packet trajectories:
    // 1. eBPF Fast Path: Pod A -> direct Kernel eBPF Hook -> Pod B (short, clean)
    const ebpfPath = [
      new THREE.Vector3(-2.1, 0.85, 0.35),
      new THREE.Vector3(-2.1, -0.68, 0.35),
      new THREE.Vector3(2.1, -0.68, 0.35),
      new THREE.Vector3(2.1, 0.85, 0.35),
    ];

    // 2. Sidecar Double-Hop Path: Pod A -> Kernel -> Proxy A -> Kernel -> Proxy B -> Kernel -> Pod B
    const sidecarPath = [
      new THREE.Vector3(-2.1, 1.1, 0.42),
      new THREE.Vector3(-2.1, -0.7, 0.42),
      new THREE.Vector3(-0.95, -0.7, 0.42),
      new THREE.Vector3(-0.95, 1.1, 0.42),
      new THREE.Vector3(-0.95, -0.7, 0.42),
      new THREE.Vector3(0.95, -0.7, 0.42),
      new THREE.Vector3(0.95, 1.1, 0.42),
      new THREE.Vector3(0.95, -0.7, 0.42),
      new THREE.Vector3(2.1, -0.7, 0.42),
      new THREE.Vector3(2.1, 1.1, 0.42),
    ];

    const ebpfLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ebpfPath),
      new THREE.LineBasicMaterial({ color: 0xb7f36b, transparent: true, opacity: 0.8 })
    );
    root.add(ebpfLine);

    const sidecarLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(sidecarPath),
      new THREE.LineBasicMaterial({ color: 0xf5b942, transparent: true, opacity: 0.8 })
    );
    root.add(sidecarLine);

    // Packets travelling along the active trajectory
    const packetGeo = new THREE.SphereGeometry(0.11, 12, 12);
    const packets = [0, 0.33, 0.66].map((offset) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0xb7f36b });
      const mesh = new THREE.Mesh(packetGeo, mat);
      root.add(mesh);
      return { mesh, mat, t: offset };
    });

    // Drag to inspect angle (steady by default)
    let isDragging = false;
    let prevX = 0;
    let targetRotY = -0.14;

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      targetRotY = Math.max(-0.65, Math.min(0.65, targetRotY + (e.clientX - prevX) * 0.007));
      prevX = e.clientX;
    };
    const onUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.style.cursor = "grab";
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
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let lastTime = performance.now();
    let frameCount = 0;
    const proj = new THREE.Vector3();
    const tmpPos = new THREE.Vector3();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const isSidecar = modeRef.current === "sidecar";

      root.rotation.y += (targetRotY - root.rotation.y) * 0.1;

      // Toggle visibility and smooth scale of sidecar proxies vs eBPF kernel bridge
      const proxyScale = isSidecar ? 1 : 0.001;
      proxyA.scale.lerp(new THREE.Vector3(proxyScale, proxyScale, proxyScale), 0.14);
      proxyB.scale.lerp(new THREE.Vector3(proxyScale, proxyScale, proxyScale), 0.14);
      proxyA.visible = proxyA.scale.x > 0.02;
      proxyB.visible = proxyB.scale.x > 0.02;

      ebpfBar.visible = !isSidecar;
      ebpfLine.visible = !isSidecar;
      sidecarLine.visible = isSidecar;

      kernelMat.emissive.setHex(isSidecar ? 0x58c8ef : 0xb7f36b);
      kernelMat.emissiveIntensity = isSidecar ? 0.08 : 0.28;
      kernelEdgeMat.color.setHex(isSidecar ? 0x3b4d61 : 0xb7f36b);

      const activePath = isSidecar ? sidecarPath : ebpfPath;
      const speed = isSidecar ? 0.18 : 0.38;

      packets.forEach((p) => {
        if (!prefersReduced) {
          p.t = (p.t + dt * speed) % 1;
        }
        samplePolyline(activePath, p.t, tmpPos);
        p.mesh.position.copy(tmpPos);
        p.mat.color.setHex(isSidecar ? 0xf5b942 : 0xb7f36b);
      });

      renderer.render(scene, camera);

      frameCount++;
      if (frameCount % 4 === 0) {
        root.updateMatrixWorld();
        const anchors: {
          id: string;
          pos: [number, number, number];
          label: string;
          sub: string;
          tone: "lime" | "blue" | "warn";
        }[] = [
          {
            id: "podA",
            pos: [-2.1, 1.85, 0],
            label: "Service Pod A",
            sub: "User Space",
            tone: "blue",
          },
          {
            id: "podB",
            pos: [2.1, 1.85, 0],
            label: "Service Pod B",
            sub: "User Space",
            tone: "blue",
          },
          {
            id: "mid",
            pos: [0, isSidecar ? 1.65 : -0.45, 0],
            label: isSidecar ? "2x Envoy Sidecars" : "eBPF Kernel Hook",
            sub: isSidecar ? "4x Extra TCP Hops" : "Direct Ring-0 Fast Path",
            tone: isSidecar ? "warn" : "lime",
          },
        ];

        setTags(
          anchors.map((a) => {
            proj.set(a.pos[0], a.pos[1], a.pos[2]);
            proj.applyMatrix4(root.matrixWorld);
            proj.project(camera);
            return {
              id: a.id,
              label: a.label,
              sub: a.sub,
              tone: a.tone,
              x: (proj.x * 0.5 + 0.5) * width,
              y: (-proj.y * 0.5 + 0.5) * height,
            };
          })
        );
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

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 text-center font-mono text-xs text-[var(--text-muted)]">
        User Space (Pod A ↔ Pod B) over Linux Kernel eBPF Fast Path
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={mountRef}
        className="h-full w-full select-none touch-none"
        aria-label="3D Cutaway Diagram comparing Linux Kernel eBPF Fast Path vs User-Space Sidecar Proxies"
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {tags.map((t) => (
          <div
            key={t.id}
            style={{
              transform: `translate3d(${Math.round(t.x)}px, ${Math.round(t.y)}px, 0) translate(-50%, -100%)`,
            }}
            className={`absolute top-0 left-0 hidden sm:flex flex-col items-center rounded-md border px-2 py-1 text-center backdrop-blur-sm ${
              t.tone === "warn"
                ? "border-[#f5b942]/75 bg-[#090d12]/92"
                : t.tone === "lime"
                ? "border-[#b7f36b]/75 bg-[#090d12]/92"
                : "border-[#58c8ef]/60 bg-[#090d12]/90"
            }`}
          >
            <span className="font-mono text-[10px] font-semibold text-[#eef2f6] whitespace-nowrap">
              {t.label}
            </span>
            <span
              className={`font-mono text-[9px] whitespace-nowrap ${
                t.tone === "warn"
                  ? "text-[#f5b942]"
                  : t.tone === "lime"
                  ? "text-[#b7f36b]"
                  : "text-[#58c8ef]"
              }`}
            >
              {t.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
