import chevronDown1 from "../assets/chevron-down-1.svg";
import chevronStroke from "../assets/chevron-stroke.svg";
import visualTvEn from "../assets/visual-tv-en.png";
import osnPlus from "../assets/osn-plus.svg";
import ellipse3931 from "../assets/ellipse3931.svg";
import ellipse3930 from "../assets/ellipse3930.svg";
import lines from "../assets/lines.svg";
import ellipse2080 from "../assets/ellipse2080.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import heroLogoLottie from "../assets/lottie/hero-logo.lottie?url";
import SmoothCorners from "./SmoothCorners";
import iconTruck from "../assets/icon-truck.svg";
import seprator from "../assets/seprator.svg";
import seprator2 from "../assets/seprator2.svg";
import ticketVec1 from "../assets/ticket-vec1.svg";
import ticketVec2 from "../assets/ticket-vec2.svg";
import ticketVec3 from "../assets/ticket-vec3.svg";
import ticketPercent from "../assets/ticket-percent.svg";
import namshiG1 from "../assets/namshi-g1.svg";
import namshiG2 from "../assets/namshi-g2.svg";
import foodLogo from "../assets/food-logo.svg";
import foodFrame from "../assets/food-frame.svg";

// Brand carousel tiles — pre-composited 76×76 PNGs from the Field DS Figma
import brandTrail from "../assets/brand-trail.svg";
import layer2 from "../assets/layer2.svg";
import star from "../assets/star.svg";
import ellipse24014 from "../assets/ellipse24014.svg";
import giftBox from "../assets/gift-box.svg";
import couponGroup from "../assets/coupon-group.svg";
import couponPercent from "../assets/coupon-percent.svg";
import couponVec1 from "../assets/coupon-vec1.svg";
import couponVec2 from "../assets/coupon-vec2.svg";
import cap from "../assets/cap.svg";
import wifi from "../assets/wifi.svg";
import cellular from "../assets/cellular.svg";
import brandTags from "../assets/brand-tags.png";

function StatusBar() {
  return (
    <div className="absolute h-[42.565px] left-0 top-0 w-[375px] z-10">
      {/* Time */}
      <div className="absolute h-[21px] left-[21px] top-[7px] w-[54px]">
        <p className="-translate-x-1/2 absolute font-semibold leading-none left-[27px] text-[15px] text-black text-center top-[calc(50%-3.5px)] tracking-[-0.3px] w-[54px]">
          9:41
        </p>
      </div>
      {/* Cellular */}
      <div className="absolute inset-[40.15%_17.07%_35.61%_78.4%]">
        <img alt="" className="absolute block inset-0 w-full h-full" src={cellular} />
      </div>
      {/* Wifi */}
      <div className="absolute inset-[39.39%_11.64%_35.61%_84.27%]">
        <img alt="" className="absolute block inset-0 w-full h-full" src={wifi} />
      </div>
      {/* Battery */}
      <div className="absolute right-[14.34px] top-[17.33px]">
        <div className="absolute border border-black border-solid h-[11.333px] opacity-35 right-[2.33px] rounded-[2.667px] top-0 w-[22px]" />
        <div className="absolute h-[4px] right-0 top-[3.67px] w-[1.328px]">
          <img alt="" className="absolute block inset-0 w-full h-full" src={cap} />
        </div>
        <div className="absolute bg-black h-[7.333px] right-[4.33px] rounded-[1.333px] top-[2px] w-[18px]" />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="h-[139.844px] relative shrink-0 w-[319px]">
      {/* Noon One logo — Ripple Lottie. Moved to position 0 so it renders
          BEHIND the rest (DOM order = z-stacking for absolute siblings).
          Container size matches the canvas dims requested in Retune (665×377)
          so the ripple animation has its full breathing room. Centred
          horizontally on the parent (left-1/2). */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[377px] left-1/2 top-[calc(50%-40.65px)] w-[665px] pointer-events-none">
        <DotLottieReact
          src={heroLogoLottie}
          autoplay
          loop={false}
          className="block w-full h-full"
        />
      </div>
      {/* Soft glow ellipse behind logo */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-2.17px)] w-[190.577px] h-[190.577px] top-[calc(50%-29.64px)]">
        <img alt="" className="absolute block inset-0 w-full h-full" src={ellipse2080} />
      </div>
      {/* Name */}
      <p className="-translate-x-1/2 absolute font-extrabold leading-[28px] left-[calc(50%+1px)] text-[28px] text-black text-center top-[77px] tracking-[-1px] w-[319px]">
        Rahul Jaiswal
      </p>
      {/* Subtitle */}
      <p className="-translate-x-1/2 absolute font-normal leading-[18px] left-[calc(50%+1px)] text-[14px] text-black/75 text-center top-[111.84px] tracking-[-0.3px] whitespace-nowrap">
        One member since 5th Jan, 2026
      </p>
    </div>
  );
}

function CurrentPlanCard({ onManage }: { onManage?: () => void }) {
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
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 text-left w-[166px]">
            <p className="font-normal leading-[14px] text-[11px] text-black/75 w-full">
              Current plan
            </p>
            <p className="font-bold leading-[20px] text-[16px] text-[#02060c]/90 tracking-[-0.16px] w-full">
              One Monthly
            </p>
          </div>
        </div>
        {/* Dashed separator */}
        <div className="h-px w-full border-t border-dashed border-neutral-200" />
        <div className="bg-white flex gap-[4px] items-center pb-[12px] pt-[4px] px-[12px] relative rounded-bl-[12px] rounded-br-[12px] shrink-0 w-full">
          <div className="relative shrink-0 size-[16px]">
            {/* Clean inline calendar-with-check icon. Replaced the original
                Figma SVG that had `preserveAspectRatio="none"` distortion and
                opaque #0E0E0E fills. */}
            <svg
              viewBox="0 0 16 16"
              className="block w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Calendar body */}
              <rect
                x="1.5"
                y="3"
                width="13"
                height="11.5"
                rx="2.2"
                stroke="#8A8A8A"
                strokeWidth="1.2"
              />
              {/* Top binding (date header strip) */}
              <line
                x1="1.5"
                y1="6.2"
                x2="14.5"
                y2="6.2"
                stroke="#8A8A8A"
                strokeWidth="1.2"
              />
              {/* Hangers */}
              <line
                x1="5"
                y1="1.5"
                x2="5"
                y2="4.5"
                stroke="#8A8A8A"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <line
                x1="11"
                y1="1.5"
                x2="11"
                y2="4.5"
                stroke="#8A8A8A"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Checkmark inside */}
              <path
                d="M5 10.5L7 12.2L11 8.5"
                stroke="#8A8A8A"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-normal leading-[17px] text-[12px] text-black/75 tracking-[-0.3px] whitespace-nowrap">
            Auto renews on 24 May 2026 at <Aed />
            24.99/month
          </p>
        </div>
        {/* Active tag */}
        <div className="absolute bg-[#f7fffc] border border-[#e7f6f0] flex h-[24px] items-center justify-end overflow-clip px-[12px] py-[4px] right-[0.48px] rounded-bl-[12px] rounded-tl-[12px] top-[18.16px]">
          <p className="font-semibold leading-none text-[#108757] text-[12px] text-right whitespace-nowrap">
            Active
          </p>
        </div>
      </SmoothCorners>
      {/* Manage membership row — the only clickable surface */}
      <button
        type="button"
        onClick={onManage}
        className="flex items-center justify-between px-[16px] relative shrink-0 w-full cursor-pointer text-left"
      >
        <p className="font-medium leading-[15px] text-[#262626] text-[13px] tracking-[-0.12px] whitespace-nowrap">
          Manage membership
        </p>
        <div className="overflow-clip relative shrink-0 size-[14px] flex items-center justify-center">
          <img alt="" className="block w-[6px] h-[10px] rotate-180" src={chevronStroke} />
        </div>
      </button>
    </SmoothCorners>
  );
}

/**
 * AED dirham mark, rendered with Noontree's PUA glyph U+E001 (the "Dh"
 * ligature). Noontree is loaded via @font-face in index.css and exposed
 * as `font-noontree` in tailwind.config.js. To use the newer 2024 official
 * UAE dirham symbol instead, swap the inner glyph to U+E000.
 */
/**
 * OSN+ wordmark — the real SVG pulled from Figma node 3383:15486 (OsnCard).
 * The asset's native viewBox is 29.87×20.18 (≈ 1.48:1). Pass `className` with
 * a height utility (e.g. `h-[14px]`) — width is auto from the aspect ratio.
 */
function OsnPlusMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={osnPlus}
      alt="OSN+"
      className={`block w-auto ${className}`}
    />
  );
}

function Aed({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="AED"
      className={`font-noontree tracking-[0] inline-block align-baseline mr-[2px] ${className}`}
    >
      {""}
    </span>
  );
}

function SavingsRow({
  iconNode,
  title,
  meta,
  amount,
}: {
  iconNode: React.ReactNode;
  title: string;
  meta: string;
  amount: string;
}) {
  return (
    <div className="flex gap-[7px] items-center relative shrink-0 w-full">
      {iconNode}
      <div className="flex flex-1 items-center justify-between min-w-0 relative">
        <div className="flex flex-col gap-[4px] items-start">
          <p className="font-semibold leading-[20px] text-[#1d2539] text-[16px] tracking-[-0.16px]">
            {title}
          </p>
          <p className="font-medium leading-[14px] text-[#666d85] text-[12px] tracking-[-0.12px]">
            {meta}
          </p>
        </div>
        <p className="font-bold leading-[24px] text-[#1d2539] text-[18px] tracking-[-0.18px] whitespace-nowrap">
          <Aed />
          {amount}
        </p>
      </div>
    </div>
  );
}

