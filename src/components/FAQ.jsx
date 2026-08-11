import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is QUICKBOOK?",
    answer:
      "QUICKBOOK is a simple movie ticket booking platform that lets you discover movies, choose cinemas, select seats and book tickets online.",
  },
  {
    question: "How can I book a movie ticket?",
    answer:
      "Choose a movie, select your preferred cinema and showtime, choose your seats and complete the payment to receive your digital ticket.",
  },
  {
    question: "Can I choose my preferred seats?",
    answer:
      "Yes. Available seats are displayed during the booking process and you can select the seats you prefer before confirming your booking.",
  },
  {
    question: "Can I modify my booking?",
    answer:
      "Booking modifications depend on the show's cancellation and modification policy. Check your booking details for the available options.",
  },
  {
    question: "How do I cancel my ticket?",
    answer:
      "Open your booking details and select the cancellation option if your booking is eligible according to the applicable cancellation policy.",
  },
  {
    question: "How can I view my booking history?",
    answer:
      "You can view your previous and upcoming bookings from your account's booking history section.",
  },
];

const FAQ = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

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

  const toggleFAQ = (index) => {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  };

  return (
    <section
      ref={sectionRef}
      className={`
        border-y
        border-white/[0.08]
        bg-[#101011]
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
        <div className="text-center">
          <h2 className="text-[23px] font-black tracking-[-0.7px] text-white sm:text-[28px]">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <p className="mt-2 text-[9px] text-gray-400 sm:text-[10px]">
            Find answers to the most common QUICKBOOK questions.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mx-auto mt-7 max-w-[650px] space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`
                  overflow-hidden
                  rounded-[10px]
                  border
                  border-white/[0.10]
                  bg-[#18181b]
                  transition-all
                  duration-300
                  ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }
                `}
                style={{
                  transitionDelay: `${index * 60}ms`,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                >
                  <span className="text-[9px] font-semibold text-white sm:text-[10px]">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={12}
                    className={`
                      shrink-0
                      text-[#ed1c24]
                      transition-transform
                      duration-300
                      ${isOpen ? "rotate-180" : ""}
                    `}
                  />
                </button>

                <div
                  className={`
                    grid transition-all duration-300
                    ${
                      isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }
                  `}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-[9px] leading-4 text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      
    </section>
  );
};

export default FAQ;