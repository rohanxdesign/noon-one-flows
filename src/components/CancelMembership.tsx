import StatusBar from "./StatusBar";
import SmoothCorners from "./SmoothCorners";
import SlotNumber from "./SlotNumber";
import deliveryIllustration from "../assets/cancel/delivery-illustration.png";
import dealsIllustration from "../assets/cancel/deals-illustration.png";
import sneaker from "../assets/cancel/sneaker.png";
import pringles from "../assets/cancel/pringles.png";
import laptop from "../assets/cancel/laptop.png";
import perfume from "../assets/cancel/perfume.png";

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

/** Tiny lightning bolt for the "Coming up in 7 days" pill. */
function LightningBolt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 12"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5.4 0.5L0.7 6.5h3.3l-.7 4.5 4.7-6h-3.3l.7-4.5z"
        fill="#F65555"
      />
    </svg>
  );
}

/** Tiny green sparkle for the "you'll lose savings" pill. */
function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 8 8"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2L4 0Z"
        fill="#108757"
      />
    </svg>
  );
}

/** Dirham (AED) glyph from the Noontree font (PUA U+E001). */
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

/* ---------- Sub-blocks ---------- */

function BenefitCallout({
  illustration,
  label,
  amount,
}: {
  illustration: string;
  label: React.ReactNode;
  amount: string;
}) {
  return (
    <SmoothCorners
      radius={17}
      className="bg-white border border-[#f2f3f7] flex-1 h-[118px] relative overflow-hidden rounded-[17px]"
    >
      <div className="absolute left-[12px] top-[12px] right-[12px] flex flex-col gap-[10px]">
        <p className="font-medium text-[#343d54] text-[14px] leading-[17px] tracking-[-0.22px]">
          {label}
        </p>
        <p className="font-noontree font-bold text-[#343d54] text-[20px] leading-[20px] tracking-[-0.22px]">
          <Aed />
          {amount}
        </p>
      </div>
      {/* Illustration peeks from bottom-right; positioned slightly past the
          card edge so it crops on the corner like the Figma render. */}
      <img
        src={illustration}
        alt=""
        className="absolute right-[-4px] bottom-[-4px] size-[78px] object-contain pointer-events-none"
      />
    </SmoothCorners>
  );
}

function ProductTile({ src }: { src: string }) {
  return (
    <SmoothCorners
      radius={10}
      className="bg-[#f9fafb] border-[1.2px] border-[#f3f5f7] rounded-[10px] size-[68px] relative overflow-hidden shrink-0"
    >
      <img
        src={src}
        alt=""
        className="absolute inset-[8px] w-[calc(100%-16px)] h-[calc(100%-16px)] object-contain pointer-events-none"
      />
    </SmoothCorners>
  );
}

/* ---------- Screen ---------- */

