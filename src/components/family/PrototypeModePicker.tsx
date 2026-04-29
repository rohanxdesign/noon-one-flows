import { useState } from "react";
import type { Plan, POV, Signals } from "../../lib/familyState";

/**
 * Dev-only floating panel — sibling to Retune. Lets the prototype walker flip
 * POV / Plan / Signals to preview how the unified flow modulates emphasis.
 *
 * Renders only when `import.meta.env.DEV` is true (handled at the App.tsx
 * mount point), and is collapsible to stay out of the way during walkthrough.
 */
export default function PrototypeModePicker({
  pov,
  plan,
  signals,
  onPovChange,
  onPlanChange,
  onSignalsChange,
  onJumpTo,
}: {
  pov: POV;
  plan: Plan;
  signals: Signals;
  onPovChange: (pov: POV) => void;
  onPlanChange: (plan: Plan) => void;
  onSignalsChange: (signals: Signals) => void;
  onJumpTo: (screen: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-[9999] font-[Figtree,system-ui,sans-serif]">
      {open ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-[#eaecf0] w-[280px] p-4 max-h-[88vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-[#0e0e0e] text-[13px]">
              Prototype mode
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#666d85] text-[18px] cursor-pointer"
            >
              ×
            </button>
          </div>

          <Section label="POV">
            <Pills
              options={[
                { id: "owner", label: "Owner" },
                { id: "member", label: "Member" },
                { id: "nonSubscriber", label: "Non-sub" },
              ]}
              value={pov}
              onChange={(v) => onPovChange(v as POV)}
            />
          </Section>

          <Section label="Plan">
            <Pills
              options={[
                { id: "one", label: "One" },
                { id: "duo", label: "Duo" },
                { id: "family", label: "Family" },
              ]}
              value={plan}
              onChange={(v) => onPlanChange(v as Plan)}
            />
          </Section>

          <Section label="Signals (independent, additive)">
            <div className="flex flex-col gap-1">
              {(
                [
                  ["household", "Household (Wi-Fi cluster)"],
                  ["deviceOverlap", "Device overlap (3+ devices)"],
                  ["dualSubscription", "Dual subscription"],
                  ["churned", "Churned subscriber"],
                  ["hesitation", "Hesitation"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-[12px] text-[#0e0e0e] cursor-pointer py-1"
                >
                  <input
                    type="checkbox"
                    checked={signals[key]}
                    onChange={(e) =>
                      onSignalsChange({ ...signals, [key]: e.target.checked })
                    }
                    className="size-[14px] accent-[#108757]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </Section>

          <Section label="Jump to screen">
            <div className="grid grid-cols-2 gap-1">
              {[
                "landing",
                "choosePlan",
                "planDetail",
                "reviewAndPay",
                "successInvite",
                "subscribedHome",
                "manageMembers",
                "shareInvite",
                "inviteLanding",
                "joiningTransition",
                "joinSuccess",
                "memberHome",
                "leaveConfirmation",
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onJumpTo(s)}
                  className="text-[10px] text-[#475067] bg-[#f3f3f5] rounded px-2 py-1 cursor-pointer hover:bg-[#eaecf0] text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>

          <p className="text-[10px] text-[#666d85] mt-3">
            Default = no signals = canonical flow.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-[#0e0e0e] text-white text-[11px] font-semibold px-3 py-2 rounded-full shadow-lg cursor-pointer"
        >
          ⚙ Mode
        </button>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#666d85] mb-1">
        {label}
      </p>
      {children}
    </div>
  );
}

function Pills({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`text-[11px] px-3 py-1 rounded-full cursor-pointer ${
            value === o.id
              ? "bg-[#108757] text-white font-semibold"
              : "bg-[#f3f3f5] text-[#0e0e0e]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
