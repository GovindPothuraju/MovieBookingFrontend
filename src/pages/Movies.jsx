import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../shared/constants";
import MovieCard from "../components/MovieCard";

const Movies = ({ standalone = false }) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/movies`, {
          withCredentials: true,
        });
        setMovies(response?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#09090B] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-[#ed1c24]" />
              <p className="text-sm text-zinc-400">Loading movies...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#09090B] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
      <div className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-red-600/5 blur-[160px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-red-600/5 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div className="min-w-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Currently Showing
            </h2>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Discover movies currently playing in cinemas near you.
            </p>
          </div>

          {!standalone && (
            <button
              type="button"
              onClick={() => navigate("/movies")}
              className="flex shrink-0 items-center gap-1.5 pb-1 text-sm font-semibold text-[#ed1c24] transition hover:text-red-400 sm:text-base"
            >
              View all
              <span className="text-lg">→</span>
            </button>
          )}
        </div>

        {movies.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-3 sm:gap-5 lg:grid lg:grid-cols-6 lg:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(standalone ? movies : movies.slice(0, 6)).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-white/10 bg-[#111113]">
            <p className="text-zinc-400">No movies currently showing.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Movies;