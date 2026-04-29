import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import heroLogoLottie from "../../assets/lottie/hero-logo.lottie?url";
import { ScreenFrame, AvatarCircle, RightChevron, Aed } from "./shared";
import { copy } from "../../lib/copy";

export default function MemberHomeScreen({
  inviterName,
  inviterInitial,
  onLeave,
}: {
  inviterName: string;
  inviterInitial: string;
  onLeave: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  return (
    <ScreenFrame background="linear-gradient(180deg, #fff7ea 0%, #ffffff 30%, #ffffff 100%)">
      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-end px-[18px] pt-[52px] pb-[12px] w-full transition-[background-color,border-color] duration-150 border-b ${
            scrolled
              ? "bg-white border-[#eaecf0]"
              : "bg-transparent border-transparent"
          }`}
        >
          <button
            type="button"
            className="bg-white border border-[#f2f3f7] rounded-[18px] size-[36px] flex items-center justify-center cursor-pointer"
            aria-label="Settings"
          >
            <svg viewBox="0 0 16 16" className="size-[16px]" fill="none">
              <circle cx="8" cy="8" r="2" stroke="#0e0e0e" strokeWidth="1.4" />
              <path
                d="M8 1V3M8 13V15M15 8H13M3 8H1"
                stroke="#0e0e0e"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center mt-[6px]">
          <div className="relative w-[180px] h-[80px]">
            <DotLottieReact
              src={heroLogoLottie}
              autoplay
              loop={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <h1 className="font-bold text-[#0e0e0e] text-[24px] mt-[4px]">
            Siddharth
          </h1>
          <p className="text-[#666d85] text-[13px] mt-[2px]">
            One member since today
          </p>
        </div>

        {/* Plan card — member view */}
        <div className="mx-[16px] mt-[18px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px]">
          <p className="text-[#666d85] text-[12px]">Current plan</p>
          <p className="font-bold text-[#0e0e0e] text-[16px] mt-[4px]">
            noon One Family
          </p>
          <div className="flex items-center gap-[10px] mt-[10px]">
            <AvatarCircle letter={inviterInitial} background="#108757" size={28} />
            <p className="text-[#475067] text-[12px]">
              {copy.memberHome.sharedWithLabel(inviterName)}
            </p>
          </div>
          <p className="text-[#666d85] text-[11px] mt-[8px]">
            Auto renews monthly under {inviterName}'s account
          </p>
        </div>

        {/* Member benefits */}
        <div className="mx-[16px] mt-[14px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px]">
          <p className="font-bold text-[#0e0e0e] text-[14px] mb-[12px]">
            Your benefits
          </p>
          <BenefitItem icon="🚚" title="Unlimited free delivery" />
          <BenefitItem icon="%" title="10% cashback on the 1st of every month" />
          <BenefitItem icon="🔒" title="Your orders & payments stay private" />
        </div>

        {/* Savings */}
        <div className="mx-[16px] mt-[14px] bg-[#fff7ea] border border-[#ffe7c2] rounded-[14px] p-[14px]">
          <p className="text-[#5a3a00] text-[11px]">
            You've already saved
          </p>
          <p className="font-bold text-[#0e0e0e] text-[24px] mt-[2px]">
            <Aed className="text-[16px]" />
            48.00
          </p>
          <p className="text-[#5a3a00] text-[10px] mt-[1px]">
            On 3 free deliveries since you joined
          </p>
        </div>

        {/* Leave plan */}
        <button
          type="button"
          onClick={onLeave}
          className="mx-[16px] mt-[18px] w-[calc(100%-32px)] bg-white border border-[#eaecf0] rounded-[14px] p-[16px] flex items-center justify-between cursor-pointer text-left"
        >
          <div>
            <p className="font-semibold text-[#dc2626] text-[14px]">
              {copy.memberHome.leaveCTA}
            </p>
            <p className="text-[#666d85] text-[11px] mt-[2px]">
              You'll lose access to noon One benefits
            </p>
          </div>
          <RightChevron className="size-[14px]" />
        </button>

        <div className="h-[40px]" />
      </div>
    </ScreenFrame>
  );
}

function BenefitItem({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-[10px] mb-[10px] last:mb-0">
      <div className="size-[24px] rounded-full bg-[#f0fdf4] flex items-center justify-center text-[12px]">
        {icon}
      </div>
      <p className="text-[#0e0e0e] text-[13px]">{title}</p>
    </div>
  );
}
