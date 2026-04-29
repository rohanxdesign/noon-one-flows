import { useState } from "react";
import {
  ScreenFrame,
  ScreenHeader,
  PrimaryCTA,
  CheckMark,
  Aed,
} from "./shared";
import { copy } from "../../lib/copy";
import type { Plan } from "../../lib/familyState";

type Cycle = "monthly" | "yearly";

export default function ChoosePlan({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: (plan: Plan) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [selected, setSelected] = useState<Plan>("family");

  return (
    <ScreenFrame background="white">
      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        <ScreenHeader title={copy.choosePlan.title} onBack={onBack} scrolled={scrolled} />

        {/* Monthly / Yearly toggle */}
        <div className="flex justify-center mt-[12px]">
          <div className="bg-[#f3f3f5] rounded-full p-[3px] flex">
            <button
              type="button"
              onClick={() => setCycle("monthly")}
              className={`px-[20px] h-[36px] rounded-full font-semibold text-[13px] transition-colors ${
                cycle === "monthly"
                  ? "bg-white text-[#0e0e0e] shadow-sm"
                  : "text-[#666d85]"
              }`}
            >
              {copy.choosePlan.monthlyTab}
            </button>
            <button
              type="button"
              onClick={() => setCycle("yearly")}
              className={`px-[20px] h-[36px] rounded-full font-semibold text-[13px] flex items-center gap-[6px] transition-colors ${
                cycle === "yearly"
                  ? "bg-white text-[#0e0e0e] shadow-sm"
                  : "text-[#666d85]"
              }`}
            >
              {copy.choosePlan.yearlyTab}
              <span className="bg-[#3870ff] text-white text-[10px] font-bold px-[6px] py-[1px] rounded-full">
                {copy.choosePlan.yearlyBadge}
              </span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="flex flex-col items-center gap-[12px] mt-[16px] px-[16px] pb-[140px]">
          <PlanCard
            id="one"
            name="noon One"
            price={cycle === "yearly" ? "11.99" : "24.99"}
            perSeat={null}
            seatLine="1 person"
            benefits={["Unlimited free delivery"]}
            selected={selected === "one"}
            onSelect={() => setSelected("one")}
            cycle={cycle}
          />
          <PlanCard
            id="duo"
            name="noon One Duo"
            price={cycle === "yearly" ? "14.99" : "30.00"}
            perSeat="15"
            seatLine="2 people"
            benefits={["Unlimited free delivery", "2 seats — give one to a loved one"]}
            highlight={false}
            selected={selected === "duo"}
            onSelect={() => setSelected("duo")}
            cycle={cycle}
          />
          <PlanCard
            id="family"
            name="noon One Family"
            price={cycle === "yearly" ? "24.99" : "50.00"}
            perSeat="10"
            seatLine="Up to 5 people"
            benefits={[
              "Unlimited free delivery for everyone",
              "5 seats — separate accounts, shared benefits",
              "Best value per seat",
            ]}
            highlight
            selected={selected === "family"}
            onSelect={() => setSelected("family")}
            cycle={cycle}
          />
        </div>

        <div className="absolute bottom-[88px] left-0 right-0 px-[24px]">
          <p className="text-[#666d85] text-[11px] leading-[15px] text-center">
            {copy.choosePlan.bottomReassurance}
          </p>
        </div>
      </div>

      <PrimaryCTA
        label={copy.choosePlan.primaryCTA}
        onClick={() => onContinue(selected)}
      />
    </ScreenFrame>
  );
}

function PlanCard({
  id,
  name,
  price,
  perSeat,
  seatLine,
  benefits,
  selected,
  onSelect,
  highlight,
  cycle,
}: {
  id: Plan;
  name: string;
  price: string;
  perSeat: string | null;
  seatLine: string;
  benefits: string[];
  selected: boolean;
  onSelect: () => void;
  highlight?: boolean;
  cycle: Cycle;
}) {
  const borderClass = selected
    ? highlight
      ? "border-[#108757] ring-1 ring-[#108757]"
      : "border-[#108757]"
    : "border-[#eaecf0]";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full bg-white border-[1.5px] ${borderClass} rounded-[16px] p-[16px] text-left transition-all cursor-pointer`}
    >
      {highlight && (
        <div className="absolute -top-[10px] left-[16px] bg-[#108757] text-white text-[10px] font-bold px-[10px] py-[3px] rounded-full uppercase tracking-wider">
          Most popular
        </div>
      )}
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex-1">
          <p className="font-bold text-[#0e0e0e] text-[16px] leading-[20px]">
            {name}
          </p>
          <p className="text-[#666d85] text-[12px] mt-[2px]">{seatLine}</p>
        </div>
        <Radio selected={selected} />
      </div>

      <div className="flex items-baseline gap-[6px] mt-[10px]">
        {perSeat ? (
          <>
            <p className="font-bold text-[#0e0e0e] text-[26px] leading-none">
              <Aed className="text-[18px]" />
              {perSeat}
            </p>
            <p className="text-[#666d85] text-[12px]">/seat/mo</p>
            <p className="text-[#666d85] text-[12px] ml-auto">
              <Aed className="text-[10px]" />
              {price} {cycle === "monthly" ? "/month" : "/year"}
            </p>
          </>
        ) : (
          <>
            <p className="font-bold text-[#0e0e0e] text-[26px] leading-none">
              <Aed className="text-[18px]" />
              {price}
            </p>
            <p className="text-[#666d85] text-[12px]">
              {cycle === "monthly" ? "/month" : "/year"}
            </p>
          </>
        )}
      </div>

      <div className="mt-[12px] flex flex-col gap-[6px]">
        {benefits.map((b, i) => (
          <div key={i} className="flex items-center gap-[8px]">
            <CheckMark className="size-[14px]" />
            <p className="text-[#475067] text-[12px] leading-[15px]">{b}</p>
          </div>
        ))}
      </div>

      {/* Used by tests / debugging */}
      <span data-plan-id={id} className="hidden" />
    </button>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return selected ? (
    <div className="size-[20px] rounded-full bg-[#108757] flex items-center justify-center shrink-0 mt-[1px]">
      <div className="size-[8px] rounded-full bg-white" />
    </div>
  ) : (
    <div className="size-[20px] rounded-full border-[1.5px] border-[#d0d5dd] shrink-0 mt-[1px]" />
  );
}
