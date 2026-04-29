import { useState } from "react";
import {
  ScreenFrame,
  ScreenHeader,
  AvatarCircle,
  RightChevron,
  Aed,
} from "./shared";
import { copy } from "../../lib/copy";
import type { FamilyState } from "../../lib/familyState";
import { seatCount } from "../../lib/familyState";

export default function ManageMembersScreen({
  state,
  onBack,
  onShareInvite,
}: {
  state: FamilyState;
  onBack: () => void;
  onShareInvite: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const seats = seatCount(state.plan);
  const filled = state.members.length + 1;
  const remaining = Math.max(0, seats - filled);

  return (
    <ScreenFrame background="white">
      <div
        className="relative h-full overflow-y-auto"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        <ScreenHeader title={copy.manageMembers.title} onBack={onBack} scrolled={scrolled} />

        {/* Header summary */}
        <div className="px-[16px] pt-[8px] pb-[14px]">
          <p className="text-[#666d85] text-[12px]">
            {filled} of {seats} seats filled
          </p>
          <p className="font-bold text-[#0e0e0e] text-[20px] mt-[4px]">
            {copy.manageMembers.privacyLine}
          </p>
        </div>

        {/* Owner row */}
        <MemberRow
          letter="R"
          name="You"
          subtitle="Plan owner — billing"
          tag="Owner"
          tagBg="#108757"
        />

        {/* Filled member rows */}
        {state.members.map((m, i) => (
          <MemberRow
            key={i}
            letter={m.initial}
            name={m.name}
            subtitle={`Joined ${m.joinedAt}`}
            removable
          />
        ))}

        {/* Empty seats */}
        {Array.from({ length: remaining }).map((_, i) => (
          <button
            key={`empty-${i}`}
            type="button"
            onClick={onShareInvite}
            className="w-full flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#f3f3f5] cursor-pointer text-left"
          >
            <div className="size-[44px] rounded-full border-[1.5px] border-dashed border-[#d0d5dd] flex items-center justify-center text-[#666d85] text-[20px] shrink-0">
              +
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#108757] text-[14px]">
                Invite a member
              </p>
              <p className="text-[#666d85] text-[11px]">
                Empty seat — invite someone to fill it
              </p>
            </div>
            <RightChevron className="size-[14px]" />
          </button>
        ))}

        {/* Empty-seat nudge banner */}
        {remaining > 0 && (
          <div className="mx-[16px] mt-[18px] bg-[#fff7ea] border border-[#ffe7c2] rounded-[12px] p-[14px]">
            <p className="text-[#5a3a00] text-[12px] leading-[16px] font-semibold">
              {copy.manageMembers.emptySeatNudge(remaining)}
            </p>
          </div>
        )}

        {/* Cooldown explainer */}
        <div className="mx-[16px] mt-[14px] bg-[#fafafa] border border-[#eaecf0] rounded-[12px] p-[14px]">
          <p className="font-bold text-[#0e0e0e] text-[12px] mb-[4px]">
            About the 30-day cooldown
          </p>
          <p className="text-[#475067] text-[11px] leading-[15px]">
            {copy.manageMembers.cooldownExplainer}
          </p>
        </div>

        {/* Plural savings panel */}
        <div className="mx-[16px] mt-[14px] bg-white border border-[#eaecf0] rounded-[14px] p-[14px]">
          <p className="text-[#666d85] text-[11px]">
            Your household saved this month
          </p>
          <p className="font-bold text-[#108757] text-[24px] mt-[2px]">
            <Aed className="text-[16px] text-[#108757]" />
            340.21
          </p>
          <p className="text-[#666d85] text-[10px] mt-[1px]">
            Across {filled} members on free deliveries and member-only deals
          </p>
        </div>

        <div className="h-[40px]" />
      </div>
    </ScreenFrame>
  );
}

function MemberRow({
  letter,
  name,
  subtitle,
  tag,
  tagBg,
  removable,
}: {
  letter: string;
  name: string;
  subtitle: string;
  tag?: string;
  tagBg?: string;
  removable?: boolean;
}) {
  return (
    <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#f3f3f5]">
      <AvatarCircle letter={letter} background={tag ? "#108757" : "#0e0e0e"} size={44} />
      <div className="flex-1">
        <div className="flex items-center gap-[8px]">
          <p className="font-bold text-[#0e0e0e] text-[14px]">{name}</p>
          {tag && (
            <span
              className="text-white text-[10px] font-bold px-[8px] py-[2px] rounded-full uppercase tracking-wider"
              style={{ background: tagBg }}
            >
              {tag}
            </span>
          )}
        </div>
        <p className="text-[#666d85] text-[11px] mt-[2px]">{subtitle}</p>
      </div>
      {removable && (
        <button
          type="button"
          className="text-[#dc2626] text-[12px] font-semibold cursor-pointer"
        >
          Remove
        </button>
      )}
    </div>
  );
}
