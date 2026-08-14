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
    <article className="movie-card group w-full min-w-0">
      <div className="relative w-full overflow-hidden rounded-[20px] border border-white/[0.10] bg-[#141416] shadow-[0_12px_35px_rgba(0,0,0,0.28)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-[#ed1c24]/50 group-hover:shadow-[0_22px_55px_rgba(237,28,36,0.20)]">

        <div className="relative aspect-[2/3] w-full overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0d0d0f] text-xs text-gray-500">
              No Image
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/10 to-transparent opacity-90" />

          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:border-[#ed1c24]/40 group-hover:bg-black/80">
            <Star size={13} fill="currentColor" className="text-[#ed1c24]" />
            <span className="text-xs font-bold text-white">{rating}</span>
          </div>

          <div className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.10] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[120%]" />

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
            <h3 title={title} className="line-clamp-2 text-[16px] font-bold leading-tight text-white drop-shadow-lg sm:text-[17px] md:text-[18px]">
              {title}
            </h3>
          </div>
        </div>

        <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          <p title={genre} className="truncate text-[10px] font-medium uppercase tracking-[1px] text-gray-500 sm:text-[11px]">
            {genre}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400 sm:text-[11px]">
            <Clock3 size={13} className="shrink-0 text-gray-500" />
            <span>{duration}</span>
            <span className="mx-1 text-gray-700">•</span>
            <span className="text-gray-500">Movie</span>
          </div>

          <button type="button" onClick={handleBookTickets} disabled={!movie?.slug} className="group/btn relative mt-4 flex h-[42px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#ed1c24]/30 bg-[#ed1c24]/10 text-[11px] font-bold text-white transition-all duration-300 hover:border-[#ed1c24] hover:bg-[#ed1c24] hover:shadow-[0_8px_25px_rgba(237,28,36,0.28)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 sm:h-[44px] sm:text-xs">
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
            <Ticket size={15} className="relative transition-transform duration-300 group-hover/btn:-rotate-6 group-hover/btn:scale-110" />
            <span className="relative">Book Tickets</span>
            <ChevronRight size={14} className="relative -ml-1 -translate-x-1 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;