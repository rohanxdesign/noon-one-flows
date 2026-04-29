import { useState } from "react";
import {
  ScreenFrame,
  ScreenHeader,
  PrimaryCTA,
  CheckMark,
  Aed,
  LockIcon,
  AvatarCircle,
} from "./shared";
import { copy, getPlanDetailEmphasis } from "../../lib/copy";
import type { Plan, Signals } from "../../lib/familyState";
import { totalPrice, perSeatPrice, seatCount } from "../../lib/familyState";

export default function PlanDetailFamily({
  onBack,
  onSubscribe,
  plan,
  signals,
}: {
  onBack: () => void;
  onSubscribe: () => void;
  plan: Plan;
  signals: Signals;
}) {
  const [scrolled, setScrolled] = useState(false);
  const transitionPreview = getPlanDetailEmphasis(signals);
  const seats = seatCount(plan);

  const isFamily = plan === "family";
  const isDuo = plan === "duo";

  const planTitle = isFamily
    ? "noon One Family"
    : isDuo
      ? "noon One Duo"
      : "noon One";

  return (
    <ScreenFrame background="white">
      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        <ScreenHeader title={planTitle} onBack={onBack} scrolled={scrolled} />

        {/* Persistent trust line — always visible */}
        <div className="mx-[16px] mt-[8px] flex items-center gap-[8px] bg-[#f7fffc] border border-[#e7f6f0] rounded-[12px] px-[12px] py-[10px]">
          <LockIcon className="size-[16px] shrink-0" />
          <p className="text-[#108757] text-[12px] font-semibold leading-[15px] flex-1">
            {copy.planDetail.trustLineDefault}
          </p>
        </div>

        {/* Pricing block */}
        <div className="px-[16px] pt-[18px]">
          <p className="font-bold text-[#0e0e0e] text-[26px] leading-[30px] tracking-[-0.4px]">
            {planTitle}
          </p>
          <div className="flex items-baseline gap-[8px] mt-[8px]">
            <p className="font-bold text-[#0e0e0e] text-[34px] leading-none">
              <Aed className="text-[22px]" />
              {totalPrice(plan).toFixed(2)}
            </p>
            <p className="text-[#666d85] text-[14px]">/month</p>
          </div>
          {seats > 1 && (
            <p className="text-[#108757] text-[13px] font-semibold mt-[4px]">
              <Aed className="text-[10px] text-[#108757]" />
              {perSeatPrice(plan).toFixed(2)} per seat — covers up to {seats} people
            </p>
          )}
        </div>

        {/* Transition preview — Cohort A or B lens, only when signal fires */}
        {transitionPreview && (
          <div className="mx-[16px] mt-[18px] bg-[#fff7ea] border border-[#ffe7c2] rounded-[14px] p-[14px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#a86b00] mb-[6px]">
              What happens when you switch
            </p>
            <p className="text-[#0e0e0e] text-[13px] leading-[17px]">
              {transitionPreview}
            </p>
          </div>
        )}

        {/* Seat avatars row — Family only */}
        {isFamily && (
          <div className="mx-[16px] mt-[18px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px]">
            <p className="font-bold text-[#0e0e0e] text-[14px] mb-[12px]">
              Up to 5 separate accounts
            </p>
            <div className="flex items-center gap-[10px]">
              <AvatarCircle letter="R" background="#108757" size={40} />
              <AvatarCircle letter="?" background="#f3f3f5" textColor="#666d85" size={40} />
              <AvatarCircle letter="?" background="#f3f3f5" textColor="#666d85" size={40} />
              <AvatarCircle letter="?" background="#f3f3f5" textColor="#666d85" size={40} />
              <AvatarCircle letter="?" background="#f3f3f5" textColor="#666d85" size={40} />
            </div>
            <p className="text-[#666d85] text-[11px] mt-[10px] leading-[15px]">
              Each member uses their own noon account. Their cart, orders, and
              addresses are private — only billing rolls up to you.
            </p>
          </div>
        )}

        {/* Benefits */}
        <div className="mx-[16px] mt-[14px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px] flex flex-col gap-[10px]">
          {[
            "Unlimited free delivery on every order",
            "Member-only deals and cashback",
            "Priority support",
            isFamily ? "Manage members, change once every 30 days" : "Easy cancel anytime",
          ].map((b, i) => (
            <div key={i} className="flex items-start gap-[10px]">
              <CheckMark className="size-[16px] shrink-0 mt-[1px]" />
              <p className="text-[#0e0e0e] text-[13px] leading-[17px]">{b}</p>
            </div>
          ))}
        </div>

        {/* Privacy enumeration — Cohort E lens, persistent */}
        <div className="mx-[16px] mt-[14px] bg-[#fafafa] border border-[#eaecf0] rounded-[16px] p-[16px]">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <LockIcon className="size-[14px]" />
            <p className="font-bold text-[#0e0e0e] text-[13px]">
              Privacy by default
            </p>
          </div>
          <p className="text-[#475067] text-[12px] leading-[16px]">
            {copy.planDetail.privacyEnumeration}
          </p>
        </div>

        <div className="h-[140px]" />
      </div>

      <PrimaryCTA label={copy.planDetail.primaryCTA} onClick={onSubscribe} />
    </ScreenFrame>
  );
}
