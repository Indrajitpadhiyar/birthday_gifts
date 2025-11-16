import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface Photo {
  id: string;
  url: string;
  file: File;
}

interface MemoriesSectionProps {
  photos: Photo[];
}

export default function MemoriesSection({ photos }: MemoriesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  if (photos.length === 0) return null;

  return (
    <div ref={containerRef} className="min-h-screen py-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl md:text-7xl font-bold glow-pink-text mb-4">
          Precious Moments
        </h2>
        <p className="text-xl text-muted-foreground">
          Every photo tells a beautiful story
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-32">
        {photos.map((photo, index) => {
          const isEven = index % 2 === 0;
          const direction = isEven ? -100 : 100;
          
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, x: direction, rotate: isEven ? -5 : 5 }}
              whileInView={{ 
                opacity: 1, 
                x: 0, 
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 0.2
                }
              }}
              viewport={{ once: false, margin: "-100px" }}
              className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  rotate: isEven ? 2 : -2,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="relative w-full md:w-2/3 lg:w-1/2"
              >
                <div className="glass rounded-3xl p-4 shadow-2xl">
                  <motion.div
                    className="relative aspect-square overflow-hidden rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={photo.url}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Sparkle effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    />
                  </motion.div>
                  
                  {/* Photo number badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                  >
                    {index + 1}
                  </motion.div>
                </div>

                {/* Floating particles around photo */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-8 left-1/4 text-4xl"
                >
                  ✨
                </motion.div>
                
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -bottom-8 right-1/4 text-4xl"
                >
                  💖
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
