import cap from "../assets/cap.svg";
import wifi from "../assets/wifi.svg";
import cellular from "../assets/cellular.svg";

/**
 * iPhone-style status bar (9:41 / cellular / wifi / battery). Absolutely
 * positioned at the top-left of its parent — the parent must be relative.
 */
export default function StatusBar() {
  return (
    <div className="absolute h-[42.565px] left-0 top-0 w-[375px] z-10">
      <div className="absolute h-[21px] left-[21px] top-[7px] w-[54px]">
        <p className="-translate-x-1/2 absolute font-semibold leading-none left-[27px] text-[15px] text-black text-center top-[calc(50%-3.5px)] tracking-[-0.3px] w-[54px]">
          9:41
        </p>
      </div>
      <div className="absolute inset-[40.15%_17.07%_35.61%_78.4%]">
        <img alt="" className="absolute block inset-0 w-full h-full" src={cellular} />
      </div>
      <div className="absolute inset-[39.39%_11.64%_35.61%_84.27%]">
        <img alt="" className="absolute block inset-0 w-full h-full" src={wifi} />
      </div>
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
