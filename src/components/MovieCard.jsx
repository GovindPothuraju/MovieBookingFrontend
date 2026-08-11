import { Clock3, Star, Ticket } from "lucide-react";
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
    <article className="group w-[144px] shrink-0 sm:w-auto">
      <div className="relative overflow-hidden rounded-[18px] border border-white/[0.12] bg-[#19191c] transition-all duration-300 hover:-translate-y-1 hover:border-[#ed1c24]/70 hover:shadow-[0_18px_45px_rgba(237,28,36,0.16)]">
        <div className="relative h-[205px] overflow-hidden sm:h-[210px]">
          {poster ? (
            <img
              src={poster}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#111113] text-xs text-gray-500">
              No Image
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#19191c] via-transparent to-transparent" />

          <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-[#080809]/90 px-2 py-1 backdrop-blur-sm">
            <Star
              size={11}
              fill="currentColor"
              className="text-[#ed1c24]"
            />
            <span className="text-[10px] font-bold text-white">
              {rating}
            </span>
          </div>
        </div>

        <div className="px-3 pb-3 pt-2">
          <h3
            className="truncate text-[12px] font-bold text-white sm:text-[13px]"
            title={title}
          >
            {title}
          </h3>

          <p
            className="mt-1 truncate text-[10px] text-gray-400 sm:text-[11px]"
            title={genre}
          >
            {genre}
          </p>

          <div className="mt-2 flex min-w-0 items-center gap-1 text-[9px] text-gray-500 sm:text-[10px]">
            <Clock3 size={11} className="shrink-0" />
            <span className="truncate">{duration}</span>
          </div>

          <button
            type="button"
            onClick={handleBookTickets}
            disabled={!movie?.slug}
            className="mt-3 flex h-[30px] w-full items-center justify-center gap-1.5 rounded-[10px] border border-white/[0.10] bg-white/[0.04] text-[10px] font-semibold text-white transition hover:border-[#ed1c24]/40 hover:bg-[#ed1c24] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Ticket size={12} />
            <span>Book Tickets</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;