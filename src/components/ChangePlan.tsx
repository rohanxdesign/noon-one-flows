import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StatusBar from "./StatusBar";
import SmoothCorners from "./SmoothCorners";
import ReviewAndConfirmSheet, {
  type ConfirmPlanId,
} from "./ReviewAndConfirmSheet";

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

function CheckMark({
  className = "",
  color = "#108757",
}: {
  className?: string;
  color?: string;
}) {
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
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Empty/filled radio circle on the right side of selectable plan cards. */
function RadioCircle({ selected }: { selected: boolean }) {
  return selected ? (
    <div className="size-[20px] rounded-full bg-[#108757] flex items-center justify-center shrink-0">
      <div className="size-[8px] rounded-full bg-white" />
    </div>
  ) : (
    <div className="size-[20px] rounded-full border-[1.5px] border-[#d0d5dd] shrink-0" />
  );
}

/** Dirham (AED) mark from the Noontree font (PUA glyph U+E001). */
/** Noontree's PUA glyph U+E001 — the noon dirham (AED) wordmark. */
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

/* ---------- Plan card ---------- */

type Plan = {
  id: string;
  name: string;
  price: string; // e.g. "24.99"
  /** "Current plan" green tag — only on the user's active plan */
  isCurrent?: boolean;
  /** Strikethrough or extra info under the price (e.g. "143.88 billed yearly", "24.99 + 39.99") */
  pricingDetail?: React.ReactNode;
  /** Small green pill next to the pricing detail (e.g. "Save 156", "2 for 1 subscription") */
  badge?: React.ReactNode;
  benefits: React.ReactNode[];
  /**
   * Optional alternate benefits shown only when the card is selected. Used by
   * the OSN+ Bundle plan, whose first benefit shifts from "Free for 15 days"
   * to a more explicit "Get additional free 15 day trial" once chosen.
   */
  selectedBenefits?: React.ReactNode[];
};

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}) {
  // Active card: green border + filled radio. Inactive: subtle gray border.
  const borderClass = selected ? "border-[#108757]" : "border-[#f5f5f5]";
  // Swap first benefit when this plan exposes a `selectedBenefits` variant
  // and the card is currently selected.
  const benefits =
    selected && plan.selectedBenefits ? plan.selectedBenefits : plan.benefits;

  // The card uses SmoothCorners (clip-path squircle), which crops box-shadow.
  // To project the active-state halo *outside* the squircle, we wrap the card
  // in a non-clipped div whose own `rounded-[16px]` shape projects the green
  // ring. The squircle vs circular-arc difference at 16px is imperceptible at
  // 8% alpha, so the halo visually traces the card.
  const wrapperClass = `rounded-[16px] w-full self-stretch transition-shadow duration-150 ${
    selected ? "shadow-[0_0_0_4px_rgba(16,135,87,0.08)]" : ""
  }`;

  return (
    <div className={wrapperClass}>
    <SmoothCorners
      as="button"
      radius={16}
      onClick={onSelect}
      className={`bg-white border-[1.5px] ${borderClass} rounded-[16px] w-full flex flex-col gap-[8px] px-[16px] pt-[16px] pb-[16px] text-left cursor-pointer relative transition-colors duration-150`}
    >
      {/* Top row: name + radio (or empty space for current plan) */}
      <div
        className={`flex items-center justify-between w-full ${plan.isCurrent ? "mt-[24px]" : ""}`}
      >
        <p className="font-bold leading-[20px] text-[#1d2539] text-[16px] tracking-[-0.16px]">
          {plan.name}
        </p>
        {!plan.isCurrent && <RadioCircle selected={selected} />}
      </div>

      {/* "Current plan" green tag — aligned with the inner content's left
          edge (16px) so it sits in the same column as the title and benefits
          below, rather than flush to the card edge. */}
      {plan.isCurrent && (
        <div className="absolute left-[16px] top-0 bg-[#108757] flex h-[24px] items-center justify-center px-[12px] py-[4px] rounded-bl-[12px] rounded-br-[12px] shrink-0">
          <p className="font-noontree font-semibold text-white text-[12px] leading-none whitespace-nowrap shrink-0">
            Current plan
          </p>
        </div>
      )}

      {/* Price line — leading dhm symbol (Aed) instead of calendar icon */}
      <div className="flex items-baseline gap-[4px]">
        <Aed className="text-[16px] text-[#1d2539]" />
        <p className="font-noontree font-semibold text-[#1d2539] text-[14px] leading-[18px] tracking-[-0.14px]">
          {plan.price}/month
        </p>
      </div>

      {/* Optional pricing detail + badge row */}
      {(plan.pricingDetail || plan.badge) && (
        <div className="flex items-center gap-[8px] flex-wrap">
          {plan.pricingDetail && (
            <p className="font-noontree text-[#666d85] text-[12px] leading-[14px] tracking-[-0.12px]">
              {plan.pricingDetail}
            </p>
          )}
          {plan.badge && (
            <span className="bg-[#e7f6f0] text-[#108757] font-noontree font-semibold text-[12px] leading-none px-[8px] py-[4px] rounded-[6px] whitespace-nowrap">
              {plan.badge}
            </span>
          )}
        </div>
      )}

      {/* Dashed separator */}
      <div className="h-px w-full border-t border-dashed border-[#eaecf0]" />

      {/* Benefits list */}
      <div className="flex flex-col gap-[10px]">
        {benefits.map((b, i) => (
          <div key={i} className="flex gap-[10px] items-center">
            <CheckMark className="size-[16px] shrink-0" color="#475067" />
            <p className="font-noontree font-medium text-[#475067] text-[12px] leading-[14px] tracking-[-0.12px]">
              {b}
            </p>
          </div>
        ))}
      </div>
    </SmoothCorners>
    </div>
  );
}

