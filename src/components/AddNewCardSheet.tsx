import { useState } from "react";
import SmoothCorners from "./SmoothCorners";
import visaLogoLarge from "../assets/visa-logo-large.svg";
import mastercardLogoLarge from "../assets/mastercard-logo-large.svg";
import amexLogoLarge from "../assets/amex-logo-large.png";

/* ---------- Inline icons ---------- */

function XCircle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#d0d4dd" />
      <path
        d="M7 7l6 6M13 7l-6 6"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckmarkBox({ checked }: { checked: boolean }) {
  return checked ? (
    <div className="size-[16px] rounded-[4px] bg-[#3866df] flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 12 12"
        className="block size-[10px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M2.5 6L5 8.5L9.5 3.5"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ) : (
    <div className="size-[16px] rounded-[4px] border-[1.5px] border-[#d0d4dd] bg-white shrink-0" />
  );
}

/* ---------- Field primitives ---------- */

function FieldLabel({
  label,
  required,
  optional,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <p className="font-medium text-[14px] leading-[18px] tracking-[-0.14px] text-[#939393] flex gap-[2px] items-start">
      <span>{label}</span>
      {required && <span className="text-[#f43333]">*</span>}
      {optional && (
        <span className="font-normal text-[#959595] text-[14px] leading-[18px] tracking-[-0.14px]">
          {" (Optional)"}
        </span>
      )}
    </p>
  );
}

function FieldBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#ebebeb] rounded-[12px] h-[48px] flex items-center pl-[14px] pr-[10px] py-[12px] gap-[2px]">
      {children}
    </div>
  );
}

/* ---------- Sheet ---------- */

export default function AddNewCardSheet({
  open,
  onClose,
  onAddCard,
}: {
  open: boolean;
  onClose: () => void;
  onAddCard: () => void;
}) {
  const [cardNumber, setCardNumber] = useState("1234 1234 1234 1234");
  const [expiry, setExpiry] = useState("08 / 28");
  const [cvv, setCvv] = useState("199");
  const [nameOnCard, setNameOnCard] = useState("Yomna Yassin");
  const [cardTitle, setCardTitle] = useState("Yomna New");
  const [remember, setRemember] = useState(true);

  return (
    <>
      {/* Backdrop — dims the screen behind, dismisses on tap */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 z-30 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-label="Add new card"
        className={`absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-[20px] flex flex-col transition-transform duration-200 ease-out max-h-[92%] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag indicator */}
        <div className="flex justify-center items-center px-[16px] py-[8px] h-[20px]">
          <div className="bg-[#d0d5dd] h-[4px] w-[34px] rounded-full" />
        </div>

        {/* Header — title + accepted card brands */}
        <div className="flex items-center justify-between px-[24px] pt-[12px] pb-[12px] w-full">
          <p className="font-bold text-[16px] leading-[20px] tracking-[-0.16px] text-[#0e0e0e]">
            Add New Card
          </p>
          <div className="flex gap-[11px] h-[24px] items-center">
            <img
              src={visaLogoLarge}
              alt="Visa"
              className="block h-[24px] w-[40px] object-contain"
            />
            <img
              src={mastercardLogoLarge}
              alt="Mastercard"
              className="block h-[24px] w-[40px] object-contain"
            />
            <img
              src={amexLogoLarge}
              alt="American Express"
              className="block h-[24px] w-[40px] object-contain"
            />
          </div>
        </div>

        {/* Form area — light gray background, scrollable */}
        <div className="bg-[#f2f3f7] overflow-y-auto">
          <div className="p-[12px]">
            <SmoothCorners
              radius={12}
              className="bg-white rounded-[12px] py-[8px] flex flex-col"
            >
              {/* Card details */}
              <div className="flex flex-col gap-[16px] p-[12px]">
                {/* Card number */}
                <div className="flex flex-col gap-[4px]">
                  <FieldLabel label="Card number" required />
                  <FieldBox>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="flex-1 min-w-0 bg-transparent border-none outline-none font-medium text-[14px] leading-[18px] tracking-[-0.14px] text-[#0e0e0e]"
                    />
                    {cardNumber !== "" && (
                      <button
                        type="button"
                        onClick={() => setCardNumber("")}
                        aria-label="Clear card number"
                        className="shrink-0 cursor-pointer"
                      >
                        <XCircle className="size-[20px]" />
                      </button>
                    )}
                  </FieldBox>
                </div>

                {/* Expiry + CVV side by side */}
                <div className="flex gap-[16px]">
                  <div className="flex-1 flex flex-col gap-[4px]">
                    <FieldLabel label="Expiry" required />
                    <FieldBox>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent border-none outline-none font-medium text-[14px] leading-[18px] tracking-[-0.14px] text-[#0e0e0e]"
                      />
                    </FieldBox>
                  </div>
                  <div className="flex-1 flex flex-col gap-[4px]">
                    <FieldLabel label="CVV" required />
                    <FieldBox>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        className="flex-1 min-w-0 bg-transparent border-none outline-none font-medium text-[14px] leading-[18px] tracking-[-0.14px] text-[#0e0e0e]"
                      />
                    </FieldBox>
                  </div>
                </div>

                {/* Name on Card */}
                <div className="flex flex-col gap-[4px]">
                  <FieldLabel label="Name on Card" required />
                  <FieldBox>
                    <input
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      className="flex-1 min-w-0 bg-transparent border-none outline-none font-medium text-[14px] leading-[18px] tracking-[-0.14px] text-[#0e0e0e]"
                    />
                  </FieldBox>
                </div>

                {/* Card Title (Optional) + helper text */}
                <div className="flex flex-col gap-[4px]">
                  <FieldLabel label="Card Title" optional />
                  <FieldBox>
                    <input
                      type="text"
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      className="flex-1 min-w-0 bg-transparent border-none outline-none font-medium text-[14px] leading-[18px] tracking-[-0.14px] text-[#0e0e0e]"
                    />
                  </FieldBox>
                  <p className="pl-[4px] font-medium text-[12px] leading-[14px] tracking-[-0.12px] text-[#959595]">
                    This can help you identify cards easier on checkout
                  </p>
                </div>
              </div>

              {/* Remember card */}
              <div className="flex flex-col gap-[6px] p-[12px]">
                <button
                  type="button"
                  onClick={() => setRemember((v) => !v)}
                  className="flex gap-[6px] items-center cursor-pointer"
                >
                  <CheckmarkBox checked={remember} />
                  <p className="font-medium text-[14px] leading-[18px] tracking-[-0.14px] text-[#404553]">
                    Remember this card
                  </p>
                </button>
                <p className="font-normal text-[12px] leading-[14px] tracking-[-0.12px] text-[#7e859b]">
                  noon will securely store this card for a faster payment
                  experience. Your CVV number will not be stored.
                </p>
              </div>
            </SmoothCorners>
          </div>
        </div>

        {/* Sticky CTA + home indicator */}
        <div className="bg-white drop-shadow-[0px_-2px_2px_rgba(0,0,0,0.08)] flex flex-col items-center pt-[12px] px-[12px]">
          <button
            type="button"
            onClick={onAddCard}
            className="bg-[#0076ff] h-[48px] w-full rounded-[12px] flex items-center justify-center px-[24px] py-[14px] cursor-pointer"
          >
            <p className="font-semibold text-[16px] leading-[20px] tracking-[-0.16px] text-white">
              Add Card
            </p>
          </button>
          <div className="h-[34px] w-full relative">
            <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 bg-black h-[5px] w-[134px] rounded-[100px]" />
          </div>
        </div>
      </div>
    </>
  );
}
