"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export type SimulationMode = "defense" | "attack";

interface CloudSecurity3DSceneProps {
  selectedLayerId: string;
  onSelectLayer: (layerId: string) => void;
  mode: SimulationMode;
}

const LAYER_SPECS = [
  { id: "identity", y: 1.65, color: 0x38bdf8 },
  { id: "network", y: 0.55, color: 0x818cf8 },
  { id: "workload", y: -0.55, color: 0x10b981 },
  { id: "data", y: -1.65, color: 0x22d3ee },
] as const;

export function CloudSecurity3DScene({
  selectedLayerId,
  onSelectLayer,
  mode,
}: CloudSecurity3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedLayerId);
  const modeRef = useRef(mode);
  const onSelectRef = useRef(onSelectLayer);

  useEffect(() => {
    selectedRef.current = selectedLayerId;
  }, [selectedLayerId]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    onSelectRef.current = onSelectLayer;
  }, [onSelectLayer]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(5.4, 3.3, 6.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Lighting for realistic architectural depth
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    keyLight.position.set(6, 10, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 18);
    rimLight.position.set(-5, 2, -4);
    scene.add(rimLight);

    // Grounded 3D Architectural Grid Floor
    const grid = new THREE.GridHelper(12, 24, 0x1e293b, 0x0f172a);
    grid.position.y = -2.35;
    rootGroup.add(grid);

    // 4 Stacked 3D Glass Architectural Planes + Infrastructure Extrusions
    const slabGeo = new THREE.BoxGeometry(3.4, 0.12, 2.3);
    const slabEdgesGeo = new THREE.EdgesGeometry(slabGeo);

    const hitMeshes: THREE.Mesh[] = [];
    const layerGroups: {
      id: string;
      group: THREE.Group;
      slabMat: THREE.MeshStandardMaterial;
      edgeMat: THREE.LineBasicMaterial;
      baseColor: number;
      baseY: number;
      accentMeshes: THREE.Mesh[];
    }[] = [];

    LAYER_SPECS.forEach((spec) => {
      const lGroup = new THREE.Group();
      lGroup.position.y = spec.y;
      rootGroup.add(lGroup);

      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: spec.color,
        emissiveIntensity: 0.12,
        metalness: 0.55,
        roughness: 0.25,
        transparent: true,
        opacity: 0.82,
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.userData = { layerId: spec.id };
      lGroup.add(slab);
      hitMeshes.push(slab);

      const edgeMat = new THREE.LineBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: 0.5,
      });
      const edges = new THREE.LineSegments(slabEdgesGeo, edgeMat);
      lGroup.add(edges);

      // Architectural 3D sub-components on top of each slab
      const accentMeshes: THREE.Mesh[] = [];
      const accentMat = new THREE.MeshStandardMaterial({
        color: spec.color,
        emissive: spec.color,
        emissiveIntensity: 0.35,
        metalness: 0.4,
        roughness: 0.3,
      });

      if (spec.id === "identity") {
        // 3 IAM Authority Pillars
        const pillarGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.45, 6);
        [-0.9, 0, 0.9].forEach((x) => {
          const p = new THREE.Mesh(pillarGeo, accentMat);
          p.position.set(x, 0.28, 0);
          p.userData = { layerId: spec.id };
          lGroup.add(p);
          hitMeshes.push(p);
          accentMeshes.push(p);
        });
      } else if (spec.id === "network") {
        // ZTNA Gateway Bar + Ingress Nodes
        const gateGeo = new THREE.BoxGeometry(2.2, 0.26, 0.26);
        const gate = new THREE.Mesh(gateGeo, accentMat);
        gate.position.set(0, 0.2, 0);
        gate.userData = { layerId: spec.id };
        lGroup.add(gate);
        hitMeshes.push(gate);
        accentMeshes.push(gate);
      } else if (spec.id === "workload") {
        // 4 Kubernetes Pod Compute Cubes
        const podGeo = new THREE.BoxGeometry(0.38, 0.34, 0.38);
        [
          [-0.75, -0.45],
          [0.75, -0.45],
          [-0.75, 0.45],
          [0.75, 0.45],
        ].forEach(([x, z]) => {
          const pod = new THREE.Mesh(podGeo, accentMat);
          pod.position.set(x, 0.24, z);
          pod.userData = { layerId: spec.id };
          lGroup.add(pod);
          hitMeshes.push(pod);
          accentMeshes.push(pod);
        });
      } else if (spec.id === "data") {
        // KMS Cryptographic Core Vault
        const vaultGeo = new THREE.BoxGeometry(0.95, 0.42, 0.95);
        const vault = new THREE.Mesh(vaultGeo, accentMat);
        vault.position.set(0, 0.27, 0);
        vault.userData = { layerId: spec.id };
        lGroup.add(vault);
        hitMeshes.push(vault);
        accentMeshes.push(vault);
      }

      layerGroups.push({
        id: spec.id,
        group: lGroup,
        slabMat,
        edgeMat,
        baseColor: spec.color,
        baseY: spec.y,
        accentMeshes,
      });
    });

    // Vertical Bus Channels connecting the 4 strata (4 corner data conduits)
    const busCorners: [number, number][] = [
      [-1.35, -0.85],
      [1.35, -0.85],
      [-1.35, 0.85],
      [1.35, 0.85],
    ];
    const busLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });
    const pulseGeo = new THREE.BoxGeometry(0.08, 0.22, 0.08);
    const pulses: { mesh: THREE.Mesh; x: number; z: number; t: number; speed: number }[] = [];

    busCorners.forEach(([x, z], idx) => {
      const pts = [new THREE.Vector3(x, 1.65, z), new THREE.Vector3(x, -1.65, z)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      rootGroup.add(new THREE.Line(lineGeo, busLineMat));

      const pMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const pMesh = new THREE.Mesh(pulseGeo, pMat);
      pMesh.position.set(x, 0, z);
      rootGroup.add(pMesh);
      pulses.push({
        mesh: pMesh,
        x,
        z,
        t: idx * 0.25,
        speed: 0.35,
      });
    });

    // Pointer Interaction (Orbit + Raycast Click/Hover)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-99, -99);
    let isDragging = false;
    let dragMoved = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = -0.35;
    let targetRotX = 0.06;
    let hoveredId: string | null = null;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragMoved = false;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY);
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
        targetRotY += dx * 0.007;
        targetRotX = Math.max(-0.35, Math.min(0.45, targetRotX + dy * 0.005));
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragMoved) {
        updatePointer(e.clientX, e.clientY);
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(hitMeshes, false);
        if (hits.length > 0) {
          const hitId = hits[0].object.userData?.layerId as string | undefined;
          if (hitId) onSelectRef.current(hitId);
        }
      }
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const isAttack = modeRef.current === "attack";

      if (!prefersReducedMotion) {
        if (!isDragging) {
          targetRotY += dt * 0.08;
        }
        rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.08;
        rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.08;
      }

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      hoveredId =
        hits.length > 0
          ? ((hits[0].object.userData?.layerId as string) ?? null)
          : null;
      dom.style.cursor = hoveredId ? "pointer" : isDragging ? "grabbing" : "grab";

      layerGroups.forEach((lg, idx) => {
        const isSelected = selectedRef.current === lg.id;
        const isHovered = hoveredId === lg.id;

        const targetScale = isSelected ? 1.08 : isHovered ? 1.03 : 1.0;
        lg.group.scale.lerp(new THREE.Vector3(targetScale, 1, targetScale), 0.12);

        if (!prefersReducedMotion) {
          lg.group.position.y =
            lg.baseY + Math.sin(elapsed * 1.4 + idx * 0.9) * 0.035;
        }

        const activeColor = isAttack && isSelected ? 0xf59e0b : lg.baseColor;
        lg.edgeMat.color.lerp(new THREE.Color(activeColor), 0.12);
        lg.edgeMat.opacity = isSelected ? 0.95 : isHovered ? 0.7 : 0.35;
        lg.slabMat.emissive.lerp(new THREE.Color(activeColor), 0.12);
        lg.slabMat.emissiveIntensity = isSelected ? 0.32 : 0.1;
      });

      busLineMat.color.lerp(
        new THREE.Color(isAttack ? 0xf59e0b : 0x38bdf8),
        0.1
      );

      pulses.forEach((p) => {
        const mult = isAttack ? 2.2 : 1.0;
        if (!prefersReducedMotion) {
          p.t = (p.t + dt * p.speed * mult) % 1;
        }
        const y = 1.65 - p.t * 3.3;
        p.mesh.position.set(p.x, y, p.z);
        (p.mesh.material as THREE.MeshBasicMaterial).color.setHex(
          isAttack ? 0xfbbf24 : 0x38bdf8
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.dispose();
      if (dom.parentNode === container) {
        container.removeChild(dom);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative h-full w-full select-none touch-none"
      aria-label="Interactive 3D Stacked Cloud and Security Architecture. Drag to rotate or click any layer slab to inspect."
    />
  );
}
