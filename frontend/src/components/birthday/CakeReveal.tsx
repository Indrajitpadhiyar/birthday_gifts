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

// Scratch Card Component
function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 800 * dpr;
    canvas.height = 400 * dpr;
    canvas.style.width = "800px";
    canvas.style.height = "400px";
    ctx.scale(dpr, dpr);

    // Draw scratch card
    drawScratchCard(ctx, false);
  }, []);

  const drawScratchCard = (
    ctx: CanvasRenderingContext2D,
    showMessage: boolean
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, 800, 400);

    if (!showMessage) {
      // Draw scratchable surface
      const gradient = ctx.createLinearGradient(0, 0, 800, 400);
      gradient.addColorStop(0, "#4A90E2");
      gradient.addColorStop(0.5, "#7B68EE");
      gradient.addColorStop(1, "#FF69B4");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 400);

      // Draw scratch pattern
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 25; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(i * 16, j * 16, 8, 8);
          }
        }
      }

      // Draw instructions
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillText("🎉 SCRATCH HERE 🎉", 400, 200);

      ctx.font = "20px Arial";
      ctx.fillText("Use your finger/mouse to reveal the surprise!", 400, 240);
    } else {
      // Draw revealed message
      const gradient = ctx.createLinearGradient(0, 0, 800, 400);
      gradient.addColorStop(0, "#FFD700");
      gradient.addColorStop(0.5, "#FF69B4");
      gradient.addColorStop(1, "#BA55D3");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 400);

      // Draw funny birthday message
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 48px Comic Sans MS";
      ctx.textAlign = "center";
      ctx.fillText("🎂 HAPPY BIRTHDAY SOTLU! 🎂", 400, 120);

      ctx.font = "bold 36px Comic Sans MS";
      ctx.fillText("You are the CHAMKILA of our group!", 400, 180);

      ctx.font = "28px Comic Sans MS";
      ctx.fillText("May your day be as funny as your jokes!", 400, 230);
      ctx.fillText("Stay blessed, stay CHAMKILA! 😂", 400, 280);

      // Draw sparkles
      ctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < 20; i++) {
        const x = 100 + Math.random() * 600;
        const y = 50 + Math.random() * 300;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const handleScratchStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e);
  };

  const handleScratchMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    scratch(e);
  };

  const handleScratchEnd = () => {
    setIsScratching(false);
  };

  const scratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clear a circle at the scratch position
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch progress
    checkScratchProgress();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get image data to check transparency
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let transparentPixels = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) {
        transparentPixels++;
      }
    }

    const progress = transparentPixels / (data.length / 4);
    setScratchProgress(progress);

    // If 60% is scratched, reveal message
    if (progress > 0.6 && !isRevealed) {
      setIsRevealed(true);
      drawScratchCard(ctx, true);

      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FF69B4", "#00FF00", "#FF0000"],
      });

      // Play sound effect (you can add actual sound here)
      console.log("🎉 Scratch card revealed!");
    }
  };

  const resetScratchCard = () => {
    setIsRevealed(false);
    setScratchProgress(0);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawScratchCard(ctx, false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900 flex items-center justify-center p-8">
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="rounded-3xl p-8 border-2 border-pink-400/30 shadow-[0_0_60px_rgba(255,105,180,0.6)] bg-black/40 backdrop-blur-3xl">
          <motion.h3
            className="text-3xl md:text-5xl font-bold text-center mb-8 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            🎊 Secret Birthday Message 🎊
          </motion.h3>

          <div className="relative rounded-2xl overflow-hidden border-4 border-gold-400 bg-gradient-to-br from-yellow-200 to-yellow-400 p-2 shadow-2xl">
            <canvas
              ref={canvasRef}
              className="w-full h-96 cursor-crosshair touch-none rounded-xl"
              onMouseDown={handleScratchStart}
              onMouseMove={handleScratchMove}
              onMouseUp={handleScratchEnd}
              onMouseLeave={handleScratchEnd}
              onTouchStart={(e) => {
                e.preventDefault();
                handleScratchStart(e as any);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                handleScratchMove(e as any);
              }}
              onTouchEnd={handleScratchEnd}
            />

            {/* Progress indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/80 rounded-full px-4 py-2 border border-pink-400/40">
                <p className="text-white text-sm font-medium">
                  Scratched: {Math.round(scratchProgress * 100)}%
                  {isRevealed && " 🎉"}
                </p>
              </div>
            </div>

            {/* Instructions */}
            {!isRevealed && scratchProgress < 0.1 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="text-black/80 text-lg text-center px-4 bg-white/80 rounded-2xl py-4 border-2 border-gold-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className="mb-2 text-xl font-bold">
                    ✨ Scratch to Reveal ✨
                  </p>
                  <p>Use your finger or mouse to scratch this card!</p>
                </motion.div>
              </div>
            )}
          </div>

          {/* Reset button */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6"
            >
              <motion.button
                onClick={resetScratchCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-lg font-bold rounded-xl border-2 border-pink-400/50 bg-gradient-to-r from-pink-400/20 to-purple-400/20 text-white shadow-lg"
              >
                Scratch Again! 🔄
              </motion.button>
            </motion.div>
          )}

          {/* Funny message after reveal */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-6 p-6 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-2xl border-2 border-yellow-400/50"
            >
              <p className="text-2xl md:text-3xl text-yellow-200 font-bold mb-4">
                😂 SOTLU SPECIAL BIRTHDAY EDITION! 😂
              </p>
              <p className="text-lg text-pink-200">
                You're the CHAMKILA who makes everyone laugh!
                <br />
                May your birthday be as hilarious as your memes! 🎭
              </p>
            </motion.div>
          )}

          {/* Scratch tips */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: !isRevealed ? 1 : 0 }}
          >
            <div className="inline-flex flex-col items-center gap-2 bg-black/50 rounded-full px-6 py-3">
              <p className="text-white/80 text-sm">
                💡 Tip: Scratch in circular motions for best results!
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

