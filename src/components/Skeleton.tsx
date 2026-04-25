import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import StatusBar from "./StatusBar";

/* ---------- Primitive ---------- */

export function Skel({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#eef0f3] ${className}`}
      style={style}
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/55 to-transparent" />
    </div>
  );
}

/* ---------- Gate ---------- */

/**
 * Wraps a screen so the skeleton silhouette shows for `holdMs` after mount,
 * then crossfades to the real children. Real children only mount once
 * `ready=true`, so heavy animations (Lottie etc.) don't start during the
 * fake-load window.
 */
export function SkeletonGate({
  skeleton,
  children,
  holdMs = 380,
  fadeMs = 220,
}: {
  skeleton: ReactNode;
  children: ReactNode;
  holdMs?: number;
  fadeMs?: number;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), holdMs);
    return () => clearTimeout(t);
  }, [holdMs]);

  return (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: ready ? 0 : 1 }}
        transition={{ duration: fadeMs / 1000, ease: "easeOut" }}
      >
        {skeleton}
      </motion.div>
      {ready && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: fadeMs / 1000, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}

/* ---------- Shared chrome ---------- */

function PageFrame({
  children,
  bg = "#f4f4f4",
}: {
  children: ReactNode;
  bg?: string;
}) {
  return (
    <div
      className="relative w-[375px] h-[812px] mx-auto rounded-[20px] overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      <StatusBar />
      {children}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-center py-[14px] pointer-events-none">
        <div className="bg-[#404553] h-[5px] rounded-[8px] w-[124px]" />
      </div>
    </div>
  );
}

function HeaderRow({ titleWidth = 140 }: { titleWidth?: number }) {
  return (
    <div className="flex items-center gap-[8px] px-[18px] pt-[52px] pb-[12px] w-full">
      <Skel className="size-[36px] rounded-full" />
      <Skel
        className="h-[16px] rounded-[6px]"
        style={{ width: titleWidth }}
      />
    </div>
  );
}

/* ---------- Per-screen skeletons ---------- */

export function HomeSkeleton() {
  return (
    <PageFrame bg="#f4f4f4">
      <div className="relative flex flex-col gap-[18px] items-center w-[346px] mx-auto pt-[89px] pb-[40px]">
        {/* Hero — round logo + name + subtitle */}
        <div className="flex flex-col items-center gap-[12px]">
          <Skel className="size-[120px] rounded-full" />
          <Skel className="h-[28px] w-[200px] rounded-[8px]" />
          <Skel className="h-[14px] w-[180px] rounded-[6px]" />
        </div>
        {/* Current plan card */}
        <Skel className="w-[346px] h-[120px] rounded-[12px]" />
        {/* Savings card */}
        <Skel className="w-[346px] h-[260px] rounded-[16px]" />
        {/* Promo strip */}
        <Skel className="w-[346px] h-[166px] rounded-[12px]" />
        {/* OSN card */}
        <Skel className="w-[346px] h-[139px] rounded-[12px]" />
      </div>
    </PageFrame>
  );
}

export function ManageSkeleton() {
  return (
    <PageFrame bg="#ffffff">
      <HeaderRow titleWidth={170} />
      <div className="flex flex-col items-center gap-[24px] mt-[16px]">
        {/* Plan block */}
        <Skel className="w-[343px] h-[260px] rounded-[16px]" />
        {/* Payment block */}
        <Skel className="w-[343px] h-[120px] rounded-[16px]" />
        {/* Cancel block */}
        <Skel className="w-[343px] h-[68px] rounded-[16px]" />
      </div>
    </PageFrame>
  );
}

export function ChangePlanSkeleton() {
  return (
    <PageFrame bg="#ffffff">
      <HeaderRow titleWidth={130} />
      <div className="flex flex-col items-center gap-[12px] mt-[8px] px-[16px]">
        <Skel className="w-[343px] h-[150px] rounded-[16px]" />
        <Skel className="w-[343px] h-[150px] rounded-[16px]" />
        <Skel className="w-[343px] h-[150px] rounded-[16px]" />
      </div>
      <div className="absolute bottom-[40px] left-0 right-0 px-[16px]">
        <Skel className="w-full h-[52px] rounded-[14px]" />
      </div>
    </PageFrame>
  );
}

export function CancelSkeleton() {
  return (
    <PageFrame bg="#ffffff">
      <HeaderRow titleWidth={150} />
      <div className="flex flex-col items-center gap-[16px] mt-[8px] px-[16px]">
        <Skel className="h-[28px] w-[280px] rounded-[8px] mt-[8px]" />
        <Skel className="h-[16px] w-[300px] rounded-[6px]" />
        <Skel className="h-[16px] w-[240px] rounded-[6px]" />
        <Skel className="w-[343px] h-[140px] rounded-[16px] mt-[12px]" />
        <Skel className="w-[343px] h-[140px] rounded-[16px]" />
      </div>
      <div className="absolute bottom-[40px] left-0 right-0 px-[16px] flex flex-col gap-[10px]">
        <Skel className="w-full h-[52px] rounded-[14px]" />
        <Skel className="w-full h-[52px] rounded-[14px]" />
      </div>
    </PageFrame>
  );
}

export function CancelFeedbackSkeleton() {
  return (
    <PageFrame bg="#ffffff">
      <HeaderRow titleWidth={170} />
      <div className="flex flex-col gap-[14px] mt-[12px] px-[20px]">
        <Skel className="h-[24px] w-[260px] rounded-[8px]" />
        <Skel className="h-[14px] w-[300px] rounded-[6px]" />
        <div className="flex flex-col mt-[12px]">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-[14px] border-b border-[#f1f2f5]"
            >
              <Skel
                className="h-[14px] rounded-[6px]"
                style={{ width: 180 + ((i * 23) % 80) }}
              />
              <Skel className="size-[20px] rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-[40px] left-0 right-0 px-[16px]">
        <Skel className="w-full h-[52px] rounded-[14px]" />
      </div>
    </PageFrame>
  );
}
