import { useState } from "react";
import StatusBar from "./StatusBar";
import SmoothCorners from "./SmoothCorners";
import AddNewCardSheet from "./AddNewCardSheet";
import visaLogo from "../assets/visa-logo.png";
import mastercardLogo from "../assets/mastercard-logo.png";
import amexLogo from "../assets/amex-logo.png";
import stcPayLogo from "../assets/stc-pay-logo.png";
import applePayBadge from "../assets/apple-pay-badge.png";

/* ---------- Inline icons ---------- */

function BackChevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 6L9 12L15 18"
        stroke="#0E0E0E"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 4v10M4 9h10"
        stroke="#0076ff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Selected radio — blue ring with white inner dot, matches Figma. */
function RadioSelected({ className = "" }: { className?: string }) {
  return (
    <div
      className={`size-[18px] rounded-full border-[5px] border-[#0076ff] bg-white shrink-0 ${className}`}
    />
  );
}

function RadioUnselected({ className = "" }: { className?: string }) {
  return (
    <div
      className={`size-[18px] rounded-full border-[1.5px] border-[#989fb3] bg-white shrink-0 ${className}`}
    />
  );
}

/* ---------- Sub-components ---------- */

/** Top section header with back button + centred title. */
function Header({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute left-0 right-0 top-[45px] flex items-center px-[16px] z-10">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="bg-white border-[1.25px] border-[#e3e3e3] flex items-center justify-center size-[40px] rounded-full cursor-pointer shrink-0"
      >
        <BackChevron className="size-[20px]" />
      </button>
      <p className="absolute left-1/2 -translate-x-1/2 font-semibold text-black text-[16px] leading-[22.4px]">
        Payment Method
      </p>
    </div>
  );
}

/** Selected debit/credit card row + auto-renew tag + add-new-card row. */
function DebitCard({ onAddNewCard }: { onAddNewCard: () => void }) {
  const [cvv, setCvv] = useState("");

  return (
    <SmoothCorners
      radius={8}
      className="bg-white border border-[#dee7fe] rounded-[8px] w-full flex flex-col gap-[16px] pb-[16px] pl-[12px]"
    >
      {/* Section title with subtle bottom hairline */}
      <div className="border-b border-[rgba(56,102,223,0.2)] flex items-center py-[12px] w-[341px]">
        <p className="font-semibold text-[#262a33] text-[14px] leading-[18px] tracking-[-0.14px]">
          Debit/Credit Card
        </p>
      </div>

      {/* Selected card row + CVV input */}
      <div className="flex gap-[8px] items-center w-[317px]">
        <RadioSelected />
        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex gap-[4px] items-center">
            <img
              src={visaLogo}
              alt="Visa"
              className="block h-[16px] w-[28px] object-contain"
            />
            <p className="font-['Proxima_Nova:Regular',sans-serif] text-[6px] tracking-[1px] text-[rgba(38,42,51,0.8)]">
              ●●●●
            </p>
            <p className="font-semibold text-[14px] leading-[18px] text-[rgba(38,42,51,0.8)] tracking-[-0.14px]">
              7074
            </p>
          </div>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            className="border-[0.556px] border-[#d0d4dd] rounded-[7px] h-[26.7px] w-[48px] text-center font-bold text-[12px] text-[#262a33] placeholder:text-[rgba(153,153,153,0.5)] outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Auto-renew info chip */}
      <div className="bg-[#eff7ff] flex items-center justify-between rounded-[8px] px-[12px] py-[8px] w-[317px]">
        <p className="text-[12px] leading-[20px] tracking-[-0.14px] text-[rgba(14,14,14,0.92)]">
          <span className="font-medium">Auto renews monthly at</span>
          <span className="font-bold"> $24.99</span>
        </p>
      </div>

      {/* Dashed separator */}
      <div className="w-[317px] border-t border-dashed border-[#eaecf0]" />

      {/* Add New Card row */}
      <button
        type="button"
        onClick={onAddNewCard}
        className="flex items-center justify-between w-[317px] cursor-pointer"
      >
        <div className="flex gap-[8px] items-center">
          <PlusIcon className="size-[18px]" />
          <p className="text-[#262a33] text-[14px] leading-[18px] tracking-[-0.14px]">
            Add New Card
          </p>
        </div>
        <div className="flex gap-[8px] items-center h-[20px]">
          <img
            src={visaLogo}
            alt="Visa"
            className="block h-[16px] w-[28px] object-contain"
          />
          <img
            src={mastercardLogo}
            alt="Mastercard"
            className="block h-[13.5px] w-[21.6px] object-contain"
          />
          <img
            src={amexLogo}
            alt="American Express"
            className="block size-[18px] object-cover rounded-[2px]"
          />
        </div>
      </button>
    </SmoothCorners>
  );
}

/** "Add Mobile Number" row with stc Pay logo. */
function AddMobileNumberCard() {
  return (
    <SmoothCorners
      radius={8}
      className="bg-white border-[1.074px] border-[rgba(38,42,51,0.1)] rounded-[8px] w-full flex items-center px-[12px] py-[16px]"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-[8px] items-center">
          <PlusIcon className="size-[18px]" />
          <p className="text-[#262a33] text-[14px] leading-[18px] tracking-[-0.14px]">
            Add Mobile Number
          </p>
        </div>
        <img
          src={stcPayLogo}
          alt="stc Pay"
          className="block h-[20px] w-[30px] rounded-[2px] object-cover"
        />
      </div>
    </SmoothCorners>
  );
}

/** Apple Pay row — unselected radio + label + Pay badge. */
function ApplePayCard() {
  return (
    <SmoothCorners
      radius={8}
      className="bg-white border-[1.074px] border-[rgba(38,42,51,0.1)] rounded-[8px] w-full flex items-center px-[12px] py-[16px]"
    >
      <div className="flex flex-1 items-center justify-between min-w-0">
        <div className="flex gap-[8px] items-center">
          <RadioUnselected />
          <p className="text-[#262a33] text-[14px] leading-[18px] tracking-[-0.14px]">
            Apple Pay
          </p>
        </div>
        <img
          src={applePayBadge}
          alt="Pay"
          className="block h-[20px] w-[30.4px] object-contain"
        />
      </div>
    </SmoothCorners>
  );
}

/* ---------- Screen ---------- */

export default function PaymentMethod({
  onBack,
  onPay,
}: {
  onBack: () => void;
  onPay?: () => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="bg-[#f2f2f4] relative w-[375px] h-[812px] mx-auto rounded-[20px] overflow-hidden">
      <StatusBar />
      <Header onBack={onBack} />

      {/* Payment options stack — top-aligned 113px from the top per Figma */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[113px] w-[343px] flex flex-col gap-[12px] items-end">
        <DebitCard onAddNewCard={() => setSheetOpen(true)} />
        <AddMobileNumberCard />
        <ApplePayCard />
      </div>

      {/* Sticky bottom bar with Pay CTA + home indicator */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-stretch z-20">
        <div className="bg-white flex flex-col items-center p-[16px] rounded-tl-[16px] rounded-tr-[16px]">
          <button
            type="button"
            onClick={onPay}
            className="bg-black text-white font-semibold text-[16px] leading-[20px] tracking-[-0.16px] h-[60px] w-full rounded-[12px] cursor-pointer"
          >
            Pay $24.99
          </button>
        </div>
        <div className="bg-white h-[24px] flex justify-center items-center">
          <div className="bg-[#262a33] h-[5px] w-[124px] rounded-[8px]" />
        </div>
      </div>

      {/* Add New Card bottom sheet — overlays this screen */}
      <AddNewCardSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAddCard={() => setSheetOpen(false)}
      />
    </div>
  );
}
