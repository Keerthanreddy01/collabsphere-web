import { HTMLAttributes } from "react";

export interface IphoneProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
}

export function Iphone({ src, className, ...props }: IphoneProps) {
  return (
    <div
      className={`relative inline-block w-full aspect-[434/882] select-none ${className || ""}`}
      {...props}
    >
      {/* Clean Premium Magic UI Frame */}
      <div className="relative w-full h-full rounded-[48px] p-3 bg-[#1a1c20] border-[3px] border-[#383d46] shadow-[0_30px_70px_rgba(0,0,0,0.55)] flex flex-col justify-between">
        
        {/* Left Side Buttons */}
        <div className="absolute -left-[4px] top-24 w-[2.5px] h-6 bg-[#383d46] rounded-l-md" />
        <div className="absolute -left-[4px] top-36 w-[2.5px] h-10 bg-[#383d46] rounded-l-md" />
        <div className="absolute -left-[4px] top-50 w-[2.5px] h-10 bg-[#383d46] rounded-l-md" />
        {/* Right Power Button */}
        <div className="absolute -right-[4px] top-32 w-[2.5px] h-14 bg-[#383d46] rounded-r-md" />

        {/* Screen Slot Container - NOTHING inside except the image */}
        <div className="relative w-full h-full rounded-[38px] bg-black overflow-hidden flex items-center justify-center">
          
          {/* Dynamic Island Notch Cutout */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-black rounded-full border border-white/10 flex items-center justify-end px-2 gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          {/* Screen Image ONLY */}
          {src ? (
            <img
              src={src}
              alt="iPhone Screen"
              className="w-full h-full object-cover rounded-[36px]"
            />
          ) : (
            <div className="w-full h-full bg-[#111215] flex flex-col items-center justify-center text-white/40 font-mono text-xs text-center p-6 select-none">
              <span className="text-sm font-semibold tracking-wider text-white/60 mb-1">[MY IMAGE HERE]</span>
              <span className="text-[10px] text-white/30">Pass your image URL to src</span>
            </div>
          )}

          {/* Home Bar Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-16 h-1 rounded-full bg-white/30" />
        </div>

      </div>
    </div>
  );
}
