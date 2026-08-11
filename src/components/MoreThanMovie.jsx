import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import poster1 from "../../utils/images/poster1.jpg";
import poster2 from "../../utils/images/poster2.jpg";

const MoreThanMovie = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Run animation only once
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

  return (
    <section
      ref={sectionRef}
      className={`
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

        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-[30px] font-black tracking-[-1px] text-white sm:text-[36px]">
            MORE THAN JUST A MOVIE
          </h2>

          <p className="mt-2 text-[13px] text-gray-400 sm:text-[14px]">
            Premium screens, better seats and offers worth showing up for.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">

          {/* Movie Night */}
          <div
            className="
              group
              relative
              min-h-[345px]
              overflow-hidden
              rounded-[18px]
              border
              border-white/[0.10]
              bg-[#111113]
              sm:min-h-[365px]
            "
          >
            <img
              src={poster1}
              alt="Movie Night Made Better"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <h3 className="text-[23px] font-bold text-white sm:text-[25px]">
                Movie Night Made Better
              </h3>

              <p className="mt-2 max-w-[400px] text-[12px] leading-5 text-gray-300 sm:text-[13px]">
                Book your favorite movies and enjoy a seamless cinema
                experience.
              </p>

              <button
                type="button"
                className="
                  mt-4
                  inline-flex
                  h-[39px]
                  items-center
                  gap-2
                  rounded-[12px]
                  bg-[#ed1c24]
                  px-4
                  text-[12px]
                  font-bold
                  text-white
                  transition
                  duration-200
                  hover:bg-[#d91820]
                  active:scale-95
                "
              >
                Explore Movies
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Offers */}
          <div
            className="
              group
              relative
              min-h-[345px]
              overflow-hidden
              rounded-[18px]
              border
              border-white/[0.10]
              bg-[#111113]
              sm:min-h-[365px]
            "
          >
            <img
              src={poster2}
              alt="Exclusive Quickbook Offers"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/10" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <h3 className="text-[23px] font-bold text-white sm:text-[25px]">
                Exclusive QUICKBOOK Offers
              </h3>

              <p className="mt-2 max-w-[400px] text-[12px] leading-5 text-gray-300 sm:text-[13px]">
                Discover special ticket deals and limited-time offers.
              </p>

              <button
                type="button"
                className="
                  mt-4
                  inline-flex
                  h-[39px]
                  items-center
                  gap-2
                  rounded-[12px]
                  bg-[#ed1c24]
                  px-4
                  text-[12px]
                  font-bold
                  text-white
                  transition
                  duration-200
                  hover:bg-[#d91820]
                  active:scale-95
                "
              >
                View Offers
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MoreThanMovie;