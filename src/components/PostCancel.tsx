import { useEffect, useState } from "react";
import StatusBar from "./StatusBar";
import SmoothCorners from "./SmoothCorners";
import {
  SavingsCard,
  PromoStrip,
  OsnCard,
  ValuePropsCard,
  FaqCard,
} from "./SubscribedUser";
import ellipse3931 from "../assets/ellipse3931.svg";
import ellipse3930 from "../assets/ellipse3930.svg";
import lines from "../assets/lines.svg";
import ellipse2080 from "../assets/ellipse2080.svg";
import couponBg from "../assets/coupon-bg.svg";
import couponDivider from "../assets/coupon-divider.svg";
import timerOutline from "../assets/timer-outline.svg";
import oneLogoFrame from "../assets/one-logo-frame.svg";
import oneLogoGroup from "../assets/one-logo-group.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import heroLogoLottie from "../assets/lottie/hero-logo.lottie?url";

/* ---------- Shared Aed glyph ---------- */

// Noontree-ExtraBold.woff2 doesn't carry the PUA dirham glyph (U+E001), so we
// pin the Aed mark to weight 700 (Bold) regardless of the parent's font-weight.
function Aed({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="AED"
      className={`font-noontree font-bold tracking-[0] inline-block align-baseline mr-[2px] ${className}`}
    >
      {""}
    </span>
  );
}

/* ---------- Hero (mirrors SubscribedUser) ---------- */

function Hero() {
  return (
    <div className="h-[139.844px] relative shrink-0 w-[319px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[377px] left-1/2 top-[calc(50%-40.65px)] w-[665px] pointer-events-none">
        <DotLottieReact
          src={heroLogoLottie}
          autoplay
          loop={false}
          className="block w-full h-full"
        />
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-2.17px)] w-[190.577px] h-[190.577px] top-[calc(50%-29.64px)]">
        <img alt="" className="absolute block inset-0 w-full h-full" src={ellipse2080} />
      </div>
      <p className="-translate-x-1/2 absolute font-extrabold leading-[28px] left-[calc(50%+1px)] text-[28px] text-black text-center top-[77px] tracking-[-1px] w-[319px]">
        Rahul Jaiswal
      </p>
      <p className="-translate-x-1/2 absolute font-normal leading-[18px] left-[calc(50%+1px)] text-[14px] text-black/75 text-center top-[111.84px] tracking-[-0.3px] whitespace-nowrap">
        One member since 5th Jan, 2026
      </p>
    </div>
  );
}

/* ---------- Small noon "one" mark used on the coupon card ----------
   Built by stacking the two source assets (colour pill + black wordmark)
   at the natural ratios from Figma so they crisp-render at any size. */

