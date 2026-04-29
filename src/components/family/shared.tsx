// Shared primitives for the family-sharing prototype screens.
// Inline icons + screen scaffold + dirham glyph helper.

import { type ReactNode } from "react";
import StatusBar from "../StatusBar";

const AED_GLYPH = "";

export function Aed({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="AED"
      className={`font-noontree tracking-[0] inline-block align-baseline mr-[2px] ${className}`}
    >
      {AED_GLYPH}
    </span>
  );
}

export function BackChevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12.5 5L7.5 10L12.5 15"
        stroke="#0E0E0E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RightChevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5.5 3.5L9 7L5.5 10.5"
        stroke="#1d2539"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckMark({
  className = "",
  color = "#108757",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 8.5L6.5 12L13 5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle({
  className = "",
  color = "#0E0E0E",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z"
        fill={color}
      />
    </svg>
  );
}

export function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="7"
        width="10"
        height="7"
        rx="1.5"
        stroke="#108757"
        strokeWidth="1.4"
      />
      <path
        d="M5 7V5C5 3.34315 6.34315 2 8 2C9.65685 3.34315 11 4.34315 11 6V7"
        stroke="#108757"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 1.5V10M8 1.5L5 4.5M8 1.5L11 4.5"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 8V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V8"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Standard 375×812 frame with status bar + iPhone home indicator. */
export function ScreenFrame({
  children,
  background = "white",
}: {
  children: ReactNode;
  background?: string;
}) {
  return (
    <div
      className="relative w-[375px] h-[812px] mx-auto overflow-hidden rounded-[20px]"
      style={{ background }}
    >
      <StatusBar />
      {children}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center py-[14px] pointer-events-none">
        <div className="bg-[#404553] h-[5px] rounded-[8px] w-[124px]" />
      </div>
    </div>
  );
}

/** Sticky header with back button and title — shared across most screens. */
export function ScreenHeader({
  title,
  onBack,
  scrolled,
}: {
  title?: string;
  onBack?: () => void;
  scrolled: boolean;
}) {
  return (
    <div
      className={`sticky top-0 z-10 flex items-center gap-[8px] px-[18px] pt-[52px] pb-[12px] w-full transition-[background-color,border-color] duration-150 border-b ${
        scrolled
          ? "bg-white border-[#eaecf0]"
          : "bg-transparent border-transparent"
      }`}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="bg-white border border-[#f2f3f7] flex items-center justify-center p-[8px] rounded-[18px] cursor-pointer shrink-0"
        >
          <BackChevron className="size-[20px]" />
        </button>
      )}
      {title && (
        <p className="flex-1 font-bold text-[#0e0e0e] text-[16px] leading-[20px] tracking-[-0.16px]">
          {title}
        </p>
      )}
    </div>
  );
}

/** Bottom-pinned primary CTA bar (black pill). */
export function PrimaryCTA({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-[16px] pb-[28px] pt-[12px] bg-gradient-to-t from-white via-white to-transparent">
      <button
        type="button"
        onClick={onClick}
        className="bg-[#0e0e0e] text-white w-full h-[52px] rounded-[14px] font-semibold text-[15px] cursor-pointer"
      >
        {label}
      </button>
    </div>
  );
}

/** Avatar circle with single-letter initial. */
export function AvatarCircle({
  letter,
  background = "#108757",
  textColor = "white",
  size = 48,
}: {
  letter: string;
  background?: string;
  textColor?: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        background,
        color: textColor,
        fontSize: size * 0.4,
      }}
    >
      {letter}
    </div>
  );
}
