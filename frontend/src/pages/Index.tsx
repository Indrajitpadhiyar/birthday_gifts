import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useInView } from "framer-motion";
import HeroSection from "@/components/birthday/HeroSection";
import PhotoUpload from "@/components/birthday/PhotoUpload";
import MemoriesSection from "@/components/birthday/MemoriesSection";
import PhotoExplosion from "@/components/birthday/PhotoExplosion";
import CakeReveal from "@/components/birthday/CakeReveal";
import FinalWish from "@/components/birthday/FinalWish";

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
  const [explosionCompleted, setExplosionCompleted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const finalWishRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Use useInView to detect when elements are visible
  const cakeInView = useInView(cakeRef, { once: true, margin: "-100px" });
  const finalWishInView = useInView(finalWishRef, {
    once: true,
    margin: "-100px",
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Show explosion when scrolled 60% and photos exist
      if (
        latest > 0.6 &&
        photos.length > 0 &&
        !showExplosion &&
        !explosionCompleted
      ) {
        setShowExplosion(true);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, photos.length, showExplosion, explosionCompleted]);

  // Show cake after explosion completes
  useEffect(() => {
    if (explosionCompleted && !showCake) {
      const timer = setTimeout(() => {
        setShowCake(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [explosionCompleted, showCake]);

  // Show final wish when cake section is in view
  useEffect(() => {
    if (cakeInView && showCake && !showFinalWish) {
      const timer = setTimeout(() => {
        setShowFinalWish(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cakeInView, showCake, showFinalWish]);

  const handlePhotosChange = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    // Reset states when photos change
    setShowExplosion(false);
    setShowCake(false);
    setShowFinalWish(false);
    setExplosionCompleted(false);
  };

  const handleExplosionComplete = () => {
    setExplosionCompleted(true);
    setShowExplosion(false);
  };

  return (
    <div ref={containerRef} className="relative h-screen overflow-y-auto">
      <div className="h-full">
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

              {/* Cake Section with ref */}
              <div ref={cakeRef}>
                <CakeReveal isVisible={showCake} />
              </div>

              {/* Final Wish Section with ref */}
              <div ref={finalWishRef}>
                <FinalWish isVisible={showFinalWish} />
              </div>
            </>
          )}
        </div>

        {/* Progress indicator */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent origin-left z-50"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </div>
  );
}
