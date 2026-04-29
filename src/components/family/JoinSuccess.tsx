import { motion } from "framer-motion";
import { ScreenFrame, AvatarCircle, LockIcon } from "./shared";
import { copy } from "../../lib/copy";

export default function JoinSuccess({
  inviterName,
  inviterInitial,
  onContinue,
}: {
  inviterName: string;
  inviterInitial: string;
  onContinue: () => void;
}) {
  return (
    <ScreenFrame background="linear-gradient(180deg, #f7fffc 0%, #ffffff 60%, #ffffff 100%)">
      <div className="relative h-full flex flex-col items-center justify-between pt-[120px] pb-[40px] px-[24px]">
        <div className="flex flex-col items-center text-center">
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

          <h1 className="font-bold text-[#0e0e0e] text-[24px] leading-[28px] tracking-[-0.3px]">
            {copy.joinSuccess.title(inviterName)}
          </h1>

          <div className="mt-[20px] flex items-center gap-[6px]">
            <AvatarCircle letter={inviterInitial} background="#108757" size={36} />
            <div className="bg-[#fcd36b] text-[10px] font-bold text-[#0e0e0e] px-[8px] py-[2px] rounded-full">
              One
            </div>
            <AvatarCircle letter="S" background="#0e0e0e" textColor="white" size={36} />
          </div>

          <div className="mt-[24px] bg-[#fafafa] border border-[#eaecf0] rounded-[14px] p-[14px] w-full">
            <div className="flex items-center gap-[8px] mb-[6px]">
              <LockIcon className="size-[14px]" />
              <p className="font-bold text-[#0e0e0e] text-[13px]">
                Verified privacy
              </p>
            </div>
            <p className="text-[#475067] text-[12px] leading-[16px]">
              {copy.joinSuccess.verificationLine}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full bg-[#0e0e0e] text-white h-[52px] rounded-[14px] font-semibold cursor-pointer"
        >
          {copy.joinSuccess.primaryCTA}
        </button>
      </div>
    </ScreenFrame>
  );
}
