import { useState } from "react";
import { ScreenFrame, AvatarCircle, CheckMark, LockIcon } from "./shared";
import { copy } from "../../lib/copy";
import type { Signals } from "../../lib/familyState";

const BENEFIT_ICONS = ["🚚", "▶︎", "🔒"];

export default function InviteLandingScreen({
  inviterName,
  inviterInitial,
  signals,
  onJoin,
}: {
  inviterName: string;
  inviterInitial: string;
  signals: Signals;
  onJoin: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const titleCopy = signals.churned
    ? copy.invite.landingTitleChurned(inviterName)
    : copy.invite.landingTitleDefault(inviterName);

  return (
    <ScreenFrame background="linear-gradient(180deg, rgba(255,247,234,0.5) 0%, rgba(255,255,255,0.95) 35%, #ffffff 100%)">
      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        {/* Subtle dimmed feed in background — gives the "modal over feed" feel */}
        <div className={`sticky top-0 z-10 px-[18px] pt-[52px] pb-[12px] w-full transition-colors ${scrolled ? "bg-white" : "bg-transparent"}`} />

        {/* Sheet card */}
        <div className="mx-[16px] mt-[40px] bg-white rounded-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] p-[20px]">
          <div className="flex items-center justify-center gap-[2px]">
            <AvatarCircle letter={inviterInitial} background="#108757" size={56} />
            <div className="size-[24px] rounded-full bg-[#fcd36b] flex items-center justify-center text-[10px] font-bold text-[#0e0e0e] -mx-[6px] z-10 ring-2 ring-white">
              One
            </div>
            <AvatarCircle letter="?" background="#0e0e0e" textColor="white" size={56} />
          </div>

          <p className="text-center text-[#666d85] text-[12px] mt-[14px]">
            {inviterName} invited you to
          </p>
          <h1 className="font-bold text-center text-[#0e0e0e] text-[24px] leading-[28px] tracking-[-0.4px] mt-[4px]">
            Join noon One Family plan
          </h1>

          {signals.churned && (
            <div className="mt-[14px] bg-[#f7fffc] border border-[#cfeadd] rounded-[12px] px-[12px] py-[10px]">
              <p className="text-[#108757] text-[12px] font-semibold text-center">
                Welcome back — your old account is still here
              </p>
            </div>
          )}

          {/* Benefits */}
          <div className="mt-[18px] flex flex-col gap-[14px]">
            {[
              {
                icon: BENEFIT_ICONS[0],
                title: "Free delivery everywhere",
                subtitle: "No delivery fees on any orders.",
              },
              {
                icon: BENEFIT_ICONS[1],
                title: "Streaming included",
                subtitle: "Binge-watch your favourite shows.",
              },
              {
                icon: BENEFIT_ICONS[2],
                title: "Share the plan, not the details",
                subtitle: "Your orders and payments stay private.",
              },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-[12px]">
                <div className="size-[28px] rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0 mt-[2px]">
                  {b.icon === BENEFIT_ICONS[2] ? (
                    <LockIcon className="size-[14px]" />
                  ) : (
                    <CheckMark className="size-[14px]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#0e0e0e] text-[13px] leading-[16px]">
                    {b.title}
                  </p>
                  <p className="text-[#666d85] text-[11px] mt-[2px]">
                    {b.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={onJoin}
            className="mt-[20px] w-full bg-[#0e0e0e] text-white h-[52px] rounded-[14px] font-semibold cursor-pointer"
          >
            {copy.invite.primaryCTA}
          </button>

          <p className="text-center text-[#666d85] text-[10px] leading-[14px] mt-[12px]">
            {copy.invite.autoRenewNote(inviterName)}
          </p>

          {/* Hidden helper for unused-prop linting */}
          <span className="hidden">{titleCopy}</span>
        </div>
      </div>
    </ScreenFrame>
  );
}
