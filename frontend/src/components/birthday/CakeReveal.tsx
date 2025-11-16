import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";

function Cake() {
  const cakeRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!cakeRef.current) return;

    let rotation = 0;
    const animate = () => {
      if (cakeRef.current) {
        rotation += 0.005;
        cakeRef.current.rotation.y = rotation;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <group ref={cakeRef} position={[0, -1, 0]}>
      {/* Cake base layers */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.8, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 0.6, 32]} />
        <meshStandardMaterial color="#D2691E" roughness={0.3} metalness={0.2} />
      </mesh>

      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.5, 32]} />
        <meshStandardMaterial color="#CD853F" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Frosting */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[2.05, 2.05, 0.1, 32]} />
        <meshStandardMaterial
          color="#FFB6C1"
          emissive="#FF69B4"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[1.75, 1.75, 0.1, 32]} />
        <meshStandardMaterial
          color="#FFB6C1"
          emissive="#FF69B4"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.1, 32]} />
        <meshStandardMaterial
          color="#FFB6C1"
          emissive="#FF69B4"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Candles */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 0.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 1.9, z]}>
            {/* Candle stick */}
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
              <meshStandardMaterial color="#FFFACD" />
            </mesh>

            {/* Flame */}
            <Flame position={[0, 0.4, 0]} />
          </group>
        );
      })}
    </group>
  );
}

function Flame({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!flameRef.current) return;

    const animate = () => {
      if (flameRef.current) {
        const scale = 1 + Math.sin(Date.now() * 0.01) * 0.2;
        flameRef.current.scale.setScalar(scale);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <mesh ref={flameRef} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#FFA500" transparent opacity={0.9} />
      <pointLight intensity={2} distance={3} color="#FFA500" />
    </mesh>
  );
}

interface CakeRevealProps {
  isVisible: boolean;
}

export default function CakeReveal({ isVisible }: CakeRevealProps) {
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0.3);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!isVisible) return;

    // Show text after cake rises
    const textTimer = setTimeout(() => setShowText(true), 1500);

    // Show button after text
    const buttonTimer = setTimeout(() => setShowButton(true), 2500);

    // Trigger confetti
    const confettiTimer = setTimeout(() => {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ["#FFD700", "#FF69B4", "#DDA0DD", "#FFA500"],
        });

        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ["#FFD700", "#FF69B4", "#DDA0DD", "#FFA500"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }, 1000);

    // Enable gyroscope controls
    const enableGyro = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        // iOS 13+ devices
        (DeviceOrientationEvent as any)
          .requestPermission()
          .then((permissionState: string) => {
            if (permissionState === "granted") {
              setGyroEnabled(true);
            }
          })
          .catch(console.error);
      } else {
        // Android and other devices
        setGyroEnabled(true);
      }
    };

    // Auto-enable gyro on non-iOS devices
    if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      enableGyro();
    }

    return () => {
      clearTimeout(textTimer);
      clearTimeout(buttonTimer);
      clearTimeout(confettiTimer);
    };
  }, [isVisible]);

  const enableGyroscope = () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            setGyroEnabled(true);
          }
        })
        .catch(console.error);
    } else {
      setGyroEnabled(true);
    }
  };

  const handleCutCake = () => {
    setShowMessage(true);
    setGlowIntensity(0.8);

    // Confetti burst
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: ["#FFD700", "#FF69B4", "#DDA0DD", "#FFA500", "#FF1493"],
      });

      confetti({
        particleCount: 7,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: ["#FFD700", "#FF69B4", "#DDA0DD", "#FFA500", "#FF1493"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
      animate={{
        background: showMessage
          ? "linear-gradient(135deg, hsl(var(--warm-orange)), hsl(var(--glow-gold)))"
          : "hsl(var(--background))",
      }}
      transition={{ duration: 1.5 }}
    >
      {/* 3D Cake */}
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          <ambientLight intensity={showMessage ? 0.8 : 0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={showMessage ? 1.5 : 1}
            castShadow
          />
          <pointLight
            position={[-10, -10, -10]}
            intensity={showMessage ? 0.6 : 0.3}
            color="#FF69B4"
          />

          <Cake />

          <Environment preset="sunset" />
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.5}
            enableDamping={true}
            dampingFactor={0.1}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Text Overlay */}
      <div className="relative z-10 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={
            showText
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
              : {}
          }
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.5,
          }}
        >
          <h2 className="text-6xl md:text-8xl font-bold glow-text mb-4">
            Make a Wish
          </h2>
          <p className="text-4xl md:text-5xl">🎂💫</p>
        </motion.div>

        {/* Gyroscope Enable Button for iOS */}
        {!gyroEnabled && /iPhone|iPad|iPod/.test(navigator.userAgent) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mt-8 pointer-events-auto"
          >
            <motion.button
              onClick={enableGyroscope}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-lg md:text-xl font-bold rounded-2xl glass border-2 border-blue-400/50 bg-gradient-to-r from-blue-400/20 to-purple-400/20 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300"
            >
              Enable Motion Controls 📱
            </motion.button>
          </motion.div>
        )}

        {/* Cut Cake Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showButton ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="mt-12 pointer-events-auto"
        >
          <motion.button
            onClick={handleCutCake}
            disabled={showMessage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-xl md:text-2xl font-bold rounded-2xl glass border-2 border-primary/50 bg-gradient-to-r from-primary/20 to-secondary/20 shadow-[0_0_30px_rgba(255,105,180,0.5)] hover:shadow-[0_0_50px_rgba(255,105,180,0.8)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cut Your Cake 🍰
          </motion.button>
        </motion.div>

        {/* Motion Instructions */}
        {gyroEnabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-lg md:text-xl text-white/80 font-medium"
          >
            📱 Move your phone to rotate the cake
          </motion.div>
        )}

        {/* Birthday Message */}
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="mt-12 max-w-2xl mx-auto px-4"
          >
            <div className="glass rounded-3xl p-8 md:p-12 border-2 border-primary/30 shadow-[0_0_60px_rgba(255,215,0,0.6)] relative overflow-hidden">
              {/* Floating emojis */}
              {["🎉", "💖", "💫", "🕯️", "✨", "🌈", "💝", "🥰", "🎂"].map(
                (emoji, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [20, -60, -100],
                      x: (Math.random() - 0.5) * 100,
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className="absolute text-4xl pointer-events-none"
                    style={{
                      left: `${10 + i * 10}%`,
                      top: "50%",
                    }}
                  >
                    {emoji}
                  </motion.div>
                )
              )}

              <motion.p
                className="text-xl md:text-2xl leading-relaxed text-foreground font-medium relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <span className="block mb-4">
                  Happy Birthday, my special one! 🎉💖
                </span>
                <span className="block mb-4">
                  Every moment with you is a memory I treasure 💫
                </span>
                <span className="block mb-4">
                  May your smile shine brighter than these candles 🕯️✨
                </span>
                <span className="block mb-4">
                  I hope your day is filled with happiness, love, and magic!
                  🌈💝
                </span>
                <span className="block">
                  You deserve all the joy in the world — today and always.
                  🥰🎂✨
                </span>
              </motion.p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
