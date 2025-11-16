import { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import HeroSection from '@/components/birthday/HeroSection';
import PhotoUpload from '@/components/birthday/PhotoUpload';
import MemoriesSection from '@/components/birthday/MemoriesSection';
import PhotoExplosion from '@/components/birthday/PhotoExplosion';
import CakeReveal from '@/components/birthday/CakeReveal';
import FinalWish from '@/components/birthday/FinalWish';

interface Photo {
  id: string;
  url: string;
  file: File;
}

export default function Index() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showCake, setShowCake] = useState(false);
  const [showFinalWish, setShowFinalWish] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Trigger explosion near the end of memories section
      if (latest > 0.6 && photos.length > 0 && !showExplosion) {
        setShowExplosion(true);
      }
      
      // Show cake after explosion
      if (latest > 0.75 && !showCake) {
        setTimeout(() => setShowCake(true), 2000);
      }
      
      // Show final wish at the very end
      if (latest > 0.9 && !showFinalWish) {
        setShowFinalWish(true);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, photos.length, showExplosion, showCake, showFinalWish]);

  const handlePhotosChange = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    // Reset states when photos change
    setShowExplosion(false);
    setShowCake(false);
    setShowFinalWish(false);
  };

  const handleExplosionComplete = () => {
    // Explosion animation completed
  };

  return (
    <div ref={containerRef} className="relative">
      <HeroSection />
      
      <div className="relative z-10">
        <PhotoUpload onPhotosChange={handlePhotosChange} />
        
        {photos.length > 0 && (
          <>
            <MemoriesSection photos={photos} />
            
            <PhotoExplosion 
              photos={photos}
              isVisible={showExplosion}
              onComplete={handleExplosionComplete}
            />
            
            <CakeReveal isVisible={showCake} />
            
            <FinalWish isVisible={showFinalWish} />
          </>
        )}
      </div>

      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
