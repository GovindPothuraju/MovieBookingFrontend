import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          to="/movies"
          className="text-3xl font-bold text-white"
        >
          <span className="text-red-500">Q</span>uickBook
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 rounded-full border border-white/10 bg-white/10 px-8 py-4 backdrop-blur-xl">
          <Link
            to="/movies"
            className="font-medium text-white transition hover:text-red-400"
          >
            Home
          </Link>

          <Link
            to="/movies"
            className="font-medium text-white transition hover:text-red-400"
          >
            Movies
          </Link>

          <Link
            to="/theaters"
            className="font-medium text-white transition hover:text-red-400"
          >
            Theaters
          </Link>

          <Link
            to="/bookings"
            className="font-medium text-white transition hover:text-red-400"
          >
            My Bookings
          </Link>

          <Link
            to="/releases"
            className="font-medium text-white transition hover:text-red-400"
          >
            Releases
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-5">
          <button className="text-white transition hover:text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.04 6.04a7.5 7.5 0 0 0 10.61 10.61Z"
              />
            </svg>
          </button>

          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="user"
            className="h-10 w-10 rounded-full border border-white/20 object-cover"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/80 p-5 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-5">
            <Link
              to="/movies"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              Home
            </Link>

            <Link
              to="/movies"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              Movies
            </Link>

            <Link
              to="/theaters"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              Theaters
            </Link>

            <Link
              to="/bookings"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              My Bookings
            </Link>

            <Link
              to="/releases"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              Releases
            </Link>

            <div className="flex items-center gap-4 pt-3 border-t border-white/10">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="user"
                className="h-10 w-10 rounded-full object-cover"
              />

              <span className="text-white">
                Govind Pothuraju
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;