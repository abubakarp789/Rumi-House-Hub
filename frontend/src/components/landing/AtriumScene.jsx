import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import PortalModel from './PortalModel';

export default function AtriumScene({ onReady }) {
  return (
    <Canvas
      className="atrium-canvas"
      camera={{ position: [0, 0.25, 9.8], fov: 38 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={onReady}
      shadows
    >
      <ambientLight intensity={1.5} />
      <hemisphereLight args={['#fff3d0', '#08271f', 1.25]} />
      <directionalLight
        position={[5, 8, 7]}
        intensity={3.2}
        color="#fff5d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 1, 4]} intensity={8} color="#e8bb59" distance={12} />
      <PortalModel />
      <ContactShadows position={[0, -2.85, 0]} opacity={0.5} scale={10} blur={2.8} far={8} />
    </Canvas>
  );
}
