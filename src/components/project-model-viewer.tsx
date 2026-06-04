"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

function LabModel() {
  return (
    <group rotation={[0.1, -0.4, 0]}>
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[3.4, 0.22, 2.2]} />
        <meshStandardMaterial color="#07140c" emissive="#003b18" metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[-0.75, 0.08, 0]}>
        <boxGeometry args={[1.15, 0.12, 0.78]} />
        <meshStandardMaterial color="#10261a" emissive="#004b20" />
      </mesh>
      <mesh position={[0.86, 0.12, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.32, 32]} />
        <meshStandardMaterial color="#0aff72" emissive="#00ff66" emissiveIntensity={0.28} />
      </mesh>
      {[-1.35, 1.35].map((x) => (
        <mesh key={x} position={[x, 0.65, -0.75]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 16]} />
          <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.45} />
        </mesh>
      ))}
      <Text position={[0, 0.65, 0.9]} fontSize={0.18} color="#00ff66">
        OSCAR LAB
      </Text>
    </group>
  );
}

export function ProjectModelViewer() {
  return (
    <div className="h-[420px] overflow-hidden rounded-sm border border-primary/20 bg-black">
      <Canvas camera={{ position: [3.8, 2.6, 4.4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 5, 4]} intensity={20} color="#00ff66" />
        <gridHelper args={[7, 14, "#00ff66", "#0f331d"]} />
        <LabModel />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
