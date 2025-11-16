import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface FinalWishProps {
  isVisible: boolean;
}

export default function FinalWish({ isVisible }: FinalWishProps) {
  const [displayedText, setDisplayedText] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    if (!isVisible) return;

    // Epic confetti explosion
    const duration = 5000;
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

    // Heart explosion
    const heartTimer = setTimeout(() => {
      const scalar = 3;
      const heart = confetti.shapeFromText({ text: "❤️", scalar });

      confetti({
        shapes: [heart],
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5 },
        scalar: 2,
        gravity: 0.5,
        drift: 1,
      });
    }, 1000);

    // Typing animation for each line
    const messageLines = [
      "May your day be filled with love,",
      "laughter, and unforgettable moments.",
      "Here's to another amazing year",
      "of memories together! 💕",
    ];

    let currentLine = 0;
    let currentChar = 0;

    const typeText = () => {
      if (currentLine < messageLines.length) {
        if (currentChar <= messageLines[currentLine].length) {
          setDisplayedText((prev) => {
            const newText = [...prev];
            newText[currentLine] = messageLines[currentLine].slice(
              0,
              currentChar
            );
            return newText;
          });
          currentChar++;
          setTimeout(typeText, 50); // Typing speed
        } else {
          currentLine++;
          currentChar = 0;
          setTimeout(typeText, 300); // Delay between lines
        }
      }
    };

    // Start typing after a short delay
    const typingTimer = setTimeout(typeText, 1000);

    return () => {
      clearTimeout(heartTimer);
      clearTimeout(typingTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const lineColors = [
    "text-pink-300",
    "text-yellow-300",
    "text-purple-300",
    "text-red-300",
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden relative">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        initial={{
          background:
            "linear-gradient(135deg, hsl(280, 50%, 8%), hsl(280, 60%, 15%))",
        }}
        animate={{
          background: [
            "linear-gradient(135deg, hsl(280, 50%, 8%), hsl(280, 60%, 15%))",
            "linear-gradient(135deg, hsl(45, 100%, 20%), hsl(340, 75%, 25%))",
            "linear-gradient(135deg, hsl(280, 70%, 20%), hsl(320, 80%, 30%))",
            "linear-gradient(135deg, hsl(45, 100%, 25%), hsl(25, 100%, 30%))",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.5,
            type: "spring",
            bounce: 0.6,
          }}
        >
          <motion.h1
            className="text-7xl md:text-9xl font-bold mb-8 glow-text"
            animate={{
              textShadow: [
                "0 0 20px rgba(255, 215, 0, 0.8)",
                "0 0 40px rgba(255, 105, 180, 0.8)",
                "0 0 20px rgba(255, 215, 0, 0.8)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Happy Birthday!
          </motion.h1>

          <motion.div
            className="flex justify-center gap-4 mb-12 text-6xl md:text-8xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {["🎂", "🎉", "🎈", "🎁", "💝"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>

          {/* Typing animation message lines */}
          <div className="text-3xl md:text-4xl max-w-3xl mx-auto leading-relaxed space-y-4 font-semibold">
            {displayedText.map((line, index) => (
              <motion.div
                key={index}
                className={`${lineColors[index]} min-h-[1.5em]`}
                initial={{ opacity: 0 }}
                animate={{ opacity: line ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {line}
                {/* Blinking cursor for current line */}
                {index ===
                  displayedText.findIndex(
                    (text, i) =>
                      i >= index &&
                      text.length > 0 &&
                      (i === displayedText.length - 1 ||
                        displayedText[i + 1] === "")
                  ) && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1"
                  >
                    |
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-7xl md:text-9xl"
            >
              ❤️
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "-10%",
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, (Math.random() - 0.5) * 100],
              rotate: [0, 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear",
            }}
          >
            {["❤️", "💖", "💕", "💗", "💝"][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  );
}
