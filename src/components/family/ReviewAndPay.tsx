import { useState } from "react";
import {
  ScreenFrame,
  ScreenHeader,
  PrimaryCTA,
  Aed,
  CheckMark,
  LockIcon,
} from "./shared";
import { copy } from "../../lib/copy";
import type { Plan, Signals } from "../../lib/familyState";
import { totalPrice } from "../../lib/familyState";
import applePayLogo from "../../assets/apple-pay.svg";

export default function ReviewAndPay({
  onBack,
  onPay,
  plan,
  signals,
}: {
  onBack: () => void;
  onPay: () => void;
  plan: Plan;
  signals: Signals;
}) {
  const [scrolled, setScrolled] = useState(false);
  const isAtomicMigration = signals.dualSubscription || signals.deviceOverlap;

  const planTitle =
    plan === "family"
      ? "noon One Family"
      : plan === "duo"
        ? "noon One Duo"
        : "noon One";

  const refundAmount = isAtomicMigration ? 18.43 : 0;
  const total = totalPrice(plan);

  return (
    <ScreenFrame background="white">
      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        <ScreenHeader title={copy.reviewAndPay.title} onBack={onBack} scrolled={scrolled} />

        {/* Plan summary */}
        <div className="mx-[16px] mt-[8px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px]">
          <p className="text-[#666d85] text-[12px] uppercase tracking-wider font-semibold">
            Plan
          </p>
          <p className="font-bold text-[#0e0e0e] text-[18px] mt-[4px]">
            {planTitle}
          </p>
          <p className="text-[#475067] text-[12px] mt-[2px]">
            15 days free trial. Renews monthly.
          </p>
        </div>

        {/* Atomic migration block — only when relevant signals are on */}
        {isAtomicMigration && (
          <div className="mx-[16px] mt-[12px] bg-[#fff7ea] border border-[#ffe7c2] rounded-[16px] p-[16px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#a86b00] mb-[8px]">
              Switching from your existing plan
            </p>
            <div className="flex items-start gap-[10px] mb-[10px]">
              <CheckMark className="size-[14px] shrink-0 mt-[2px]" color="#a86b00" />
              <p className="text-[#0e0e0e] text-[12px] leading-[16px]">
                Your existing One Monthly plan will be cancelled automatically.
              </p>
            </div>
            <div className="flex items-start gap-[10px]">
              <CheckMark className="size-[14px] shrink-0 mt-[2px]" color="#a86b00" />
              <p className="text-[#0e0e0e] text-[12px] leading-[16px]">
                A pro-rated refund of <Aed className="text-[10px]" />
                {refundAmount.toFixed(2)} will be credited to your noon credits within 24h.
              </p>
            </div>
          </div>
        )}

        {/* Payment method */}
        <div className="mx-[16px] mt-[12px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px]">
          <p className="text-[#666d85] text-[12px] uppercase tracking-wider font-semibold mb-[10px]">
            Payment Method
          </p>
          <div className="flex items-center gap-[12px]">
            <div className="size-[32px] flex items-center justify-center shrink-0">
              <img src={applePayLogo} alt="Apple Pay" className="block h-[22px] w-auto" />
            </div>
            <p className="font-bold text-[#1d2539] text-[15px] flex-1">
              Apple Pay
            </p>
            <button className="text-[#108757] text-[12px] font-semibold cursor-pointer">
              Change
            </button>
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="mx-[16px] mt-[12px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px]">
          <Row label="Subtotal" value={total.toFixed(2)} />
          {isAtomicMigration && (
            <Row label="Refund credit" value={`−${refundAmount.toFixed(2)}`} green />
          )}
          <div className="border-t border-dashed border-[#eaecf0] my-[10px]" />
          <Row
            label="Total today"
            value={(total - refundAmount).toFixed(2)}
            bold
          />
          <p className="text-[#666d85] text-[11px] mt-[6px]">
            <Aed className="text-[9px] text-[#666d85]" />
            0 charged today (15-day free trial). Renews at <Aed className="text-[9px] text-[#666d85]" />
            {(total - refundAmount).toFixed(2)} on day 16.
          </p>
        </div>

        {/* Trust line */}
        <div className="mx-[16px] mt-[12px] flex items-center gap-[8px]">
          <LockIcon className="size-[14px]" />
          <p className="text-[#666d85] text-[11px] leading-[15px] flex-1">
            Cancel anytime before your trial ends. No hidden fees.
          </p>
        </div>

        <div className="h-[140px]" />
      </div>

      <PrimaryCTA
        label={isAtomicMigration ? copy.reviewAndPay.atomicMigrationCTA : copy.reviewAndPay.standardCTA}
        onClick={onPay}
      />
    </ScreenFrame>
  );
}

function Row({
  label,
  value,
  green,
  bold,
}: {
  label: string;
  value: string;
  green?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-[2px]">
      <p
        className={`text-[13px] ${
          bold ? "font-bold text-[#0e0e0e]" : "text-[#475067]"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-[14px] ${
          bold ? "font-bold text-[#0e0e0e]" : ""
        } ${green ? "text-[#108757] font-semibold" : "text-[#0e0e0e]"}`}
      >
        <Aed className="text-[11px]" />
        {value}
      </p>
    </div>
  );
}
