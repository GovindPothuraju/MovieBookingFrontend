import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../shared/constants";
import MovieCard from "../components/MovieCard";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMovies = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/movies`,
        {
          withCredentials: true,
        }
      );

      setMovies(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <h1 className="text-xl text-white">
          Loading Movies...
        </h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-8">
      <div className="absolute left-0 top-40 h-[400px] w-[400px] rounded-full bg-red-600/10 blur-[180px]" />

      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-red-600/10 blur-[180px]" />

      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Now Showing
          </h1>

          <span className="text-zinc-400">
            {movies.length} Movies
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movies;