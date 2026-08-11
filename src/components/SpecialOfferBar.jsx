import { Sparkles, ArrowRight } from "lucide-react";

const SpecialOfferBar = () => {
  return (
    <div className="border-y border-white/[0.06] bg-gradient-to-r from-[#160809] via-[#1d0a0b] to-[#100607]">
      <div className="mx-auto flex min-h-[44px] max-w-[1400px] items-center justify-center px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] sm:text-[13px]">
          <Sparkles
            size={15}
            className="text-[#ed1c24]"
          />

          <span className="font-semibold text-white">
            Special Offer:
          </span>

          <span className="text-gray-400">
            Book your movie tickets today and enjoy exclusive offers.
          </span>

          <button
            type="button"
            className="group flex items-center gap-1 font-semibold text-[#ed1c24] transition hover:text-red-400"
          >
            Learn More
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferBar;