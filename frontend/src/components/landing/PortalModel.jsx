import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createArchShape(outerWidth, outerHeight, thickness) {
  const shape = new THREE.Shape();
  const halfWidth = outerWidth / 2;
  const springLine = outerHeight - halfWidth;

  shape.moveTo(-halfWidth, 0);
  shape.lineTo(-halfWidth, springLine);
  shape.absarc(0, springLine, halfWidth, Math.PI, 0, true);
  shape.lineTo(halfWidth, 0);
  shape.lineTo(halfWidth - thickness, 0);
  shape.lineTo(halfWidth - thickness, springLine);
  shape.absarc(0, springLine, halfWidth - thickness, 0, Math.PI, false);
  shape.lineTo(-halfWidth + thickness, 0);
  shape.closePath();

  return shape;
}

function ArchLayer({ width, height, thickness, depth, color, z, metalness = 0 }) {
  const geometry = useMemo(() => {
    const shape = createArchShape(width, height, thickness);
    const nextGeometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      curveSegments: 42,
    });
    nextGeometry.center();
    return nextGeometry;
  }, [depth, height, thickness, width]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} position={[0, 0, z]} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.45} metalness={metalness} />
    </mesh>
  );
}

export default function PortalModel() {
  const groupRef = useRef(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y += (pointer.x * 0.13 - groupRef.current.rotation.y) * 0.035;
    groupRef.current.rotation.x += (-pointer.y * 0.045 - groupRef.current.rotation.x) * 0.035;
    groupRef.current.position.y = Math.sin(elapsed * 0.65) * 0.055;
  });

  return (
    <group ref={groupRef} rotation={[0.015, -0.08, 0]}>
      <ArchLayer width={5.45} height={6.25} thickness={0.52} depth={0.62} color="#d7b05a" z={-0.12} metalness={0.2} />
      <ArchLayer width={4.55} height={5.45} thickness={0.42} depth={0.48} color="#f4e7c8" z={0.15} />
      <ArchLayer width={3.72} height={4.7} thickness={0.25} depth={0.36} color="#9e7f45" z={0.38} metalness={0.32} />
      <mesh position={[0, -2.68, 0.1]} receiveShadow castShadow>
        <cylinderGeometry args={[3.25, 3.55, 0.34, 72]} />
        <meshStandardMaterial color="#0e3028" roughness={0.64} metalness={0.08} />
      </mesh>
      <mesh position={[0, -2.46, 0.12]} receiveShadow>
        <cylinderGeometry args={[2.62, 2.88, 0.16, 72]} />
        <meshStandardMaterial color="#d8b35d" roughness={0.38} metalness={0.3} />
      </mesh>
    </group>
  );
}
