import { useState } from "react";
import StatusBar from "./StatusBar";
import SmoothCorners from "./SmoothCorners";
import applePayLogo from "../assets/apple-pay.svg";

/* ---------- Inline icons (kept local so this screen has no extra assets) ---------- */

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

function RightChevron({ className = "" }: { className?: string }) {
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

function CheckMark({ className = "" }: { className?: string }) {
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
        stroke="#108757"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossX({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
        stroke="#1d2539"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Apple Pay payment badge — Font Awesome 6 brands Apple Pay glyph (black,
 * viewBox 640×512) centred inside a 32×32 container, image height 28px so
 * it fills the box visually without crowding the edges.
 */
function ApplePayBadge() {
  return (
    <div className="size-[32px] flex items-center justify-center shrink-0">
      <img
        src={applePayLogo}
        alt="Apple Pay"
        // FA Apple Pay viewBox is 640×512 (≈ 1.25:1). h-[22px] gives natural
        // width ≈ 27.5px, fits comfortably inside the 32×32 container with
        // breathing room and no horizontal squashing.
        className="block h-[22px] w-auto max-w-none"
      />
    </div>
  );
}

/* ---------- Sub-cards ---------- */

export type PlanState = "monthly" | "bundle" | "annual";

const PLAN_INFO: Record<
  PlanState,
  {
    name: string;
    benefits: string[];
    price: string;
    /** When set, the right-side tag reads "Free trial for N days" instead of "Active". */
    trialDays?: number;
  }
> = {
  monthly: {
    name: "One Monthly",
    price: "24.99",
    benefits: [
      "Unlimited free delivery",
      "Get 10% cashback, 1st of every month",
    ],
  },
  bundle: {
    name: "One & OSN+ Monthly",
    price: "24.99",
    trialDays: 14,
    benefits: [
      "Unlimited free delivery",
      "Watch HBO, OSN+ originals on demand.",
    ],
  },
  annual: {
    name: "One Annual",
    price: "11.99",
    trialDays: 14,
    benefits: [
      "Unlimited free delivery",
      "Get 10% off, 1st of every month",
    ],
  },
};

function CurrentPlanBlock({
  planId,
  isUpgraded,
  onChangePlan,
}: {
  planId: PlanState;
  isUpgraded?: boolean;
  onChangePlan?: () => void;
}) {
  const plan = PLAN_INFO[planId];
  const leftTagLabel = isUpgraded ? "Upgraded plan" : "Current plan";
  const rightTag = plan.trialDays
    ? `Free trial for ${plan.trialDays} days`
    : "Active";

  return (
    <SmoothCorners
      radius={16}
      className="bg-[#f9f9fb] border-[1.5px] border-[#eaecf0] rounded-[16px] w-[343px] flex flex-col gap-[14px] pb-[16px]"
    >
      {/* Inner white card */}
      <SmoothCorners
        radius={16}
        className="bg-white rounded-[16px] flex flex-col gap-[6px] items-start pb-[16px] px-[16px] relative w-full"
      >
        {/* Left tag — "Current plan" or "Upgraded plan" depending on state */}
        <div className="bg-[#108757] flex h-[24px] items-center justify-center px-[12px] py-[4px] rounded-bl-[12px] rounded-br-[12px] shrink-0">
          <p className="font-noontree font-semibold text-white text-[12px] leading-none whitespace-nowrap shrink-0">
            {leftTagLabel}
          </p>
        </div>

        {/* Right-aligned tag — "Active" or "Free trial for N days" */}
        <div className="absolute right-0 top-[25.5px] bg-[#f7fffc] border border-[#e7f6f0] flex items-center px-[12px] py-[4px] rounded-bl-[12px] rounded-tl-[12px]">
          <p className="font-noontree font-semibold text-[12px] leading-[14px] tracking-[-0.12px] whitespace-nowrap">
            {plan.trialDays ? (
              <>
                <span className="text-[#108757]">Free trial </span>
                <span className="text-[#475067]">
                  for {plan.trialDays} days
                </span>
              </>
            ) : (
              <span className="text-[#108757]">{rightTag}</span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-[14px] w-full">
          <p className="flex-1 font-bold leading-[20px] text-[#1d2539] text-[16px] tracking-[-0.16px]">
            {plan.name}
          </p>

          <div className="h-px w-full border-t border-dashed border-[#eaecf0]" />

          <div className="flex flex-col gap-[10px]">
            {plan.benefits.map((b, i) => (
              <div key={i} className="flex gap-[10px] items-center">
                <CheckMark className="size-[16px] shrink-0" />
                <p className="font-noontree font-medium text-[#475067] text-[12px] leading-[14px] tracking-[-0.12px]">
                  {b}
                </p>
              </div>
            ))}
          </div>

          <div className="h-px w-full border-t border-dashed border-[#eaecf0]" />

          <p className="font-noontree font-semibold text-[#666d85] text-[12px] leading-[14px] tracking-[-0.12px]">
            Auto renews on xx-xx-xx at AED {plan.price}
          </p>
        </div>
      </SmoothCorners>

      {/* Change Plan row */}
      <button
        type="button"
        onClick={onChangePlan}
        className="flex items-center justify-between px-[16px] w-full cursor-pointer"
      >
        <p className="font-noontree font-medium text-[#101628] text-[14px] leading-[15px] tracking-[-0.12px]">
          Change Plan
        </p>
        <RightChevron className="size-[14px]" />
      </button>
    </SmoothCorners>
  );
}

function PaymentMethodBlock({ onChangeMethod }: { onChangeMethod?: () => void }) {
  return (
    <SmoothCorners
      radius={16}
      className="bg-[#f9f9fb] border-[1.5px] border-[#eaecf0] rounded-[16px] w-[343px] flex flex-col gap-[14px] pb-[16px]"
    >
      <SmoothCorners
        radius={16}
        className="bg-white rounded-[16px] p-[16px] w-full"
      >
        <div className="flex flex-col gap-[6px]">
          <p className="font-noontree text-[#475067] text-[12px] leading-[14px] tracking-[-0.12px]">
            Payment Method
          </p>
          <div className="flex gap-[10px] items-center">
            <ApplePayBadge />
            <p className="font-bold text-[#1d2539] text-[16px] leading-[20px] tracking-[-0.16px]">
              Apple Pay
            </p>
          </div>
        </div>
      </SmoothCorners>

      <button
        type="button"
        onClick={onChangeMethod}
        className="flex items-center justify-between px-[16px] w-full cursor-pointer"
      >
        <p className="font-noontree font-medium text-[#343d54] text-[14px] leading-[15px] tracking-[-0.12px]">
          Change payment method
        </p>
        <RightChevron className="size-[14px]" />
      </button>
    </SmoothCorners>
  );
}

function CancelMembershipBlock({ onCancel }: { onCancel?: () => void }) {
  return (
    <SmoothCorners
      as="button"
      radius={16}
      onClick={onCancel}
      className="bg-white border border-[#f5f5f5] rounded-[16px] w-[343px] flex items-start gap-[8px] p-[12px] text-left cursor-pointer"
    >
      <div className="flex items-center justify-center size-[20px] shrink-0 mt-[1px]">
        <CrossX className="size-[14px]" />
      </div>
      <div className="flex flex-col gap-[4px] flex-1">
        <p className="font-noontree font-semibold text-[#343d54] text-[14px] leading-[18px] tracking-[-0.14px]">
          Cancel membership
        </p>
        <p className="font-noontree font-medium text-[#666d85] text-[12px] leading-[14px] tracking-[-0.12px]">
          We will notify you 2 days before your trial ends
        </p>
      </div>
      <RightChevron className="size-[14px] mt-[4px]" />
    </SmoothCorners>
  );
}

/* ---------- Screen ---------- */

export default function ManageMembership({
  onBack,
  onChangePlan,
  onCancelMembership,
  onChangePaymentMethod,
  planId = "monthly",
  isUpgraded = false,
}: {
  onBack: () => void;
  onChangePlan?: () => void;
  onCancelMembership?: () => void;
  onChangePaymentMethod?: () => void;
  planId?: PlanState;
  isUpgraded?: boolean;
}) {
  // When the user scrolls past the header band, fill it with the page colour
  // and add a subtle separator line so it visually anchors above content.
  const [scrolled, setScrolled] = useState(false);

  return (
    <div
      className="relative w-[375px] h-[812px] mx-auto overflow-hidden rounded-[20px]"
      style={{
        backgroundImage: "linear-gradient(180deg, #ffffff 31%, #f3f3f5 100%)",
      }}
    >
      {/* Status bar floats above everything (incl. the sticky header) so the
          system clock + signal icons remain visible at all times. */}
      <StatusBar />

      {/*
        Scroll container. `relative` (not absolute) per Retune visual change.
        h-full so it still fills the iPhone frame; overflow-y-auto enables
        sticky positioning of the header within this scroll context.
      */}
      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        <div className="w-full pb-[26px]">
          {/* Sticky header — sits below the status bar, transparent at rest,
              fills with the page colour + bottom hairline once content
              starts scrolling under it. */}
          <div
            className={`sticky top-0 z-10 flex items-center gap-[8px] px-[18px] pt-[52px] pb-[12px] w-full transition-[background-color,border-color] duration-150 border-b ${
              scrolled
                ? "bg-white border-[#eaecf0]"
                : "bg-transparent border-transparent"
            }`}
          >
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="bg-white border border-[#f2f3f7] flex items-center justify-center p-[8px] rounded-[18px] cursor-pointer shrink-0"
            >
              <BackChevron className="size-[20px]" />
            </button>
            <p className="flex-1 font-bold text-[#0e0e0e] text-[16px] leading-[20px] tracking-[-0.16px]">
              Manage Membership
            </p>
          </div>

          {/* Cards stack — tightened from mt-[42px] to mt-[16px] so the gap
              under the header isn't gaping. */}
          <div className="flex flex-col items-center gap-[24px] mt-[16px]">
            <CurrentPlanBlock
              planId={planId}
              isUpgraded={isUpgraded}
              onChangePlan={onChangePlan}
            />
            <PaymentMethodBlock onChangeMethod={onChangePaymentMethod} />
            <CancelMembershipBlock onCancel={onCancelMembership} />
          </div>
        </div>
      </div>

      {/* iPhone home indicator */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center py-[14px] pointer-events-none">
        <div className="bg-[#404553] h-[5px] rounded-[8px] w-[124px]" />
      </div>
    </div>
  );
}
