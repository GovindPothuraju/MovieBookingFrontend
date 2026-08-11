import { Film } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#080809] text-white">

      {/* Main Footer */}
      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px]">

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">

            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">

              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#ed1c24]">
                  <Film
                    size={14}
                    strokeWidth={2.5}
                  />
                </div>

                <span className="text-[11px] font-extrabold tracking-[1px]">
                  QUICKBOOK
                </span>
              </Link>

              <p className="mt-3 max-w-[220px] text-[8px] leading-4 text-gray-500">
                Your simple and smart way to discover movies, find cinemas,
                and book tickets online.
              </p>

              {/* Social */}
              <div className="mt-4 flex gap-2">
        <button
              type="button"
              aria-label="Instagram"
              className="
                flex h-6 w-6 items-center justify-center
                rounded-[6px]
                border border-white/[0.10]
                text-[8px] font-bold text-gray-500
                transition
                hover:border-red-500/40
                hover:text-white
              "
            >
              IG
            </button>

            <button
              type="button"
              aria-label="Twitter"
              className="
                flex h-6 w-6 items-center justify-center
                rounded-[6px]
                border border-white/[0.10]
                text-[8px] font-bold text-gray-500
                transition
                hover:border-red-500/40
                hover:text-white
              "
            >
              X
            </button>

            <button
              type="button"
              aria-label="YouTube"
              className="
                flex h-6 w-6 items-center justify-center
                rounded-[6px]
                border border-white/[0.10]
                text-[8px] font-bold text-gray-500
                transition
                hover:border-red-500/40
                hover:text-white
              "
            >
              YT
            </button>
          </div>
                      </div>

            {/* QUICKBOOK */}
            <FooterColumn
              title="QUICKBOOK"
              links={[
                ["About Us", "/about"],
                ["Contact", "/contact"],
                ["Careers", "/careers"],
              ]}
            />

            {/* MOVIES */}
            <FooterColumn
              title="MOVIES"
              links={[
                ["Now Showing", "/movies"],
                ["Coming Soon", "/coming-soon"],
                ["Top Movies", "/movies"],
              ]}
            />

            {/* SUPPORT */}
            <FooterColumn
              title="SUPPORT"
              links={[
                ["Help Center", "/help"],
                ["FAQs", "/faq"],
                ["Cancellation Policy", "/cancellation-policy"],
              ]}
            />

            {/* LEGAL */}
            <FooterColumn
              title="LEGAL"
              links={[
                ["Privacy Policy", "/privacy-policy"],
                ["Terms & Conditions", "/terms"],
              ]}
            />

          </div>

          {/* Bottom */}
          <div className="mt-8 border-t border-white/[0.08] pt-3">
            <p className="text-[7px] text-gray-600 sm:text-[8px]">
              © 2026 QUICKBOOK. All rights reserved.
            </p>
          </div>

        </div>
      </section>

    </footer>
  );
};


/* Footer Link Column */
const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-[8px] font-bold tracking-[0.5px] text-white">
        {title}
      </h3>

      <div className="mt-3 flex flex-col gap-2">
        {links.map(([label, path]) => (
          <Link
            key={label}
            to={path}
            className="
              text-[8px]
              text-gray-500
              transition
              hover:text-white
            "
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;