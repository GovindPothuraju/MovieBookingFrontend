import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <div className="group rounded-3xl bg-[#131C2F] p-3 transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]">
      <div className="overflow-hidden rounded-2xl">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-4">
        <h2 className="truncate text-lg font-bold text-white">
          {movie.title}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {new Date(movie.releaseDate).getFullYear()} •{" "}
          {movie.genres.join(" | ")}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          {movie.languages.join(" | ")}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <Link
            to={`/movies/${movie._id}`}
            className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
          >
            Buy Tickets
          </Link>

          <span className="font-medium text-zinc-300">
            ⭐ {movie.rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;