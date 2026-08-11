import { ArrowRight, MapPin, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/utils/images/backgroundHome.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Left Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[#050506] to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] items-center px-5 pb-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-[850px]">
          {/* Small Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/[0.08] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#ef3037]" />

            <span className="text-[11px] font-bold tracking-[2.5px] text-[#ff5b60] sm:text-xs">
              NOW BOOKING · 150+ CINEMAS
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-[850px] text-[48px] font-black leading-[0.98] tracking-[-2px] text-white sm:text-[64px] md:text-[76px] lg:text-[88px]">
            BOOK YOUR MOVIE
            <br />
            TICKETS{" "}
            <span className="bg-gradient-to-r from-white via-[#ffb0b3] to-[#ff656b] bg-clip-text text-transparent">
              NOW
            </span>
            <span className="text-[#ff4b51]">.</span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-[700px] text-[17px] leading-8 text-gray-300 sm:text-[19px]">
            Discover the latest movies, find your favorite cinema, choose your
            seats, and book your tickets in seconds.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/movies"
              className="group flex h-[60px] items-center justify-center gap-3 rounded-[17px] bg-[#ed1c24] px-7 text-[16px] font-bold text-white transition duration-200 hover:bg-[#d91820] active:scale-[0.98]"
            >
              <Play
                size={19}
                fill="currentColor"
                className="transition-transform group-hover:scale-110"
              />
              <span>Explore Movies</span>
            </a>

            <a
              href="/cinemas"
              className="group flex h-[60px] items-center justify-center gap-3 rounded-[17px] border border-white/10 bg-white/[0.04] px-7 text-[16px] font-bold text-white backdrop-blur-sm transition duration-200 hover:bg-white/10 active:scale-[0.98]"
            >
              <MapPin size={19} />
              <span>Find Cinemas</span>
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* Statistics */}
          <div className="mt-14 border-t border-white/10 pt-9">
            <div className="grid max-w-[650px] grid-cols-3 gap-5">
              <div>
                <div className="text-[28px] font-black leading-none text-white sm:text-[36px]">
                  500<span className="text-[#ed1c24]">+</span>
                </div>
                <p className="mt-2 text-[12px] text-gray-400 sm:text-[15px]">
                  Movies Available
                </p>
              </div>

              <div>
                <div className="text-[28px] font-black leading-none text-white sm:text-[36px]">
                  150<span className="text-[#ed1c24]">+</span>
                </div>
                <p className="mt-2 text-[12px] text-gray-400 sm:text-[15px]">
                  Cinema Locations
                </p>
              </div>

              <div>
                <div className="text-[28px] font-black leading-none text-white sm:text-[36px]">
                  1M<span className="text-[#ed1c24]">+</span>
                </div>
                <p className="mt-2 text-[12px] text-gray-400 sm:text-[15px]">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;