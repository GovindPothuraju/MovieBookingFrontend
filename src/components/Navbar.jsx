import { Film, User, LogOut, Menu, X, Clapperboard, Ticket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/user/logout`,
        {},
        { withCredentials: true }
      );

      setMenuOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(
        "Logout failed:",
        error?.response?.data?.message || error.message
      );
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-[1400px] -translate-x-1/2">
      <div className="relative">

        {/* Navbar */}
        <div className="flex h-[70px] items-center rounded-[22px] border border-white/10 bg-[#111113]/95 px-3 shadow-2xl backdrop-blur-xl sm:px-5">

          {/* Logo */}
          <Link
            to="/home"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#ed1c24]">
              <Film
                size={21}
                strokeWidth={2.5}
                className="text-white"
              />
            </div>

            <span className="hidden text-[18px] font-extrabold tracking-[2px] text-white sm:block">
              QUICKBOOK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="ml-6 hidden items-center gap-7 md:flex lg:ml-10 lg:gap-9">

            <Link
              to="/home"
              className="text-[15px] font-medium text-gray-300 transition hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/movies"
              className="text-[15px] font-medium text-gray-300 transition hover:text-white"
            >
              Movies
            </Link>

            <Link
              to="/theaters"
              className="text-[15px] font-medium text-gray-300 transition hover:text-white"
            >
              Theaters
            </Link>

            <Link
              to="/bookings"
              className="text-[15px] font-medium text-gray-300 transition hover:text-white"
            >
              My Booking
            </Link>

          </div>

          {/* Desktop Right Side */}
          <div className="ml-auto hidden items-center gap-2 md:flex sm:gap-3">

            <Link
              to="/profile"
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-[12px]
                border
                border-white/10
                bg-white/[0.03]
                px-3
                text-gray-300
                transition
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              <User size={18} />

              <span className="text-[14px] font-medium">
                Profile
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-[12px]
                bg-[#ed1c24]
                px-3
                text-white
                transition
                hover:bg-[#d91820]
                active:scale-95
              "
            >
              <LogOut size={17} />

              <span className="text-[14px] font-semibold">
                Logout
              </span>
            </button>

          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              ml-auto
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-[13px]
              border
              border-white/10
              bg-white/[0.04]
              text-white
              transition
              hover:bg-white/[0.08]
              md:hidden
            "
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="
              mt-2
              overflow-hidden
              rounded-[20px]
              border
              border-white/10
              bg-[#111113]/98
              p-2
              shadow-2xl
              backdrop-blur-xl
              md:hidden
            "
          >

            {/* Home */}
            <Link
              to="/home"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                rounded-[13px]
                px-4
                py-3
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              <Film size={18} />
              Home
            </Link>

            {/* Movies */}
            <Link
              to="/movies"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                rounded-[13px]
                px-4
                py-3
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              <Clapperboard size={18} />
              Movies
            </Link>

            {/* Theaters */}
            <Link
              to="/theaters"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                rounded-[13px]
                px-4
                py-3
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              <Ticket size={18} />
              Theaters
            </Link>

            {/* My Booking */}
            <Link
              to="/bookings"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                rounded-[13px]
                px-4
                py-3
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              <Ticket size={18} />
              My Booking
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                rounded-[13px]
                px-4
                py-3
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              <User size={18} />
              Profile
            </Link>

            {/* Divider */}
            <div className="my-2 border-t border-white/10" />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-[13px]
                px-4
                py-3
                text-left
                text-sm
                font-semibold
                text-red-500
                transition
                hover:bg-red-500/10
              "
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;