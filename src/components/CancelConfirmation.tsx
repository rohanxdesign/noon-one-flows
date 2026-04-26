import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatusBar from "./StatusBar";

function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M6 18L18 6"
        stroke="#991B1B"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Shop-app reveal curve (ease-out-quint). Quick leading edge, soft settle —
// the same shape Shopify's Shop app uses for confirmation moments. Lets the
// title land confidently, then the body follows behind.
const SHOP_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Two-phase confirmation shown after the user finalises a cancellation.
 *
 * Phase 1 — the X badge sits at the vertical centre (matches the "Cancel"
 * Figma frame). Phase 2 (~700ms later) — the badge eases up to make room,
 * the title fades in from below, then the body copy follows ~300ms later.
 */
export default function CancelConfirmation({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance to the post-cancel retention screen after the body copy has
  // had ~1.6s to read (body finishes animating in around 2.15s after mount).
  // The X badge remains tappable as a manual skip.
  useEffect(() => {
    const t = setTimeout(onDismiss, 3800);
    return () => clearTimeout(t);
  }, [onDismiss]);

  // Icon target (Figma): top: 298px. Centre of an 812px frame puts the
  // 76px badge at top: 368px — so phase 1 sits 70px lower than phase 2.
  const ICON_TOP = 298;
  const ICON_OFFSET_PHASE_1 = 70;

  return (
    <div className="relative w-[375px] h-[812px] mx-auto overflow-hidden rounded-[20px] bg-white">
      <StatusBar />

      <motion.button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute left-1/2 bg-[#feebeb] border-[10px] border-solid border-[#fca5a5] flex items-center justify-center rounded-full p-[12px] cursor-pointer"
        style={{ top: ICON_TOP }}
        // Phase 1 — badge pops from scale 0 → 1 via a gentle spring.
        // Phase 2 — y-settle runs over 0.9s with the same Shop ease so it
        // reads as a continuation of the spring, not a separate motion.
        // Title + body overlap the tail of the y-settle (they "join" the
        // icon's motion rather than waiting for it to finish).
        initial={{ x: "-50%", y: ICON_OFFSET_PHASE_1, scale: 0, opacity: 0 }}
        animate={{
          x: "-50%",
          y: revealed ? 0 : ICON_OFFSET_PHASE_1,
          scale: 1,
          opacity: 1,
        }}
        transition={{
          scale: { type: "spring", stiffness: 130, damping: 20, mass: 1 },
          opacity: { duration: 0.5, ease: SHOP_EASE },
          y: { duration: 0.9, ease: SHOP_EASE },
        }}
      >
        <CrossIcon className="size-[32px]" />
      </motion.button>

      <div className="absolute left-[30px] top-[398px] w-[316px] flex flex-col gap-[12px] items-center text-center">
        <motion.p
          className="font-noontree font-bold text-[20px] leading-[24px] tracking-[-0.2px] text-[#0e0e0e]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
          transition={{
            duration: 0.6,
            ease: SHOP_EASE,
            delay: revealed ? 0.2 : 0,
          }}
        >
          Your membership is cancelled
        </motion.p>
        <motion.p
          className="text-[14px] leading-[20px] tracking-[-0.3px] text-black/75"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
          transition={{
            duration: 0.6,
            ease: SHOP_EASE,
            delay: revealed ? 0.55 : 0,
          }}
        >
          Your plan ends on April 30, 2026.
          <br />
          Reactivate your membership from your profile.
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center pt-[12px] pb-[16px] pointer-events-none">
        <div className="bg-[#404553] h-[5px] rounded-[8px] w-[124px]" />
      </div>
    </div>
  );
}
