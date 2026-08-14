import { Clock3, Star, Ticket, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const title = movie?.title || "Untitled Movie";
  const poster = movie?.posterUrl || "";
  const rating = movie?.rating ?? "0";

  const genre = Array.isArray(movie?.genres)
    ? movie.genres.slice(0, 2).join(" · ")
    : "Drama";

  const duration = movie?.duration ? `${movie.duration}m` : "N/A";

  const handleBookTickets = () => {
    if (!movie?.slug) return;
    navigate(`/movies/${movie.slug}`);
  };

  return (
    <article
      className="
        movie-card
        group
        w-[160px]
        shrink-0
        sm:w-[185px]
        md:w-[210px]
        lg:w-[225px]
        xl:w-[235px]
      "
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-[20px]
          border
          border-white/[0.10]
          bg-[#141416]
          shadow-[0_10px_30px_rgba(0,0,0,0.25)]
          transition-all
          duration-500
          ease-out

          group-hover:-translate-y-2
          group-hover:border-[#ed1c24]/50
          group-hover:shadow-[0_20px_50px_rgba(237,28,36,0.18)]
        "
      >
        {/* ================= POSTER ================= */}

        <div
          className="
            relative
            h-[230px]
            overflow-hidden
            sm:h-[265px]
            md:h-[300px]
            lg:h-[320px]
            xl:h-[335px]
          "
        >
          {poster ? (
            <img
              src={poster}
              alt={title}
              loading="lazy"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.08]
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                items-center
                justify-center
                bg-[#0d0d0f]
                text-xs
                text-gray-500
              "
            >
              No Image
            </div>
          )}

          {/* Dark cinematic gradient */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#141416]
              via-[#141416]/10
              to-transparent
              opacity-90
            "
          />

          {/* Top black gradient */}
          <div
            className="
              absolute
              inset-x-0
              top-0
              h-24
              bg-gradient-to-b
              from-black/50
              to-transparent
            "
          />

          {/* ================= RATING ================= */}

          <div
            className="
              absolute
              left-3
              top-3
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/10
              bg-black/70
              px-2.5
              py-1.5
              shadow-lg
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:border-[#ed1c24]/40
              group-hover:bg-black/80
            "
          >
            <Star
              size={12}
              fill="currentColor"
              className="text-[#ed1c24]"
            />

            <span className="text-[11px] font-bold text-white">
              {rating}
            </span>
          </div>

          {/* ================= HOVER SHINE ================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              -translate-x-[120%]
              bg-gradient-to-r
              from-transparent
              via-white/[0.10]
              to-transparent
              skew-x-[-20deg]
              transition-transform
              duration-1000
              ease-out
              group-hover:translate-x-[120%]
            "
          />

          {/* ================= MOVIE TITLE ON POSTER ================= */}

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              px-4
              pb-4
            "
          >
            <h3
              title={title}
              className="
                line-clamp-2
                text-[14px]
                font-bold
                leading-tight
                text-white
                drop-shadow-lg
                sm:text-[15px]
                md:text-[16px]
              "
            >
              {title}
            </h3>
          </div>
        </div>

        {/* ================= DETAILS ================= */}

        <div className="px-3.5 pb-3.5 pt-3">
          {/* Genre */}

          <p
            title={genre}
            className="
              truncate
              text-[10px]
              font-medium
              uppercase
              tracking-wide
              text-gray-500
              sm:text-[11px]
            "
          >
            {genre}
          </p>

          {/* Duration */}

          <div
            className="
              mt-2
              flex
              items-center
              gap-1.5
              text-[10px]
              text-gray-400
              sm:text-[11px]
            "
          >
            <Clock3 size={12} className="text-gray-500" />

            <span>{duration}</span>

            <span className="mx-1 text-gray-700">•</span>

            <span className="text-gray-500">
              Movie
            </span>
          </div>

          {/* ================= BOOK BUTTON ================= */}

          <button
            type="button"
            onClick={handleBookTickets}
            disabled={!movie?.slug}
            className="
              group/btn
              relative
              mt-3
              flex
              h-[38px]
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-xl
              border
              border-[#ed1c24]/30
              bg-[#ed1c24]/10
              text-[11px]
              font-bold
              text-white
              transition-all
              duration-300

              hover:border-[#ed1c24]
              hover:bg-[#ed1c24]
              hover:shadow-[0_8px_25px_rgba(237,28,36,0.25)]

              active:scale-[0.97]

              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {/* Button shine */}

            <span
              className="
                absolute
                inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent
                via-white/20
                to-transparent
                transition-transform
                duration-700
                group-hover/btn:translate-x-full
              "
            />

            <Ticket
              size={14}
              className="
                relative
                transition-transform
                duration-300
                group-hover/btn:-rotate-6
                group-hover/btn:scale-110
              "
            />

            <span className="relative">
              Book Tickets
            </span>

            <ChevronRight
              size={13}
              className="
                relative
                -ml-1
                opacity-0
                -translate-x-1
                transition-all
                duration-300
                group-hover/btn:translate-x-0
                group-hover/btn:opacity-100
              "
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;