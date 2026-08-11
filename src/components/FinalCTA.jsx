import { useEffect, useRef, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
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

  const handleSubscribe = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
  };

  return (
    <section
      ref={sectionRef}
      className={`
        relative
        overflow-hidden
        border-b
        border-white/[0.08]
        bg-[#080809]
        px-5
        pt-16
        text-center
        transition-all
        duration-700
        ease-out
        sm:px-8
        lg:px-12
        lg:pt-20
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }
      `}
    >
      {/* Red glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[250px]
          w-[650px]
          -translate-x-1/2
          rounded-full
          bg-red-600/10
          blur-[100px]
        "
      />

      {/* CTA */}
      <div className="relative mx-auto max-w-[700px]">

        <h2 className="text-[27px] font-black leading-[1] tracking-[-1px] text-white sm:text-[34px]">
          READY FOR YOUR
          <br />
          NEXT MOVIE?
        </h2>

        <p className="mx-auto mt-3 max-w-[450px] text-[9px] leading-4 text-gray-400 sm:text-[10px]">
          Discover movies, choose your seats, and book your next cinema
          experience with QUICKBOOK.
        </p>

        {/* Buttons */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">

          <button
            type="button"
            onClick={() => navigate("/movies")}
            className="
              inline-flex
              h-[34px]
              items-center
              gap-1.5
              rounded-[9px]
              bg-[#ed1c24]
              px-4
              text-[9px]
              font-bold
              text-white
              transition
              hover:bg-[#d91820]
              active:scale-95
            "
          >
            Explore Movies
            <ArrowRight size={11} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/theaters")}
            className="
              inline-flex
              h-[34px]
              items-center
              gap-1.5
              rounded-[9px]
              border
              border-white/[0.12]
              bg-white/[0.03]
              px-4
              text-[9px]
              font-bold
              text-white
              transition
              hover:bg-white/[0.08]
              active:scale-95
            "
          >
            <MapPin size={11} />
            Find Cinemas
          </button>

        </div>
      </div>

      {/* Newsletter */}
      <div className="relative mt-16 border-t border-white/[0.08] bg-[#111113] px-5 py-10 sm:mt-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1000px] flex-col items-center justify-between gap-6 sm:flex-row">

          {/* Newsletter Content */}
          <div className="text-center sm:text-left">
            <h3 className="text-[18px] font-black tracking-tight text-white sm:text-[20px]">
              NEVER MISS A MOVIE
            </h3>

            <p className="mt-1 max-w-[350px] text-[8px] leading-4 text-gray-400 sm:text-[9px]">
              Get updates about new releases, exclusive offers,
              and upcoming movies.
            </p>
          </div>

          {/* Newsletter Form */}
          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-[320px] gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              disabled={subscribed}
              className="
                h-[34px]
                min-w-0
                flex-1
                rounded-[8px]
                border
                border-white/[0.12]
                bg-[#080809]
                px-3
                text-[9px]
                text-white
                outline-none
                placeholder:text-gray-600
                focus:border-red-500/50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

            <button
              type="submit"
              disabled={subscribed}
              className="
                h-[34px]
                shrink-0
                rounded-[8px]
                bg-[#ed1c24]
                px-3
                text-[9px]
                font-bold
                text-white
                transition
                hover:bg-[#d91820]
                active:scale-95
                disabled:cursor-default
                disabled:bg-zinc-700
                disabled:active:scale-100
              "
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;