import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

interface AIOrbProps {
  isThinking?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AIOrb = ({ isThinking = false, size = "md", className = "" }: AIOrbProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-teal-glow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-accent rounded-full shadow-purple-glow" />
      </motion.div>

      {/* Middle pulsing ring */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm"
        animate={isThinking ? {
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner core */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-primary via-blue-500 to-accent flex items-center justify-center shadow-neon-glow"
        animate={isThinking ? {
          boxShadow: [
            "0 0 20px rgba(0, 229, 190, 0.3), 0 0 40px rgba(0, 229, 190, 0.1)",
            "0 0 40px rgba(0, 229, 190, 0.6), 0 0 80px rgba(0, 229, 190, 0.3)",
            "0 0 20px rgba(0, 229, 190, 0.3), 0 0 40px rgba(0, 229, 190, 0.1)",
          ],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {isThinking ? (
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles size={iconSizes[size]} className="text-background" />
          </motion.div>
        ) : (
          <Brain size={iconSizes[size]} className="text-background" />
        )}
      </motion.div>

      {/* Particle effects when thinking */}
      {isThinking && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: "50%",
                top: "50%",
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI) / 3) * 40],
                y: [0, Math.sin((i * Math.PI) / 3) * 40],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