export default function CancelMembership({
  onBack,
  onKeepMembership,
  onContinueCancellation,
}: {
  onBack: () => void;
  onKeepMembership: () => void;
  onContinueCancellation: () => void;
}) {
  return (
    <div
      className="relative w-[375px] h-[812px] mx-auto overflow-hidden rounded-[20px]"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #ffffff 31%, #f3f3f5 100%)",
      }}
    >
      <StatusBar />

      {/* Back button — floats top-left */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="absolute left-[14px] top-[59px] z-20 bg-white border border-[#f2f3f7] flex items-center justify-center p-[8px] rounded-[18px] cursor-pointer"
      >
        <BackChevron className="size-[20px]" />
      </button>

      {/* Scrollable content area — leaves room at the bottom for the fixed
          action bar (~158px). */}
      <div className="absolute inset-0 pt-[110px] pb-[180px] overflow-y-auto">
        <div className="px-[14px] flex flex-col gap-[16px]">
          {/* Title */}
          <div className="flex flex-col gap-[2px]">
            <p className="font-noontree font-bold text-[#343d54] text-[28px] leading-[31px] tracking-[-0.68px]">
              You saved <Aed />
              <SlotNumber value={343} height={31} shimmer />
            </p>
            <p className="font-noontree text-[#666d85] text-[16px] leading-[22px] tracking-[-0.28px]">
              that's more than what you paid for
            </p>
          </div>

          {/* Two benefit callout cards */}
          <div className="flex gap-[12px] items-center">
            <BenefitCallout
              illustration={deliveryIllustration}
              label={
                <>
                  16 free &amp; fast
                  <br />
                  deliveries
                </>
              }
              amount="300"
            />
            <BenefitCallout
              illustration={dealsIllustration}
              label={
                <>
                  Member-only
                  <br />
                  deals &amp; offers
                </>
              }
              amount="43"
            />
          </div>

          {/* One Day Sale card */}
          <SmoothCorners
            radius={16}
            className="bg-white border border-[#f2f3f7] rounded-[16px] w-full p-[16px] flex flex-col gap-[12px]"
          >
            {/* Header row — title + "Coming up in 7 days" pill */}
            <div className="flex items-center justify-between">
              <p className="font-bold text-[18px] leading-[20px] tracking-[-0.16px]">
                <span className="text-[#1d2539]">One Day</span>
                <span className="text-[#101628]"> Sale</span>
              </p>
              <div
                className="flex items-center gap-[4px] pl-[8px] pr-[10px] py-[5px] rounded-[39px]"
                style={{
                  backgroundImage:
                    "linear-gradient(90.28deg, #ffd7d7 0%, #ffffff 95%)",
                }}
              >
                <LightningBolt className="w-[12px] h-[14px] shrink-0" />
                <p className="font-noontree font-medium text-black text-[12px] leading-[14px] tracking-[-0.12px] whitespace-nowrap">
                  Coming up in 7 days
                </p>
              </div>
            </div>

            {/* Product strip */}
            <div className="flex items-center justify-between">
              <ProductTile src={sneaker} />
              <ProductTile src={pringles} />
              <ProductTile src={laptop} />
              <ProductTile src={perfume} />
            </div>

            {/* Cashback line */}
            <p
              className="font-noontree font-bold text-[16px] leading-[20px] tracking-[-0.14px]"
              style={{ fontFeatureSettings: "'case' 1" }}
            >
              <span className="text-[#108757]">10% cashback </span>
              <span className="text-[#343d54]">
                up to <Aed />75{" "}
              </span>
            </p>

            {/* "You'll lose 10% savings" pill */}
            <div
              className="self-start flex items-center gap-[4px] pl-[8px] pr-[10px] py-[4px] rounded-[39px]"
              style={{
                backgroundImage:
                  "linear-gradient(90.7deg, #edfef0 1.7%, #ffffff 94.3%)",
              }}
            >
              <Sparkle className="size-[8px] shrink-0" />
              <p className="font-noontree font-medium text-[#101628] text-[12px] leading-[14px] tracking-[-0.12px]">
                You'll lose <span className="font-bold">10% savings</span> on
                every order if you go now.
              </p>
            </div>
          </SmoothCorners>

          {/* Support pill */}
          <SmoothCorners
            radius={39}
            className="bg-[#fcfcfd] flex items-center px-[13px] py-[7px] rounded-[39px] w-full"
          >
            <p className="font-medium text-[#343d54] text-[12px] leading-[20px] tracking-[-0.22px]">
              We're here to help with your membership.{" "}
              <span className="text-[#0057ff]">Contact support</span>
            </p>
          </SmoothCorners>
        </div>
      </div>

      {/* Bottom fixed action bar */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white pt-[12px] pb-[16px] px-[16px] flex flex-col gap-[12px] rounded-tl-[12px] rounded-tr-[12px]"
        style={{ boxShadow: "0px -4px 17.6px rgba(0, 0, 0, 0.1)" }}
      >
        <button
          type="button"
          onClick={onKeepMembership}
          className="bg-[#101628] text-white font-semibold text-[15px] leading-[20px] tracking-[-0.26px] h-[52px] rounded-[12px] cursor-pointer"
        >
          Keep membership
        </button>
        <button
          type="button"
          onClick={onContinueCancellation}
          className="bg-[#f9f9fb] border border-[#eaecf0] text-[#0e0e0e] font-semibold text-[15px] leading-[20px] tracking-[-0.26px] h-[52px] rounded-[12px] cursor-pointer"
        >
          Continue Cancellation
        </button>
        {/* iPhone home indicator */}
        <div className="flex justify-center pt-[8px]">
          <div className="bg-[#404553] h-[5px] rounded-[8px] w-[124px]" />
        </div>
      </div>
    </div>
  );
}
