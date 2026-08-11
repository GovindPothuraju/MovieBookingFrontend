import { useEffect, useRef, useState } from "react";
import { Ticket } from "lucide-react";

import poster3 from "../../utils/images/poster3.jpg";

const BookingProcess = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: "01",
      title: "Choose a Movie",
      description: "Browse what's showing near you right now.",
    },
    {
      number: "02",
      title: "Select Cinema & Seats",
      description: "Pick the screen, showtime and your seats.",
    },
    {
      number: "03",
      title: "Confirm & Enjoy",
      description: "Pay securely and walk in with a digital ticket.",
    },
  ];

  const cinemas = [
    "CINEVERSE",
    "AURORA IMAX",
    "REELHOUSE",
    "NOVA SCREENS",
    "GRAND PALACE",
    "ATLAS CINEMAS",
  ];

  return (
    <section
      ref={sectionRef}
      className={`
        overflow-hidden
        bg-[#080809]
        px-5
        py-16
        transition-all
        duration-700
        ease-out
        sm:px-8
        lg:px-12
        lg:py-20
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }
      `}
    >
      <div className="mx-auto max-w-[1400px]">

        {/* Booking Process */}
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-9">

          {/* Image */}
          <div className="group relative overflow-hidden rounded-[16px] border border-white/[0.10]">
            <img
              src={poster3}
              alt="Book movie tickets"
              className="
                h-[260px]
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
                sm:h-[340px]
                lg:h-[350px]
              "
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div>
            <h2 className="max-w-[420px] text-[27px] font-black leading-[1.05] tracking-[-1px] text-white sm:text-[32px]">
              BOOK TICKETS IN JUST A
              <br />
              FEW CLICKS
            </h2>

            <p className="mt-4 max-w-[520px] text-[11px] leading-5 text-gray-400 sm:text-[12px]">
              Find your movie, choose your cinema, select your seats, and
              confirm your booking. QUICKBOOK makes movie booking simple and
              fast.
            </p>

            {/* Steps */}
            <div className="mt-5 space-y-2.5">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="
                    rounded-[12px]
                    border
                    border-white/[0.09]
                    bg-[#18181b]
                    px-3
                    py-3
                    transition
                    duration-300
                    hover:border-red-500/30
                    hover:bg-[#1c1c1f]
                  "
                >
                  <div className="flex items-start gap-3">

                    {/* Number */}
                    <span className="pt-0.5 text-[10px] font-bold text-[#ed1c24]">
                      {step.number}
                    </span>

                    {/* Text */}
                    <div>
                      <h3 className="text-[10px] font-bold text-white sm:text-[11px]">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-[9px] text-gray-400 sm:text-[10px]">
                        {step.description}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Button */}
            <button
              type="button"
              className="
                mt-5
                inline-flex
                h-[34px]
                items-center
                gap-2
                rounded-[10px]
                bg-[#ed1c24]
                px-4
                text-[10px]
                font-bold
                text-white
                transition
                duration-200
                hover:bg-[#d91820]
                active:scale-95
              "
            >
              <Ticket size={12} />

              Book Movie Tickets
            </button>
          </div>
        </div>

        {/* Cinema Partners */}
        <div className="mt-20 text-center sm:mt-24">

          <h2 className="text-[23px] font-black tracking-[-0.7px] text-white sm:text-[26px]">
            YOUR FAVORITE MOVIES. ONE PLACE.
          </h2>

          <p className="mx-auto mt-2 max-w-[550px] text-[9px] text-gray-400 sm:text-[10px]">
            QUICKBOOK partners with leading cinema chains across 150+
            locations.
          </p>

          {/* Cinema List */}
          <div className="mt-7 overflow-hidden rounded-[14px] border border-white/[0.12]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {cinemas.map((cinema, index) => (
                <div
                  key={cinema}
                  className={`
                    flex
                    h-[54px]
                    items-center
                    justify-center
                    px-3
                    text-center
                    text-[8px]
                    font-medium
                    tracking-[2px]
                    text-gray-500
                    transition
                    duration-300
                    hover:bg-white/[0.03]
                    hover:text-gray-300
                    ${
                      index !== cinemas.length - 1
                        ? "border-b border-white/[0.08] sm:border-b-0"
                        : ""
                    }
                    ${
                      index % 2 !== 1
                        ? "sm:border-r sm:border-white/[0.08]"
                        : ""
                    }
                    lg:border-r
                    lg:border-white/[0.08]
                    lg:last:border-r-0
                  `}
                >
                  {cinema}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BookingProcess;
