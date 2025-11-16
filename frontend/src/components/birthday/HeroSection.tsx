import { Canvas } from '@react-three/fiber';
import { Stars, Float, Text3D, Center, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const animate = () => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = (Math.random() - 0.5) * 50;
    positions[i + 2] = (Math.random() - 0.5) * 50;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffd700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function GlowingSphere({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <mesh position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#ff69b4"
          emissive="#ff1493"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff69b4" />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <FloatingParticles />
          
          <GlowingSphere position={[-5, 3, -5]} />
          <GlowingSphere position={[5, -3, -8]} />
          <GlowingSphere position={[3, 5, -6]} />
          <GlowingSphere position={[-4, -4, -7]} />
          
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
        >
          <motion.h1
            className="text-7xl md:text-9xl font-bold mb-6 glow-text"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "backOut" }}
          >
            Happy Birthday
          </motion.h1>
          
          <motion.div
            className="text-8xl md:text-9xl mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.8, type: "spring", bounce: 0.5 }}
          >
            ❤️
          </motion.div>

          <motion.p
            className="text-2xl md:text-3xl text-muted-foreground glow-pink-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            A Special Journey Filled With Memories
          </motion.p>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-primary text-4xl"
            >
              ↓
            </motion.div>
            <p className="text-sm text-muted-foreground mt-2">Scroll to continue</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating music note icon */}
      <motion.div
        className="absolute top-8 right-8 text-4xl cursor-pointer hover:scale-110 transition-transform"
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 0.6, rotate: 0 }}
        transition={{ duration: 1, delay: 2 }}
        whileHover={{ scale: 1.2, opacity: 1 }}
      >
        🎵
      </motion.div>
    </div>
  );
}
