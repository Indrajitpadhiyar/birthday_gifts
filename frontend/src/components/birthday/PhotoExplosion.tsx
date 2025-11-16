import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Photo {
  id: string;
  url: string;
  file: File;
}

interface PhotoExplosionProps {
  photos: Photo[];
  isVisible: boolean;
  onComplete: () => void;
}

export default function PhotoExplosion({ photos, isVisible, onComplete }: PhotoExplosionProps) {
  const [stage, setStage] = useState<'collect' | 'explode' | 'complete'>('collect');

  useEffect(() => {
    if (!isVisible) return;

    const timer1 = setTimeout(() => setStage('explode'), 2000);
    const timer2 = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial={{ backgroundColor: "hsl(var(--background))" }}
      animate={{ 
        backgroundColor: stage === 'explode' ? "hsl(222.2 84% 4.9%)" : "hsl(var(--background))"
      }}
      transition={{ duration: 1 }}
    >
      <AnimatePresence mode="wait">
        {stage === 'collect' && (
          <motion.div
            key="collect"
            className="relative w-full h-full flex items-center justify-center"
          >
            {photos.map((photo, index) => {
              const angle = (index / photos.length) * Math.PI * 2;
              const startRadius = 600;
              const startX = Math.cos(angle) * startRadius;
              const startY = Math.sin(angle) * startRadius;

              return (
                <motion.div
                  key={photo.id}
                  initial={{ 
                    x: startX, 
                    y: startY, 
                    scale: 0.5,
                    rotate: Math.random() * 360
                  }}
                  animate={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0.8,
                    rotate: 0
                  }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="absolute w-32 h-32 md:w-48 md:h-48"
                >
                  <img
                    src={photo.url}
                    alt="Memory"
                    className="w-full h-full object-cover rounded-lg glass shadow-2xl"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {stage === 'explode' && (
          <motion.div
            key="explode"
            className="relative w-full h-full flex items-center justify-center"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0.8,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{ 
                  scale: 0,
                  opacity: 0
                }}
                transition={{
                  duration: 1.5,
                  delay: 1 + index * 0.03,
                  ease: "easeInOut"
                }}
                className="absolute w-32 h-32 md:w-48 md:h-48"
              >
                <img
                  src={photo.url}
                  alt="Memory"
                  className="w-full h-full object-cover rounded-lg glass shadow-2xl"
                />
              </motion.div>
            ))}

            {/* Sparkle effects */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ 
                  scale: 0, 
                  opacity: 1,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 800
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.03,
                  ease: "easeOut"
                }}
                className="absolute text-4xl"
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