function OneMark({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-block align-middle ${className}`}>
      <img alt="" src={oneLogoFrame} className="absolute inset-0 w-full h-full" />
      {/* Wordmark sits in a container at the wordmark's native ratio (68:21
          ≈ 3.24) so `preserveAspectRatio="none"` doesn't squash it. Width
          is 67% of the pill, centred horizontally; vertical centred too. */}
      <span
        className="absolute left-1/2 top-1/2"
        style={{
          width: "67%",
          aspectRatio: "68.12 / 21.38",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img alt="" src={oneLogoGroup} className="absolute inset-0 w-full h-full" />
      </span>
      <span className="sr-only">noon one</span>
    </span>
  );
}

/* ---------- Gift box illustration (decorates the coupon footer) ---------- */

function GiftBox() {
  // Inline SVG so we don't need a new asset file. Renders the bow-tied gift
  // box + a couple of sparkle stars around it. Mirroring is done by the
  // caller via CSS transform.
  return (
    <svg
      viewBox="0 0 56 56"
      className="block w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Sparkles */}
      <g fill="#facc15">
        <path d="M48 8l1.2 3 3 1.2-3 1.2L48 16.6l-1.2-3.2-3-1.2 3-1.2L48 8z" />
        <path d="M9 4l.7 1.8 1.8.7-1.8.7L9 9.1l-.7-1.9-1.8-.7 1.8-.7L9 4z" opacity="0.85" />
        <path d="M50 24l.6 1.6 1.6.6-1.6.6L50 28.4l-.6-1.6-1.6-.6 1.6-.6L50 24z" opacity="0.7" />
      </g>
      {/* Gift box body */}
      <g>
        {/* Box base (red) */}
        <rect x="10" y="28" width="36" height="22" rx="2" fill="#dc2626" />
        {/* Lid */}
        <rect x="8" y="22" width="40" height="9" rx="2" fill="#ef4444" />
        {/* Vertical ribbon on lid */}
        <rect x="26" y="22" width="4" height="9" fill="#fde047" />
        {/* Vertical ribbon on body */}
        <rect x="26" y="31" width="4" height="19" fill="#fde047" />
        {/* Bow loops */}
        <path
          d="M28 22c-4-6-12-6-12-1 0 4 6 4 12 1zM28 22c4-6 12-6 12-1 0 4-6 4-12 1z"
          fill="#facc15"
          stroke="#eab308"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* Bow knot */}
        <rect x="25" y="19" width="6" height="5" rx="1" fill="#eab308" />
      </g>
    </svg>
  );
}

/* ---------- Coupon card (the new retention offer) ----------
   Silhouette is the actual Figma `Subtract` SVG (349×238 ticket with side
   notches at y=115). Content overlays the body to match Figma's
   `.coupon-content` flex stack. The footer is a separate strip below
   (overlapping the body's last 15px), with the wavy perforation along its
   top edge — also pulled directly from Figma. */

function CouponCard({ expires }: { expires: string }) {
  const W = 349;
  const BODY_H = 238;
  const FOOTER_H = 44.16;
  const FOOTER_TOP = 223; // overlaps body's last 15px
  const TOTAL_H = FOOTER_TOP + FOOTER_H;

  return (
    <div
      className="relative shrink-0 drop-shadow-[0px_2px_20px_rgba(0,0,0,0.04)]"
      style={{ width: W, height: TOTAL_H }}
    >
      {/* Body silhouette — single SVG path with rounded corners + side
          notches centred at y=115. */}
      <img
        alt=""
        src={couponBg}
        className="absolute left-0 top-0 block"
        style={{ width: W, height: BODY_H }}
      />

      {/* Body content — flex-col stack matching Figma's `.coupon-content` */}
      <div
        className="absolute left-0 top-0 flex flex-col items-center gap-[8px] p-[12px]"
        style={{ width: W, height: 223 }}
      >
        <div className="flex flex-col items-center gap-[12px] px-[10.56px] pb-[8px] w-full">
          <div className="flex flex-col items-center gap-[12px] w-full">
            <div className="flex flex-col items-center gap-[8px] w-full">
              <OneMark className="w-[36.9px] h-[20.82px]" />
              <p className="font-noontree font-bold text-[19px] leading-[14.08px] text-[#0e0e0e] tracking-[-0.23px] text-center">
                Special price for you
              </p>
            </div>
            <div className="bg-[#e1efff] border border-dashed border-[#71b2ff] rounded-[12.48px] px-[10.98px] py-[10.98px] shadow-[0px_0px_16px_rgba(22,22,22,0.04)]">
              <p className="font-noontree font-extrabold text-[23.34px] leading-[27.46px] text-[#0076ff] tracking-[-0.22px] whitespace-nowrap">
                <Aed />
                4.99/month
              </p>
            </div>
          </div>
          <p className="font-noontree font-normal text-[11px] leading-[16px] text-[#666d85] text-center">
            {"Billed "}
            <span className="line-through">
              <Aed />
              149.94
            </span>
            {" "}
            <Aed />
            29.94 for 6 months after trial ends.
          </p>
        </div>
        <button
          type="button"
          className="bg-[#108757] flex items-center justify-center h-[52px] w-[321px] rounded-[12px] cursor-pointer"
        >
          <p className="font-noontree font-medium text-[15px] leading-[18px] text-white tracking-[-0.12px] whitespace-nowrap">
            Continue at <Aed />
            4.99/month
          </p>
        </button>
      </div>

      {/* Footer strip — wavy perforation top, timer label, gift-box decals */}
      <div
        className="absolute left-0 flex flex-col items-center bg-[#fcfcfd] overflow-clip rounded-bl-[14.08px] rounded-br-[14.08px] border-l-[0.88px] border-r-[0.88px] border-b-[0.88px] border-white"
        style={{ top: FOOTER_TOP, width: W, height: FOOTER_H }}
      >
        <img
          alt=""
          src={couponDivider}
          className="block w-full h-[3.52px] shrink-0"
        />
        <div className="flex items-center justify-center pt-[10.56px] pb-[14.08px] px-[7.04px] w-full">
          <div className="flex items-center gap-[3.52px] px-[5.28px]">
            <img alt="" src={timerOutline} className="block size-[16px]" />
            <p className="font-medium text-[12px] leading-[14.08px] text-[#bb7000] tracking-[-0.1px] whitespace-nowrap tabular-nums">
              Expires in {expires}
            </p>
          </div>
        </div>
        {/* Gift-box decals — Figma places one on the left (mirrored, rotated
            ~-164°) and one on the right (rotated -15.5°). Each is 62×62.
            Class order matters: Tailwind composes transforms as rotate then
            scale, so `-scale-y-100 rotate-[-164.45deg]` applies the flip
            first (matching the Figma source classes). */}
        <div className="absolute size-[62px] left-[-13.88px] top-[1.66px] -scale-y-100 rotate-[-164.45deg]">
          <GiftBox />
        </div>
        <div className="absolute size-[62px] left-[300.12px] top-[1.66px] rotate-[-15.55deg]">
          <GiftBox />
        </div>
      </div>
    </div>
  );
}

/* ---------- Membership-ending plan card ---------- */

function EndingPlanCard({ onManage }: { onManage?: () => void }) {
  return (
    <SmoothCorners
      radius={12}
      className="bg-[#f9f9fb] border border-[#f9f9fb] border-solid drop-shadow-[0px_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] items-start pb-[14px] relative shrink-0 w-[346px]"
    >
      {/* Inner white block */}
      <SmoothCorners
        radius={12}
        className="bg-white flex flex-col gap-[6px] items-center justify-center relative shadow-[0px_2px_40px_0px_rgba(0,0,0,0.01)] shrink-0 w-full"
      >
        <div className="flex items-center p-[12px] relative shrink-0 w-full">
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 text-left w-[200px]">
            <p className="font-normal leading-[14px] text-[11px] text-black/75 w-full">
              Current plan
            </p>
            <p className="font-bold leading-[20px] text-[16px] text-[#02060c]/90 tracking-[-0.16px] w-full">
              noon One &amp; YangoPlay
            </p>
          </div>
        </div>
        {/* Dashed separator */}
        <div className="h-px w-full border-t border-dashed border-neutral-200" />
        <div className="bg-white flex gap-[4px] items-center pb-[12px] pt-[4px] px-[12px] relative rounded-bl-[12px] rounded-br-[12px] shrink-0 w-full">
          {/* Red x-circle icon */}
          <svg
            viewBox="0 0 20 20"
            className="block size-[20px] shrink-0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="7.4" stroke="#e5004e" strokeWidth="1.4" />
            <path
              d="M7.4 7.4l5.2 5.2M12.6 7.4l-5.2 5.2"
              stroke="#e5004e"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <p className="font-normal leading-[17px] text-[12px] text-black/75 tracking-[-0.3px] whitespace-nowrap">
            Your membership will end on Oct 18, 2025
          </p>
        </div>
        {/* Free trial pill */}
        <div className="absolute bg-[#f7fffc] border border-[#e7f6f0] flex h-[24px] items-center justify-end overflow-clip px-[12px] py-[4px] right-0 rounded-bl-[12px] rounded-tl-[12px] top-[18.16px]">
          <p className="text-[11px] leading-none whitespace-nowrap">
            <span className="font-bold text-[#108757]">Free trial</span>
            <span className="font-normal text-[#171717]"> for 14 days</span>
          </p>
        </div>
      </SmoothCorners>
      {/* Manage membership row */}
      <button
        type="button"
        onClick={onManage}
        className="flex items-center justify-between px-[16px] relative shrink-0 w-full cursor-pointer text-left"
      >
        <p className="font-medium leading-[15px] text-[#262626] text-[13px] tracking-[-0.12px] whitespace-nowrap">
          Manage membership
        </p>
        <svg
          viewBox="0 0 14 14"
          className="block size-[14px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5.5 3.5L9 7l-3.5 3.5"
            stroke="#262626"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </SmoothCorners>
  );
}

/* ---------- Countdown timer (drives the "Expires in HH:MM:SS" line) ---------- */

function useCountdown(initialSeconds: number) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* ---------- Screen ---------- */

export default function PostCancel({
  onBack,
  onManageMembership,
  onContinueOffer,
}: {
  onBack?: () => void;
  onManageMembership?: () => void;
  onContinueOffer?: () => void;
}) {
  // Used by the coupon footer; declared at the screen level so the value
  // updates without re-mounting the rest of the tree.
  const countdown = useCountdown(24 * 3600 - 1);

  return (
    <div className="bg-[#f4f4f4] relative w-[375px] h-[812px] mx-auto rounded-[20px] overflow-hidden">
      {/* Scrollable area — leaves room for the fixed bottom CTA bar (~96px). */}
      <div className="absolute inset-0 overflow-y-auto pb-[100px]">
        <div className="relative w-full">
          {/* Decorative orange/yellow background blobs */}
          <div className="absolute h-[774px] left-[-284.5px] top-[-101px] w-[937px] pointer-events-none overflow-hidden">
            <div className="absolute h-[420px] left-[106px] top-[-30px] w-[426px]">
              <img alt="" src={ellipse3931} className="absolute -inset-[33%] w-[177%] h-[166%] max-w-none" />
            </div>
            <div className="absolute h-[485px] left-[400px] top-[-178.5px] w-[496px]">
              <img alt="" src={ellipse3930} className="absolute -inset-[27%] w-[154%] h-[154%] max-w-none" />
            </div>
            <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[789px] left-[calc(50%+0.5px)] mix-blend-lighten top-1/2 w-[385px]">
              <img alt="" src={lines} className="absolute inset-0 w-full h-full" />
            </div>
          </div>

          <StatusBar />

          {/* Optional back button — top-left, only renders if onBack supplied */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="absolute left-[14px] top-[59px] z-20 bg-white border border-[#f2f3f7] flex items-center justify-center p-[8px] rounded-[18px] cursor-pointer"
            >
              <svg viewBox="0 0 20 20" className="size-[20px]" fill="none" aria-hidden="true">
                <path
                  d="M12.5 5L7.5 10L12.5 15"
                  stroke="#0E0E0E"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <div className="relative flex flex-col gap-[18px] items-center w-[346px] mx-auto pt-[89px] pb-[40px]">
            <Hero />

            <CouponCard expires={countdown} />

            <EndingPlanCard onManage={onManageMembership} />

            {/* Below-the-fold sections — same layout as the SubscribedUser
                home, so we reuse the cards directly. */}
            <div className="flex flex-col gap-[16px] items-center w-full">
              <SavingsCard />
              <PromoStrip />
              <OsnCard />
              <ValuePropsCard />
              <FaqCard />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA bar — green button + home indicator */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-white pt-[14px] pb-[14px] px-[16px] rounded-tl-[12px] rounded-tr-[12px] shadow-[0px_-4px_17.6px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={onContinueOffer}
          className="bg-[#108757] flex items-center justify-center h-[52px] w-full rounded-[12px] cursor-pointer"
        >
          <p className="font-noontree font-medium text-[15px] leading-[18px] text-white tracking-[-0.12px] whitespace-nowrap">
            Continue at <Aed />
            4.99/month
          </p>
        </button>
        <div className="flex justify-center pt-[10px]">
          <div className="bg-[#404553] h-[5px] rounded-[8px] w-[124px]" />
        </div>
      </div>
    </div>
  );
}
