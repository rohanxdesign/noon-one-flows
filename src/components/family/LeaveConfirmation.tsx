import { motion } from "framer-motion";
import { copy } from "../../lib/copy";

export default function LeaveConfirmation({
  onConfirmLeave,
  onCancel,
}: {
  onConfirmLeave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-[20px] pb-[36px]"
      >
        <div className="flex justify-center pb-[12px]">
          <div className="bg-[#d0d5dd] h-[4px] w-[40px] rounded-full" />
        </div>

        <div className="size-[64px] rounded-full bg-[#fef2f2] mx-auto flex items-center justify-center mb-[16px]">
          <svg viewBox="0 0 24 24" className="size-[32px]" fill="none">
            <path
              d="M9 9L15 15M15 9L9 15"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#dc2626"
              strokeWidth="1.6"
            />
          </svg>
        </div>

        <h2 className="font-bold text-center text-[#0e0e0e] text-[20px] leading-[24px]">
          {copy.leaveConfirmation.title}
        </h2>
        <p className="text-center text-[#475067] text-[13px] leading-[18px] mt-[8px] px-[8px]">
          {copy.leaveConfirmation.body}
        </p>

        <button
          type="button"
          onClick={onConfirmLeave}
          className="mt-[20px] w-full bg-[#dc2626] text-white h-[52px] rounded-[14px] font-semibold cursor-pointer"
        >
          {copy.leaveConfirmation.primaryCTA}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-[8px] w-full bg-transparent text-[#0e0e0e] h-[44px] font-semibold cursor-pointer"
        >
          {copy.leaveConfirmation.secondaryCTA}
        </button>
      </motion.div>
    </div>
  );
}
