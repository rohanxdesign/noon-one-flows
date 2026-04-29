import { useEffect } from "react";
import { motion } from "framer-motion";
import { copy } from "../../lib/copy";

/**
 * Held-icon moment between accepting the invite and landing on success.
 * Mimics the "Upgrading your experience" frame from the design references.
 */
export default function JoiningTransition({
  onDone,
  durationMs = 2400,
}: {
  onDone: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [onDone, durationMs]);

  return (
    <div
      className="relative w-[375px] h-[812px] mx-auto overflow-hidden rounded-[20px]"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, #fcd36b 0%, #fff7ea 35%, #ffffff 70%)",
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <p className="font-bold text-[#0e0e0e] text-[22px] tracking-[-0.4px]">
          {copy.joiningTransition}
        </p>
      </motion.div>
    </div>
  );
}
