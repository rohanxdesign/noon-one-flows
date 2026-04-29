import { motion } from "framer-motion";
import { useState } from "react";
import {
  AvatarCircle,
  ShareIcon,
  CheckMark,
  LockIcon,
} from "./shared";
import { copy } from "../../lib/copy";
import type { FamilyState } from "../../lib/familyState";

/**
 * Half-sheet share-invite surface — extends from the bottom of the existing
 * screen, with a backdrop tap-to-dismiss. Includes the recency-of-contact
 * list (innovation moment from the team alignment call), the invite URL,
 * and a "How it works" 3-step explainer.
 */
export default function ShareInviteSheet({
  state,
  onDismiss,
}: {
  state: FamilyState;
  onDismiss: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="absolute inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onDismiss}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] max-h-[88%] overflow-y-auto"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-[10px] pb-[6px]">
          <div className="bg-[#d0d5dd] h-[4px] w-[40px] rounded-full" />
        </div>

        <div className="px-[20px] pb-[28px]">
          {/* Header — avatars + title */}
          <div className="flex flex-col items-center pt-[8px]">
            <div className="flex items-center -space-x-3">
              <AvatarCircle letter="R" background="#108757" size={56} />
              <div className="size-[22px] rounded-full bg-[#fcd36b] flex items-center justify-center text-[10px] font-bold text-[#0e0e0e] ring-2 ring-white relative -mb-3">
                One
              </div>
              <AvatarCircle letter="+" background="#3b82f6" size={56} />
            </div>
            <h2 className="font-bold text-[#0e0e0e] text-[22px] text-center mt-[16px] leading-[26px]">
              {copy.shareInvite.title}
            </h2>
            <p className="text-[#666d85] text-[13px] text-center mt-[6px]">
              {copy.shareInvite.subtitle}
            </p>
          </div>

          {/* Invite link copy field */}
          <div className="mt-[20px] bg-white border border-[#eaecf0] rounded-[14px] px-[14px] h-[52px] flex items-center justify-between">
            <p className="text-[#475067] text-[14px] font-medium">
              {copy.shareInvite.inviteUrlLabel}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[#108757] text-[14px] font-semibold flex items-center gap-[6px] cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckMark className="size-[14px]" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="size-[14px]" />
                  {copy.shareInvite.copyLabel}
                </>
              )}
            </button>
          </div>

          {/* Recency-of-contact list — innovation moment from the call */}
          {state.recentlySharedWith.length > 0 && (
            <div className="mt-[16px]">
              <p className="text-[#475067] text-[11px] font-semibold uppercase tracking-wider mb-[10px]">
                {copy.shareInvite.recencyLabel}
              </p>
              <div className="flex gap-[12px] overflow-x-auto pb-[6px]">
                {state.recentlySharedWith.map((name, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex flex-col items-center gap-[6px] shrink-0 cursor-pointer"
                  >
                    <AvatarCircle
                      letter={name[0]}
                      background={["#108757", "#0e0e0e", "#3b82f6", "#a86b00"][i % 4]}
                      size={48}
                    />
                    <p className="text-[#0e0e0e] text-[11px] font-medium max-w-[64px] truncate text-center">
                      {name.split(" ")[0]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary CTA */}
          <button
            type="button"
            className="mt-[18px] w-full bg-[#0e0e0e] text-white h-[52px] rounded-[14px] font-semibold flex items-center justify-center gap-[10px] cursor-pointer"
          >
            <ShareIcon className="size-[16px]" />
            {copy.shareInvite.primaryCTA}
          </button>

          {/* Benefit lines */}
          <div className="mt-[18px] flex flex-col gap-[12px]">
            {copy.shareInvite.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-[10px]">
                <LockIcon className="size-[14px] shrink-0 mt-[2px]" />
                <p className="text-[#475067] text-[12px] leading-[16px] flex-1">
                  {b}
                </p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-[20px] bg-[#fafafa] border border-[#eaecf0] rounded-[14px] p-[14px]">
            <p className="font-bold text-[#0e0e0e] text-[13px] mb-[10px]">
              How it works
            </p>
            {copy.shareInvite.howItWorks.map((step, i) => (
              <div key={i} className="flex items-start gap-[10px] mb-[8px] last:mb-0">
                <div className="size-[20px] rounded-full bg-[#0e0e0e] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-[#475067] text-[12px] leading-[16px] flex-1">
                  {step}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-[16px] text-center text-[#666d85] text-[10px] leading-[14px]">
            By participating, you agree to our{" "}
            <span className="underline">Terms and Conditions</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function CopyIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="#108757" strokeWidth="1.4" />
      <path d="M3 11V3.5C3 2.94772 3.44772 2.5 4 2.5H11" stroke="#108757" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