/* ---------- Screen ---------- */

const CURRENT_PLAN: Plan = {
  id: "monthly",
  name: "One Monthly",
  price: "24.99",
  isCurrent: true,
  benefits: ["Unlimited free delivery", "Get 10% off, 1st of every month"],
};

const OTHER_PLANS: Plan[] = [
  {
    id: "bundle",
    name: "One & OSN+ Bundle",
    price: "29.99",
    pricingDetail: (
      <>
        <Aed />
        <span className="line-through">24.99</span>
        {" + "}
        <Aed />
        <span className="line-through">39.99</span>
      </>
    ),
    badge: "2 for 1 subscription",
    benefits: [
      <>
        Free for{" "}
        <span className="text-[#108757] font-semibold">15 days</span>
      </>,
      "Unlimited free delivery",
      "Watch HBO, OSN+ originals on demand.",
    ],
    selectedBenefits: [
      <>
        Get additional{" "}
        <span className="text-[#108757] font-semibold">free 15 day trial</span>
      </>,
      "Unlimited free delivery",
      "Watch HBO, OSN+ originals on demand.",
    ],
  },
  {
    id: "annual",
    name: "One Annual",
    price: "11.99",
    pricingDetail: (
      <>
        <Aed />
        143.88 billed yearly
      </>
    ),
    badge: (
      <>
        Save <Aed />
        156
      </>
    ),
    benefits: ["Unlimited free delivery", "Get 10% off, 1st of every month"],
  },
];

export default function ChangePlan({
  onBack,
  onConfirmPlan,
}: {
  onBack: () => void;
  onConfirmPlan?: (newPlanId: ConfirmPlanId) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Only the bundle/annual plans have a confirmation sheet — the user can't
  // "change" to the plan they already have, so the sticky CTA is hidden when
  // selectedId is null or the current plan.
  const canConfirm = selectedId === "bundle" || selectedId === "annual";

  return (
    <div
      className="relative w-[375px] h-[812px] mx-auto overflow-hidden rounded-[20px]"
      style={{
        backgroundImage: "linear-gradient(180deg, #ffffff 31%, #f3f3f5 100%)",
      }}
    >
      <StatusBar />

      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        {/* Bottom padding accounts for the sticky CTA bar (≈ 96px) so the
            last card isn't hidden behind it when fully scrolled. */}
        <div className={`w-full ${canConfirm ? "pb-[110px]" : "pb-[20px]"}`}>
          {/* Sticky header */}
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
              Change Plan
            </p>
          </div>

          {/* Current plan card */}
          <div className="flex flex-col px-[16px] mt-[16px]">
            <PlanCard plan={CURRENT_PLAN} selected={false} onSelect={() => {}} />
          </div>

          {/* "Explore other plans" section */}
          <div className="px-[16px] mt-[24px] mb-[12px]">
            <p className="font-bold text-[#1d2539] text-[16px] leading-[20px] tracking-[-0.16px]">
              Explore other plans
            </p>
          </div>

          {/* Other plans */}
          <div className="flex flex-col px-[16px] gap-[16px]">
            {OTHER_PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedId === plan.id}
                onSelect={() => setSelectedId(plan.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA — slides up from below when a different plan is
          selected, slides back down when deselected. */}
      <AnimatePresence>
        {canConfirm && (
          <motion.div
            key="change-plan-cta"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320, mass: 0.9 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-[#eaecf0] rounded-tl-[12px] rounded-tr-[12px] px-[16px] pt-[12px] pb-[36px]"
          >
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="w-full bg-black text-white font-bold text-[14px] rounded-[12px] py-[18px] cursor-pointer"
            >
              Change my plan
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iPhone home indicator */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-center py-[14px] pointer-events-none">
        <div className="bg-[#404553] h-[5px] rounded-[8px] w-[124px]" />
      </div>

      {/* Confirmation bottom sheet */}
      {canConfirm && (
        <ReviewAndConfirmSheet
          planId={selectedId as ConfirmPlanId}
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onConfirm={() => {
            setSheetOpen(false);
            onConfirmPlan?.(selectedId as ConfirmPlanId);
          }}
        />
      )}
    </div>
  );
}
