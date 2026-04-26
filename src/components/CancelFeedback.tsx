import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import StatusBar from "./StatusBar";
import SmoothCorners from "./SmoothCorners";

/* ---------- Inline icons ---------- */

function BackChevron({ className = "" }: { className?: string }) {
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

/** Dirham (AED) glyph from the Noontree font (PUA U+E001). */
const AED_GLYPH = "";

function Aed({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="AED"
      className={`font-noontree tracking-[0] inline-block align-baseline mr-[2px] ${className}`}
    >
      {AED_GLYPH}
    </span>
  );
}

/** Selectable circle on the right side of each reason row.
    Selected state is a 5px blue stroke (per design), so the white
    fill stays visible as a small inner circle. */
function Radio({ selected }: { selected: boolean }) {
  return selected ? (
    <div className="size-[20px] rounded-full border-[5px] border-[#0076ff] bg-white shrink-0" />
  ) : (
    <div className="size-[20px] rounded-full border border-[#989fb3] bg-white shrink-0" />
  );
}

/* ---------- Reason options ---------- */

const REASONS = [
  "The price is quite high",
  "No longer need the benefits of noon one",
  "I don't order often enough",
  "Pausing my membership temporarily",
  "Found better value elsewhere",
  "Issues with orders",
  "Other",
] as const;

type Reason = (typeof REASONS)[number];

/* ---------- Screen ---------- */

export default function CancelFeedback({
  onBack,
  onKeepMembership,
  onContinueCancellation,
}: {
  onBack: () => void;
  onKeepMembership: () => void;
  onContinueCancellation: (reason: Reason) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);

  return (
    <div
      className="relative w-[375px] h-[812px] mx-auto overflow-hidden rounded-[20px]"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #ffffff 0%, #f4f3f3 21%, #f4f3f3 100%)",
      }}
    >
      <StatusBar />

      {/* Back button — floats top-left */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="absolute left-[14px] top-[59px] z-20 bg-white border border-[#f2f3f7] flex items-center justify-center p-[8px] rounded-[18px] cursor-pointer"
      >
        <BackChevron className="size-[20px]" />
      </button>

      {/* Scrollable content area — leaves room for the fixed action bar
          (~158px including home indicator). */}
      <div className="absolute inset-0 pt-[110px] pb-[180px] overflow-y-auto">
        <div className="px-[14px] flex flex-col gap-[16px]">
          {/* Title */}
          <div className="flex flex-col gap-[4px]">
            <p className="font-bold text-[#343d54] text-[28px] leading-[31px] tracking-[-0.68px]">
              Before you go,
            </p>
            <p className="font-noontree text-[#666d85] text-[16px] leading-[22px] tracking-[-0.28px]">
              You can save{" "}
              <span className="relative inline-flex overflow-clip font-bold text-[#108757]">
                <Aed />928/year
                <motion.span
                  className="absolute inset-y-0 w-[60%] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                  }}
                  animate={{ left: ["-60%", "120%"] }}
                  transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    repeat: Infinity,
                    repeatDelay: 2.5,
                  }}
                />
              </span>{" "}
              with us. Please tell us why you want to cancel?
            </p>
          </div>

          {/* Reasons list — dividers are direct flex siblings of buttons so
              they sit between rows. They inherit the container's px-[8px]
              just like every other element in here (no negative inset). */}
          <SmoothCorners
            radius={16}
            className="bg-white rounded-[16px] w-full px-[8px] py-[12px] flex flex-col flex-wrap gap-[7px] shadow-[0px_2px_20px_rgba(0,0,0,0.04)]"
          >
            {REASONS.map((reason, i) => (
              <Fragment key={reason}>
                <button
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className="w-full flex items-center justify-between px-[8px] py-[4px] rounded-[12px] cursor-pointer shrink-0"
                >
                  <p className="font-noontree font-medium text-[#475067] text-[14px] leading-[18px] tracking-[-0.14px] text-left">
                    {reason}
                  </p>
                  <Radio selected={selectedReason === reason} />
                </button>
                {i < REASONS.length - 1 && (
                  <div className="border-t border-dashed border-[#eaecf0] shrink-0" />
                )}
              </Fragment>
            ))}
          </SmoothCorners>

          {/* Pro tip card */}
          <SmoothCorners
            radius={16}
            className="bg-[#fcfcfd] rounded-[16px] w-full p-[12px]"
          >
            <p className="text-[13px] leading-[22px] text-[#666d85]">
              <span className="font-bold text-[#108757]">Pro tip:</span>
              {"  "}8 out of 10 members save 4x more than what they pay for with
              their benefits. Don't miss out!
            </p>
          </SmoothCorners>
        </div>
      </div>

      {/* Bottom fixed action bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white pt-[12px] pb-[16px] px-[16px] flex flex-col gap-[12px] rounded-tl-[12px] rounded-tr-[12px]">
        <button
          type="button"
          onClick={onKeepMembership}
          className="bg-[#101628] text-white font-semibold text-[15px] leading-[20px] tracking-[-0.26px] h-[52px] rounded-[12px] cursor-pointer"
        >
          Keep membership
        </button>
        <button
          type="button"
          onClick={() =>
            selectedReason && onContinueCancellation(selectedReason)
          }
          disabled={!selectedReason}
          className="bg-[#f9f9fb] border border-[#eaecf0] text-[#0e0e0e] font-semibold text-[15px] leading-[20px] tracking-[-0.26px] h-[52px] rounded-[12px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue Cancellation
        </button>
        {/* iPhone home indicator */}
        <div className="flex justify-center pt-[8px]">
          <div className="bg-[#404553] h-[5px] rounded-[8px] w-[124px]" />
        </div>
      </div>
    </div>
  );
}
