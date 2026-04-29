import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import heroLogoLottie from "../../assets/lottie/hero-logo.lottie?url";
import {
  ScreenFrame,
  ScreenHeader,
  PrimaryCTA,
  CheckMark,
  RightChevron,
  Aed,
  AvatarCircle,
} from "./shared";
import { copy, getLandingEmphasis } from "../../lib/copy";
import type { Signals } from "../../lib/familyState";

export default function LandingPageFamily({
  onBack,
  onChoosePlan,
  onSharePlan,
  signals,
}: {
  onBack?: () => void;
  onChoosePlan: () => void;
  onSharePlan: () => void;
  signals: Signals;
}) {
  const [scrolled, setScrolled] = useState(false);
  const emphasis = getLandingEmphasis(signals);

  return (
    <ScreenFrame background="linear-gradient(180deg, #fff7ea 0%, #ffffff 35%, #ffffff 100%)">
      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        <ScreenHeader onBack={onBack} scrolled={scrolled} />

        {/* Hero */}
        <div className="flex flex-col items-center px-[16px] pt-[8px]">
          <div className="relative w-[280px] h-[150px]">
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

          <h1 className="font-bold text-center text-[#0e0e0e] text-[32px] leading-[36px] tracking-[-0.4px] mt-[8px] px-[8px]">
            {copy.landing.heroTitle}
          </h1>
          <p className="text-[#475067] text-[15px] leading-[20px] text-center mt-[10px] px-[24px]">
            {copy.landing.heroSubtitle}
          </p>
        </div>

        {/* Signal-emphasis card — only renders when a relevant signal is on */}
        {emphasis && (
          <div className="mx-[16px] mt-[18px] bg-[#f7fffc] border border-[#cfeadd] rounded-[14px] p-[14px] flex items-start gap-[10px]">
            <div className="bg-[#108757] text-white text-[10px] font-bold px-[8px] py-[2px] rounded-full uppercase tracking-wider shrink-0">
              For you
            </div>
            <p className="flex-1 font-semibold text-[#0e0e0e] text-[13px] leading-[17px] tracking-[-0.1px]">
              {emphasis}
            </p>
          </div>
        )}

        {/* Primary CTA — Choose plan */}
        <div className="px-[16px] mt-[20px]">
          <button
            type="button"
            onClick={onChoosePlan}
            className="w-full bg-[#108757] text-white font-bold text-[15px] h-[52px] rounded-[14px] cursor-pointer"
          >
            {copy.landing.primaryCTA}
          </button>
        </div>

        {/* Benefits stack */}
        <div className="mx-[16px] mt-[20px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px] flex flex-col gap-[14px]">
          <BenefitRow
            title="15 days free trial"
            subtitle="Risk free, you can cancel anytime"
          />
          <Divider />
          <BenefitRow
            title="Unlimited free delivery"
            subtitle="On food, groceries, & shopping — for everyone on your plan"
          />
          <Divider />
          <BenefitRow
            title="Member-only deals"
            subtitle="Big savings, every month"
          />
          <Divider />
          <BenefitRow
            title="Up to 5 seats"
            subtitle="One owner, up to 4 invited members"
          />
        </div>

        {/* Per-seat math card */}
        <div className="mx-[16px] mt-[14px] bg-[#fff7ea] border border-[#ffe7c2] rounded-[16px] p-[16px]">
          <div className="flex items-baseline justify-between mb-[6px]">
            <p className="font-bold text-[#0e0e0e] text-[14px]">
              5x the value, for 5 people
            </p>
            <p className="font-bold text-[#0e0e0e] text-[20px]">
              <Aed className="text-[16px]" />
              10
              <span className="text-[12px] text-[#666d85] font-medium">
                /seat/mo
              </span>
            </p>
          </div>
          <p className="text-[#666d85] text-[12px] leading-[15px]">
            <Aed className="text-[10px] text-[#666d85]" />
            50/month total. Each seat gets a separate noon account with full
            benefits.
          </p>
        </div>

        {/* Share-plan-details surface — Cohort D lens, but visible to all */}
        <button
          type="button"
          onClick={onSharePlan}
          className="mx-[16px] mt-[14px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px] flex items-center gap-[12px] w-[calc(100%-32px)] cursor-pointer text-left"
        >
          <div className="flex -space-x-2 shrink-0">
            <AvatarCircle letter="R" background="#108757" size={36} />
            <AvatarCircle
              letter="K"
              background="#0e0e0e"
              size={36}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#0e0e0e] text-[14px]">
              Share plan details
            </p>
            <p className="text-[#666d85] text-[12px]">
              Send the offer to family before subscribing
            </p>
          </div>
          <RightChevron className="size-[14px]" />
        </button>

        {/* Privacy line — Cohort E lens, persistent */}
        <p className="mx-[16px] mt-[18px] text-[#666d85] text-[11px] leading-[15px] text-center">
          {copy.planDetail.privacyEnumeration}
        </p>

        <div className="h-[140px]" />
      </div>

      <PrimaryCTA label={copy.landing.primaryCTA} onClick={onChoosePlan} />
    </ScreenFrame>
  );
}

function BenefitRow({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-[12px]">
      <div className="size-[24px] rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0 mt-[1px]">
        <CheckMark className="size-[14px]" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-[#0e0e0e] text-[14px] leading-[18px]">
          {title}
        </p>
        <p className="text-[#666d85] text-[12px] leading-[16px] mt-[2px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full border-t border-dashed border-[#eaecf0]" />;
}
