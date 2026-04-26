import { motion } from "framer-motion";

// Ease-out-expo — very fast attack, long gentle tail. The reel blurs through
// early cells then slows noticeably into the final 2-3, giving the "lock in"
// feel slot machines are known for.
const SLOT_EASE = [0.16, 1, 0.3, 1] as const;
const CYCLES = 2;

function SlotDigit({
  digit,
  height,
  duration,
  delay = 0,
}: {
  digit: number;
  height: number;
  duration: number;
  delay?: number;
}) {
  const targetIndex = CYCLES * 10 + digit;
  const cells = Array.from({ length: targetIndex + 1 }, (_, i) => i % 10);

  return (
    <span
      className="inline-block overflow-clip align-baseline"
      style={{ height }}
    >
      <motion.span
        className="block"
        initial={{ y: 0 }}
        animate={{ y: -targetIndex * height }}
        transition={{ duration, delay, ease: SLOT_EASE }}
      >
        {cells.map((n, i) => (
          <span
            key={i}
            className="block text-center tabular-nums"
            style={{ height, lineHeight: `${height}px`, minWidth: "0.6em" }}
          >
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export default function SlotNumber({
  value,
  height = 31,
  baseDuration = 1.0,
  perDigitDuration = 0.15,
  shimmer = false,
  delay = 0,
}: {
  value: string | number;
  height?: number;
  baseDuration?: number;
  perDigitDuration?: number;
  shimmer?: boolean;
  delay?: number;
}) {
  const chars = String(value).split("");
  let digitIndex = 0;
  const totalDigits = chars.filter((c) => c >= "0" && c <= "9").length;
  const settleTime = delay + baseDuration + (totalDigits - 1) * perDigitDuration;

  return (
    <span className="relative inline-flex align-baseline overflow-clip">
      {chars.map((ch, i) => {
        if (ch < "0" || ch > "9") {
          return (
            <span key={i} style={{ lineHeight: `${height}px` }}>
              {ch}
            </span>
          );
        }
        const d = Number(ch);
        const idx = digitIndex++;
        return (
          <SlotDigit
            key={`${i}-${d}`}
            digit={d}
            height={height}
            duration={baseDuration + idx * perDigitDuration}
            delay={delay}
          />
        );
      })}

      {shimmer && (
        <motion.span
          className="absolute inset-y-0 w-[60%] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
          }}
          initial={{ left: "-60%" }}
          animate={{ left: "120%" }}
          transition={{
            duration: 0.7,
            ease: SLOT_EASE,
            delay: settleTime + 0.25,
          }}
        />
      )}
    </span>
  );
}
