import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import heroLogoLottie from "../../assets/lottie/hero-logo.lottie?url";
import {
  ScreenFrame,
  RightChevron,
  AvatarCircle,
  Aed,
  ShareIcon,
} from "./shared";
import type { FamilyState } from "../../lib/familyState";
import { seatCount } from "../../lib/familyState";

/**
 * Subscribed-user home for the unified flow. Replaces / extends the existing
 * SubscribedUser screen. When state.plan is "duo" or "family", shows the
 * "Your One members" card with seat dots + manage / invite CTAs.
 *
 * For the persistent "we know you're sharing" notch (Cohort B lens) we render
 * a small banner above the savings card when signals.deviceOverlap is true.
 */
export default function SubscribedHomeFamilyCard({
  state,
  onManageMembership,
  onManageMembers,
  onShareInvite,
}: {
  state: FamilyState;
  onManageMembership: () => void;
  onManageMembers: () => void;
  onShareInvite: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const seats = seatCount(state.plan);
  const filled = state.members.length + 1;
  const remaining = Math.max(0, seats - filled);
  const showFamilyCard = state.plan === "duo" || state.plan === "family";

  return (
    <ScreenFrame background="linear-gradient(180deg, #fff7ea 0%, #ffffff 30%, #ffffff 100%)">
      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between px-[18px] pt-[52px] pb-[12px] w-full transition-[background-color,border-color] duration-150 border-b ${
            scrolled
              ? "bg-white border-[#eaecf0]"
              : "bg-transparent border-transparent"
          }`}
        >
          <div className="size-[36px]" />
          <button
            type="button"
            onClick={onManageMembership}
            className="bg-white border border-[#f2f3f7] rounded-[18px] size-[36px] flex items-center justify-center cursor-pointer"
            aria-label="Settings"
          >
            <svg viewBox="0 0 16 16" className="size-[16px]" fill="none">
              <circle cx="8" cy="8" r="2" stroke="#0e0e0e" strokeWidth="1.4" />
              <path
                d="M8 1V3M8 13V15M15 8H13M3 8H1M12.95 3.05L11.5 4.5M4.5 11.5L3.05 12.95M12.95 12.95L11.5 11.5M4.5 4.5L3.05 3.05"
                stroke="#0e0e0e"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Hero with name */}
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
            Rahul Jaiswal
          </h1>
          <p className="text-[#666d85] text-[13px] mt-[2px]">
            One member since 5th Jan, 2026
          </p>
        </div>

        {/* Persistent "you're sharing" notch — Cohort B lens */}
        {state.signals.deviceOverlap && state.plan === "one" && (
          <div className="mx-[16px] mt-[18px] bg-[#fff8e1] border border-[#ffe082] rounded-[12px] px-[12px] py-[10px] flex items-center gap-[10px]">
            <div className="size-[8px] rounded-full bg-[#f59e0b] animate-pulse shrink-0" />
            <p className="text-[#5a3a00] text-[12px] font-semibold flex-1">
              Your account is on 4 devices — make it official with a Family plan
            </p>
            <RightChevron className="size-[14px]" />
          </div>
        )}

        {/* Current plan card */}
        <div className="mx-[16px] mt-[18px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px]">
          <p className="text-[#666d85] text-[12px]">Current plan</p>
          <p className="font-bold text-[#0e0e0e] text-[16px] mt-[4px]">
            {state.plan === "family"
              ? "noon One Family"
              : state.plan === "duo"
                ? "noon One Duo"
                : "noon One Monthly"}
          </p>
          <p className="text-[#666d85] text-[12px] mt-[6px]">
            Auto renews on xx-xx-xx at <Aed className="text-[10px] text-[#666d85]" />
            {state.plan === "family"
              ? "50.00"
              : state.plan === "duo"
                ? "30.00"
                : "24.99"}
          </p>
          <button
            type="button"
            onClick={onManageMembership}
            className="flex items-center justify-between w-full mt-[14px] pt-[14px] border-t border-dashed border-[#eaecf0] cursor-pointer"
          >
            <p className="text-[#0e0e0e] text-[14px] font-medium">
              Manage membership
            </p>
            <RightChevron className="size-[14px]" />
          </button>
        </div>

        {/* Family members card — Family / Duo plans only */}
        {showFamilyCard && (
          <div className="mx-[16px] mt-[14px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px]">
            <div className="flex items-center justify-between mb-[12px]">
              <div>
                <p className="font-bold text-[#0e0e0e] text-[14px]">
                  Your One members
                </p>
                <p className="text-[#666d85] text-[11px] mt-[1px]">
                  Orders and payments remain private.
                </p>
              </div>
              <button
                type="button"
                onClick={onManageMembers}
                className="bg-[#f3f3f5] text-[#0e0e0e] text-[12px] font-semibold px-[12px] py-[6px] rounded-full cursor-pointer"
              >
                Manage
              </button>
            </div>

            {/* Seat row */}
            <div className="flex items-center gap-[8px] mb-[14px]">
              <AvatarCircle letter="R" background="#108757" size={40} />
              {state.members.map((m, i) => (
                <AvatarCircle
                  key={i}
                  letter={m.initial}
                  background="#0e0e0e"
                  size={40}
                />
              ))}
              {Array.from({ length: remaining }).map((_, i) => (
                <button
                  key={`empty-${i}`}
                  type="button"
                  onClick={onShareInvite}
                  className="size-[40px] rounded-full border-[1.5px] border-dashed border-[#d0d5dd] flex items-center justify-center text-[#666d85] cursor-pointer"
                >
                  +
                </button>
              ))}
            </div>

            {/* Empty-seat nudge */}
            {remaining > 0 && (
              <p className="text-[#666d85] text-[11px] leading-[15px] mb-[12px]">
                {remaining} seat{remaining > 1 ? "s" : ""} waiting. Your
                household saves more when all {seats} are filled.
              </p>
            )}

            <button
              type="button"
              onClick={onShareInvite}
              className="w-full bg-[#0e0e0e] text-white h-[44px] rounded-[12px] font-semibold flex items-center justify-center gap-[8px] cursor-pointer"
            >
              <ShareIcon className="size-[14px]" />
              Share invite
            </button>
          </div>
        )}

        {/* Savings panel */}
        <div className="mx-[16px] mt-[14px] bg-white border border-[#eaecf0] rounded-[16px] p-[16px]">
          <p className="text-[#666d85] text-[12px]">
            With noon One {showFamilyCard ? "your household has" : "you have"} saved
          </p>
          <p className="font-bold text-[#0e0e0e] text-[34px] mt-[4px]">
            <Aed className="text-[24px]" />
            {showFamilyCard ? "340.21" : "124.34"}
          </p>
          <p className="text-[#108757] text-[12px] font-semibold mt-[2px]">
            That's {showFamilyCard ? "6x" : "3x"} of what you paid for!
          </p>
        </div>

        <div className="h-[40px]" />
      </div>
    </ScreenFrame>
  );
}