interface CakeRevealProps {
  isVisible: boolean;
}

export default function CakeReveal({ isVisible }: CakeRevealProps) {
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [backgroundAnimation, setBackgroundAnimation] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const textTimer = setTimeout(() => setShowText(true), 1500);
    const buttonTimer = setTimeout(() => setShowButton(true), 2500);

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

    if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      setGyroEnabled(true);
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
    setBackgroundAnimation(true);

    setTimeout(() => {
      setShowMessage(true);

      // Show scratch card after message
      setTimeout(() => {
        setShowScratchCard(true);
        // Smooth scroll to scratch card
        setTimeout(() => {
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }, 500);
      }, 3000);
    }, 1000);

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
    <div className="relative">
      {/* Main Cake Section */}
      <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900">
        {/* Background Animation */}
        {backgroundAnimation && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/80 to-rose-900/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
          </div>
        )}

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
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
              Make a Wish
            </h2>
            <p className="text-4xl md:text-5xl">🎂💫</p>
          </motion.div>

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
                className="px-6 py-3 text-lg md:text-xl font-bold rounded-2xl border-2 border-blue-400/50 bg-gradient-to-r from-blue-400/20 to-purple-400/20 text-white shadow-lg"
              >
                Enable Motion Controls 📱
              </motion.button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={showButton ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className="mt-12 pointer-events-auto"
          >
            <motion.button
              onClick={handleCutCake}
              disabled={showMessage || backgroundAnimation}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-xl md:text-2xl font-bold rounded-2xl border-2 border-pink-400/50 bg-gradient-to-r from-pink-400/20 to-rose-400/20 text-white shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cut Your Cake 🍰
            </motion.button>
          </motion.div>

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

          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="mt-12 max-w-2xl mx-auto px-4"
            >
              <div className="rounded-3xl p-8 md:p-12 border-2 border-pink-400/30 bg-black/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
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
                  className="text-xl md:text-2xl leading-relaxed text-white font-medium relative z-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <span className="block mb-4 text-pink-200">
                    Happy Birthday, my special one! 🎉💖
                  </span>
                  <span className="block mb-4 text-purple-200">
                    Every moment with you is a memory I treasure 💫
                  </span>
                  <span className="block mb-4 text-rose-200">
                    May your smile shine brighter than these candles 🕯️✨
                  </span>
                  <span className="block text-fuchsia-200">
                    Scroll down for a FUNNY surprise... 😂
                  </span>
                </motion.p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scratch Card Section */}
      {showScratchCard && <ScratchCard />}
    </div>
  );
}