function SavingsCard() {
  return (
    <SmoothCorners
      radius={16}
      className="bg-white flex flex-col gap-[6px] items-start pb-[8px] pt-[16px] relative shrink-0 w-[346px]"
    >
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <div className="flex items-center pl-[16px] pr-[120px] relative shrink-0 w-full">
          <div className="flex flex-col gap-[4px] items-start relative shrink-0 w-[235px]">
            <p className="font-medium leading-[16px] text-[#1d2539] text-[12px] whitespace-nowrap">
              With noon One you have saved
            </p>
            <div className="flex items-center relative shrink-0">
              <p className="font-bold leading-[38px] text-[#1d2539] text-[30px] tracking-[-0.45px] whitespace-nowrap">
                <Aed />
                124.34
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[32px] relative shrink-0 w-full bg-gradient-to-r from-[#e5faec] from-[24%] to-white/0 to-[135%]">
        <p className="absolute font-medium leading-[18px] left-[12px] text-[#108757] text-[14px] top-[7px] tracking-[-0.14px] whitespace-nowrap">
          That’s 3X of what you paid for!
        </p>
      </div>
      <div className="flex flex-col gap-[16px] items-start overflow-clip px-[16px] py-[12px] relative rounded-[16px] shrink-0 w-full">
        <SavingsRow
          iconNode={
            <div className="flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0 size-[44px]">
              <img alt="" src={iconTruck} className="size-[28px]" />
            </div>
          }
          title="Free deliveries"
          meta="Used 21 times"
          amount="79.22"
        />
        <img alt="" src={seprator} className="w-full h-px" />
        <SavingsRow
          iconNode={
            <div className="flex items-center justify-center relative shrink-0 size-[40px]">
              <svg
                viewBox="0 0 40 40"
                className="block size-[28px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Ticket body — dark rounded shape with semicircular notches */}
                <path
                  d="M5 12a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4v3.5a3 3 0 0 0 0 6V25a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3.5a3 3 0 0 0 0-6V12Z"
                  fill="#1d2539"
                />
                {/* Percent sign in white */}
                <g fill="#ffffff">
                  <circle cx="16" cy="16.5" r="1.6" />
                  <circle cx="24" cy="20.5" r="1.6" />
                  <rect
                    x="13.4"
                    y="17.6"
                    width="13.2"
                    height="1.6"
                    rx="0.8"
                    transform="rotate(-40 20 18.5)"
                  />
                </g>
              </svg>
            </div>
          }
          title="Member-only deals"
          meta="Used 3 times"
          amount="48.22"
        />
        <img alt="" src={seprator} className="w-full h-px" />
        <SavingsRow
          iconNode={
            <div className="flex items-center justify-center relative shrink-0 size-[40px]">
              <OsnPlusMark className="h-[14px]" />
            </div>
          }
          title="OSN+ subscriptions"
          meta="Activated"
          amount="29.99"
        />
      </div>
    </SmoothCorners>
  );
}

/* ---------- Brand ticker ---------- */

/**
 * Auto-scrolling brand ticker. The carousel content is now a single composite
 * SVG (`brand-trail.svg` — supplied by the user, native dimensions 345×81).
 * The track holds two side-by-side copies; the `marquee` keyframe in
 * tailwind.config.js translates 0 → -50% so the second copy lands exactly
 * where the first started — a seamless infinite loop. No JS / RAF needed
 * because the SVG is one composited image — per-tile centre-scaling no
 * longer applies (it's baked into the SVG instead).
 */
function PromoStrip() {
  // Matches Figma node 20787:4759 — white card with the brand trail on top
  // and the "Unlimited same day free delivery" headline + subtext below.
  return (
    <SmoothCorners
      radius={12}
      className="h-[166px] relative shrink-0 w-full"
      style={{
        background:
          "radial-gradient(ellipse 173px 83px at 50% 50%, #fcfcfc 0%, #ffffff 100%)",
      }}
    >
      {/* Headline + subtext, anchored to the lower portion of the card */}
      <div className="-translate-x-1/2 absolute flex flex-col gap-[4px] items-center justify-center left-1/2 text-center top-[100px] w-full px-4">
        <p className="font-bold leading-[20px] text-[#171717] text-[16px] tracking-[-0.16px] w-full">
          Unlimited same day free delivery
        </p>
        <p className="font-normal leading-[14px] text-[#3d3d3d] text-[12px] tracking-[-0.12px] w-full">
          exclusive member deals
        </p>
      </div>

      {/* Brand trail viewport */}
      <div
        className="absolute left-0 right-0 top-[8px] h-[88px] overflow-hidden"
        aria-label="Brand partners ticker"
      >
        <div className="absolute inset-y-0 left-0 flex w-max items-center animate-marquee">
          <img
            src={brandTrail}
            alt="noon brand partners"
            draggable={false}
            className="block h-[81px] w-[345px] shrink-0 select-none"
          />
          <img
            src={brandTrail}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="block h-[81px] w-[345px] shrink-0 select-none"
          />
        </div>
      </div>
    </SmoothCorners>
  );
}

function OsnCard() {
  return (
    <SmoothCorners
      radius={12}
      className="bg-white h-[139px] relative w-[346px]"
    >
      <div className="absolute flex flex-wrap gap-[6px_10px] items-start left-[12px] top-[16.03px] w-[226px]">
        <p className="font-bold leading-[18px] shrink-0 text-[16px] text-[#02060c]/90 tracking-[-0.3px] w-[200px]">
          OSN+ is available now
        </p>
        <div className="flex items-center justify-center w-[155px]">
          <p className="flex-1 font-normal leading-[14px] text-[12px] text-[#02060c]/75 tracking-[-0.12px]">
            Watch your favourite shows!
          </p>
        </div>
      </div>
      {/* OSN+ pill — circular badge with the OSN+ wordmark properly sized */}
      <div className="absolute right-[12px] top-[7.98px] size-[42px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
        <OsnPlusMark className="h-[14px]" />
      </div>
      {/* Activate button */}
      <button className="absolute bg-black flex items-center justify-center left-[12px] px-[20px] py-[8px] rounded-[8px] top-[86.21px] cursor-pointer">
        <p className="font-bold leading-none text-[14.045px] text-center text-white whitespace-nowrap">
          Activate now
        </p>
      </button>
      {/* TV illustration */}
      <div className="absolute h-[115.59px] left-[209.46px] overflow-clip top-[25.16px] w-[183.349px]">
        <div className="absolute h-[99px] left-[18.09px] top-[31.34px] w-[109px] overflow-hidden">
          <img
            alt=""
            src={visualTvEn}
            className="absolute h-[127.08%] left-[-11.15%] top-[-10.17%] w-[130.85%] max-w-none"
          />
        </div>
      </div>
    </SmoothCorners>
  );
}

function ValuePropsRow({
  title,
  subtitle,
  trailing,
}: {
  title: string;
  subtitle: string;
  trailing: React.ReactNode;
}) {
  return (
    <div className="flex h-[40px] items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-1 gap-[8px] items-start min-w-0 relative">
        <div className="relative shrink-0 size-[16px]">
          <div className="absolute inset-[-31.25%_-62.5%_-68.75%_-37.5%]">
            <img alt="" src={star} className="block w-full h-full" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-[6px] items-start min-w-0 relative">
          <p className="font-bold leading-[20px] text-[#02060c]/90 text-[16px] tracking-[-0.16px] w-full">
            {title}
          </p>
          <p className="font-normal leading-[14px] text-[#02060c]/75 text-[12px] tracking-[-0.12px] w-full">
            {subtitle}
          </p>
        </div>
      </div>
      {trailing}
    </div>
  );
}

function ValuePropsCard() {
  const trailingGift = (
    <div className="relative shrink-0 size-[44px]">
      <img alt="" src={ellipse24014} className="absolute inset-0 w-full h-full" />
      <img alt="" src={giftBox} className="absolute left-[11.25px] top-[11.25px] w-[21.5px] h-[21.5px]" />
    </div>
  );
  const trailingCoupon = (
    <div className="relative shrink-0 size-[44px]">
      <img alt="" src={ellipse24014} className="absolute inset-0 w-full h-full" />
      <div className="absolute left-[8.5px] top-[8.5px] w-[27px] h-[27px]">
        <img alt="" src={couponVec1} className="absolute left-[6.91px] top-[5.15px] w-[19.586px] h-[16.689px]" />
        <img alt="" src={couponVec2} className="absolute left-[0.25px] top-[5.15px] w-[6.905px] h-[16.689px]" />
        <img alt="" src={couponGroup} className="absolute left-[11.61px] top-[9.45px] w-[8.098px] h-[8.083px]" />
        <img alt="" src={couponPercent} className="absolute left-[23.49px] top-[18.54px] w-[3.255px] h-[3.302px]" />
      </div>
    </div>
  );
  const brandStack = (
    <div className="flex flex-col h-[44px] items-end justify-center shrink-0">
      <div className="flex flex-col items-start w-[112px]">
        <div className="flex items-start pr-[14.932px] relative">
          {/* yellow noon */}
          <div className="bg-[#f7e628] border-[0.747px] border-[#02060c]/5 mr-[-14.932px] relative rounded-full shrink-0 size-[35px]">
            <img alt="" src={foodLogo} className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-[5.752px] w-[19.721px]" />
          </div>
          {/* food red */}
          <div className="bg-[#e5004e] border-[0.747px] border-[#02060c]/5 mr-[-14.932px] relative rounded-full shrink-0 size-[35px] overflow-clip">
            <img alt="" src={foodFrame} className="absolute inset-0 size-full" />
          </div>
          {/* namshi blue */}
          <div className="bg-[#2122b8] border-[0.747px] border-[#02060c]/5 mr-[-14.932px] relative rounded-full shrink-0 size-[35px] overflow-clip">
            <img alt="" src={namshiG1} className="absolute inset-[36.89%_29.11%_50%_29.11%]" />
            <img alt="" src={namshiG2} className="absolute inset-[50%_41.28%_36.9%_29.11%]" />
          </div>
          {/* orange */}
          <div className="bg-[#ef5227] mr-[-14.932px] overflow-clip relative rounded-full shrink-0 size-[32.941px]">
            <img alt="" src={layer2} className="absolute -translate-x-1/2 -translate-y-1/2 left-[calc(50%-2px)] top-1/2 h-[25.436px] w-[18.653px]" />
          </div>
          {/* dark red */}
          <div className="bg-[#d22d29] border-[0.747px] border-[#02060c]/5 mr-[-14.932px] relative rounded-full shrink-0 size-[35px] overflow-clip">
            <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[28px] h-[6.5px] overflow-hidden">
              <img alt="" src={brandTags} className="absolute h-full -left-[81.72%] w-[181.72%] max-w-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SmoothCorners
      radius={12}
      className="bg-white flex flex-col gap-[20px] items-start px-[12px] py-[20px] relative shrink-0 w-full"
    >
      <ValuePropsRow
        title="Free 15 Days trial"
        subtitle="Risk free, you can cancel anytime"
        trailing={trailingGift}
      />
      <img alt="" src={seprator2} className="w-full h-px" />
      <ValuePropsRow
        title="Unlimited Free Delivery"
        subtitle="On food, groceries, & shopping"
        trailing={brandStack}
      />
      <img alt="" src={seprator2} className="w-full h-px" />
      <ValuePropsRow
        title="Member-Only Deals"
        subtitle="Big savings, every month"
        trailing={trailingCoupon}
      />
    </SmoothCorners>
  );
}

function FaqCard() {
  const items = [
    "What is noon One?",
    "How much does noon One cost?",
    "Do I get a free trial? If yes, What does it include?",
    "What does free delivery on noon express include?",
  ];
  return (
    <SmoothCorners
      radius={12}
      className="bg-white flex flex-col gap-[12px] items-start pt-[16px] px-[12px] pb-1 relative w-[343px]"
    >
      <button className="flex items-center justify-between w-full cursor-pointer">
        <p className="font-semibold leading-[20px] text-[#171717] text-[16px] tracking-[-0.16px] whitespace-nowrap">
          Frequently asked question
        </p>
      </button>
      <div className="flex flex-col items-start w-full">
        {items.map((q, i) => (
          <div
            key={i}
            className={`${i === items.length - 1 ? "" : "border-b border-[#f5f5f5]"} flex gap-[16px] items-center py-[12px] w-full`}
          >
            <p className="flex-1 font-medium leading-[18px] text-[#404040] text-[14px] tracking-[-0.14px]">
              {q}
            </p>
            <img alt="" src={chevronDown1} className="size-[20px] shrink-0" />
          </div>
        ))}
      </div>
    </SmoothCorners>
  );
}

export default function SubscribedUser({
  onManageMembership,
}: {
  onManageMembership?: () => void;
} = {}) {
  return (
    <div className="bg-[#f4f4f4] relative w-[375px] h-[812px] mx-auto rounded-[20px] overflow-hidden">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="relative w-full">
          {/* Decorative orange/yellow bg blobs in upper area */}
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

          <div className="relative flex flex-col gap-[18px] items-center w-[346px] mx-auto pt-[89px] pb-[40px]">
            <Hero />
            <CurrentPlanCard onManage={onManageMembership} />
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

      {/* iPhone home indicator — same pill as Manage Membership / Change
          Plan, pinned to the bottom edge of the iPhone frame so the home
          screen has the same device-shape illusion as the other screens. */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-center py-[14px] pointer-events-none">
        <div className="bg-[#404553] h-[5px] rounded-[8px] w-[124px]" />
      </div>
    </div>
  );
}
