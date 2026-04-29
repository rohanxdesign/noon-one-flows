import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScreenFrame, ShareIcon, AvatarCircle } from "./shared";
import { copy } from "../../lib/copy";
import type { Plan } from "../../lib/familyState";
import { seatCount } from "../../lib/familyState";

export default function SuccessWithInvitePrompt({
  onInviteFirst,
  onInviteLater,
  plan,
}: {
  onInviteFirst: () => void;
  onInviteLater: () => void;
  plan: Plan;
}) {
  const [phase, setPhase] = useState<0 | 1>(0);
  const seats = seatCount(plan);
  const remaining = Math.max(0, seats - 1);

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <ScreenFrame background="linear-gradient(180deg, #f7fffc 0%, #ffffff 60%, #ffffff 100%)">
      <div className="relative h-full flex flex-col items-center justify-between pt-[120px] pb-[40px] px-[24px]">
        <div className="flex flex-col items-center text-center">
          {/* Tick mark animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="size-[88px] rounded-full bg-[#108757] flex items-center justify-center mb-[20px]"
          >
            <svg viewBox="0 0 32 32" className="size-[44px]" fill="none">
              <path
                d="M8 16.5L13.5 22L24 11"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <h1 className="font-bold text-[#0e0e0e] text-[26px] leading-[30px] tracking-[-0.4px]">
            {copy.success.standardTitle}
          </h1>
          <p className="text-[#475067] text-[15px] leading-[20px] mt-[10px]">
            {copy.success.standardSubtitle}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase === 1 ? 1 : 0, y: phase === 1 ? 0 : 20 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Seat preview */}
          {seats > 1 && (
            <div className="bg-white border border-[#eaecf0] rounded-[16px] p-[16px] mb-[16px]">
              <div className="flex items-center justify-between mb-[12px]">
                <p className="font-bold text-[#0e0e0e] text-[14px]">
                  Your seats
                </p>
                <p className="text-[#666d85] text-[12px]">
                  1 of {seats} filled
                </p>
              </div>
              <div className="flex items-center gap-[8px]">
                <AvatarCircle letter="R" background="#108757" size={36} />
                {Array.from({ length: remaining }).map((_, i) => (
                  <AvatarCircle
                    key={i}
                    letter="+"
                    background="#f3f3f5"
                    textColor="#666d85"
                    size={36}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <button
            type="button"
            onClick={onInviteFirst}
            className="w-full bg-[#0e0e0e] text-white h-[52px] rounded-[14px] font-semibold flex items-center justify-center gap-[10px] mb-[10px] cursor-pointer"
          >
            <ShareIcon className="size-[16px]" />
            {copy.success.inviteFirstCTA}
          </button>
          <button
            type="button"
            onClick={onInviteLater}
            className="w-full bg-transparent text-[#666d85] h-[44px] font-semibold cursor-pointer"
          >
            {copy.success.inviteLaterCTA}
          </button>
        </motion.div>
      </div>
    </ScreenFrame>
  );
}
