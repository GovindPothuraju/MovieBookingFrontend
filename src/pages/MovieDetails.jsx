import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const MovieDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/movies/${slug}`, {
          withCredentials: true,
        });

        setMovie(response?.data?.data || null);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) getMovieDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060A] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-[#ed1c24]" />
          <p className="text-sm text-zinc-400">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060A] px-5 text-center text-white">
        <div>
          <h1 className="text-2xl font-bold">Movie not found</h1>

          <button
            onClick={() => navigate("/movies")}
            className="mt-5 rounded-xl bg-[#ed1c24] px-6 py-3 text-sm font-semibold"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060A] text-white">
      <div className="pointer-events-none absolute left-0 top-40 h-[400px] w-[400px] rounded-full bg-red-600/10 blur-[180px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-red-600/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
          <div>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="mx-auto w-full max-w-[320px] rounded-3xl object-cover shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-400 sm:text-sm">
              {movie.languages?.[0] || "Movie"}
            </span>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xl text-[#ed1c24]">★</span>

              <span className="text-base font-medium sm:text-lg">
                {movie.rating ?? 0} User Rating
              </span>
            </div>

            <p className="mt-6 max-w-4xl text-sm leading-7 text-zinc-400 sm:mt-8 sm:text-base sm:leading-8">
              {movie.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-sm text-white sm:mt-8">
              <span>{movie.duration}m</span>
              <span>•</span>

              {movie.genres?.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}

              <span>•</span>

              <span>
                {movie.releaseDate
                  ? new Date(movie.releaseDate).getFullYear()
                  : ""}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-[#182235] px-5 py-3 text-sm font-semibold transition hover:bg-[#243248] sm:px-7 sm:py-4"
                >
                  ▶ Watch Trailer
                </a>
              )}

              <button
                onClick={() => navigate(`/movies/${slug}/shows`)}
                className="rounded-xl bg-[#ed1c24] px-6 py-3 text-sm font-semibold transition hover:bg-[#d91820] sm:px-10 sm:py-4"
              >
                Buy Tickets
              </button>
            </div>
          </div>
        </div>

        <section className="mt-16 sm:mt-24">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">Cast</h2>

            {movie.cast?.length > 5 && (
              <span className="text-xs text-gray-500 sm:text-sm">
                Swipe to view more →
              </span>
            )}
          </div>

          {movie.cast?.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-3 sm:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {movie.cast.map((person, index) => (
                <div
                  key={person._id || `${person.name}-${index}`}
                  className="w-[115px] shrink-0 sm:w-[135px] lg:w-[150px]"
                >
                  <div className="overflow-hidden rounded-[10px] bg-[#111113]">
                    <img
                      src={person.image}
                      alt={person.name}
                      loading="lazy"
                      className="h-[155px] w-full object-cover transition-transform duration-300 hover:scale-105 sm:h-[180px] lg:h-[200px]"
                    />
                  </div>

                  <div className="mt-2">
                    <p className="truncate text-[9px] text-gray-500 sm:text-[10px]">
                      {person.role || "Actor"}
                    </p>

                    <h3 className="mt-0.5 truncate text-[11px] font-semibold text-white sm:text-xs">
                      {person.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Cast information not available.
            </p>
          )}
        </section>

        <section className="mt-14 sm:mt-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">Crew</h2>

            {movie.crew?.length > 5 && (
              <span className="text-xs text-gray-500 sm:text-sm">
                Swipe to view more →
              </span>
            )}
          </div>

          {movie.crew?.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-3 sm:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {movie.crew.map((person, index) => (
                <div
                  key={person._id || `${person.name}-${index}`}
                  className="w-[115px] shrink-0 sm:w-[135px] lg:w-[150px]"
                >
                  <div className="overflow-hidden rounded-[10px] bg-[#111113]">
                    <img
                      src={person.image}
                      alt={person.name}
                      loading="lazy"
                      className="h-[155px] w-full object-cover transition-transform duration-300 hover:scale-105 sm:h-[180px] lg:h-[200px]"
                    />
                  </div>

                  <div className="mt-2">
                    <p className="truncate text-[9px] text-gray-500 sm:text-[10px]">
                      {person.role || "Crew"}
                    </p>

                    <h3 className="mt-0.5 truncate text-[11px] font-semibold text-white sm:text-xs">
                      {person.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Crew information not available.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;