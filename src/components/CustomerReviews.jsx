import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    text: "Booking tickets with QUICKBOOK is incredibly simple. The seat selection experience is smooth and fast.",
    name: "Aarav Mehta",
    city: "Mumbai",
    initial: "A",
  },
  {
    id: 2,
    text: "I can find movies and cinemas near me within seconds. Really clean experience.",
    name: "Sofia Alvarez",
    city: "Madrid",
    initial: "S",
  },
  {
    id: 3,
    text: "Selecting seats and completing the booking takes almost no time. No clutter, no confusion.",
    name: "Daniel Okoye",
    city: "London",
    initial: "D",
  },
  {
    id: 4,
    text: "The Friday-night rush used to be painful. Now I book from the car and walk straight in.",
    name: "Hana Sato",
    city: "Tokyo",
    initial: "H",
  },
  {
    id: 5,
    text: "Great offers on weekday shows, and the booking history makes reordering favorites effortless.",
    name: "Liam Novak",
    city: "Berlin",
    initial: "L",
  },
  {
    id: 6,
    text: "Beautiful interface, genuinely feels like part of the cinema experience, not just a checkout.",
    name: "Priya Nair",
    city: "Bengaluru",
    initial: "P",
  },
];

const CustomerReviews = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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
        threshold: 0.12,
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
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }
      `}
    >
      <div className="mx-auto max-w-[1400px]">

        {/* Header */}
        <div className="mb-7">
          <h2 className="text-[27px] font-black tracking-[-1px] text-white sm:text-[34px]">
            HAPPY CUSTOMERS
          </h2>

          <p className="mt-1 text-[10px] text-gray-400 sm:text-[11px]">
            Hear what moviegoers have to say about QUICKBOOK.
          </p>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`
                rounded-[10px]
                border
                border-white/[0.10]
                bg-[#18181b]
                p-4
                transition-all
                duration-500
                hover:border-red-500/30
                hover:bg-[#1b1b1e]
                ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }
              `}
              style={{
                transitionDelay: `${index * 80}ms`,
              }}
            >
              {/* Quote number */}
              <span className="text-[8px] font-bold text-[#ed1c24]">
                0{review.id}
              </span>

              {/* Stars */}
              <div className="mt-2 flex gap-[2px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={8}
                    fill="currentColor"
                    className="text-[#ed1c24]"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="mt-3 min-h-[48px] text-[9px] leading-4 text-gray-300">
                "{review.text}"
              </p>

              {/* Divider */}
              <div className="my-3 border-t border-white/[0.08]" />

              {/* User */}
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ed1c24]/20 text-[7px] font-bold text-red-400">
                  {review.initial}
                </div>

                <div>
                  <p className="text-[8px] font-bold text-white">
                    {review.name}
                  </p>

                  <p className="text-[7px] text-gray-500">
                    {review.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomerReviews;