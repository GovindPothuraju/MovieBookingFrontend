import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);

  const getMovieDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/movies/${movieId}`,
        {
          withCredentials: true,
        }
      );

      setMovie(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMovieDetails();
  }, [movieId]);

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <h1 className="text-xl text-white">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060A] text-white">
      <div className="absolute left-0 top-40 h-[400px] w-[400px] rounded-full bg-red-600/10 blur-[180px]" />

      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-red-600/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          {/* Poster */}
          <div>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full rounded-3xl object-cover shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Movie Content */}
          <div className="flex flex-col justify-center">
            <span className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-400">
              {movie.languages[0]}
            </span>

            <h1 className="text-5xl font-bold lg:text-6xl">
              {movie.title}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-red-500 text-xl">
                ★
              </span>

              <span className="text-lg font-medium">
                {movie.rating} User Rating
              </span>
            </div>

            <p className="mt-8 max-w-4xl text-zinc-400 leading-8">
              {movie.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2 text-white">
              <span>{movie.duration}m</span>

              <span>•</span>

              {movie.genres.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}

              <span>•</span>

              <span>
                {new Date(
                  movie.releaseDate
                ).getFullYear()}
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-[#182235] px-8 py-4 font-semibold transition hover:bg-[#243248]"
                >
                  ▶ Watch Trailer
                </a>
              )}

              <button
                onClick={() =>
                  navigate(
                    `/movies/${movieId}/shows`
                  )
                }
                className="rounded-xl bg-red-500 px-10 py-4 font-semibold transition hover:bg-red-600"
              >
                Buy Tickets
              </button>

              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1B2233] transition hover:bg-[#283246]">
                ❤
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
    <section className="mt-24">
      <h2 className="mb-8 text-3xl font-bold">
        Cast
      </h2>

      <div className="flex flex-wrap gap-8">
        {movie.cast.map((person) => (
          <div
            key={person._id}
            className="w-[110px] text-center"
          >
            <img
              src={person.image}
              alt={person.name}
              className="mx-auto h-20 w-20 rounded-full object-cover border border-white/10"
            />

            <h3 className="mt-3 text-xs font-medium leading-5 text-white">
              {person.name}
            </h3>
          </div>
        ))}
      </div>
    </section>

    {/* Crew */}
    <section className="mt-20">
      <h2 className="mb-8 text-3xl font-bold">
        Crew
      </h2>

      <div className="flex flex-wrap gap-8">
        {movie.crew.map((person) => (
          <div
            key={person._id}
            className="w-[110px] text-center"
          >
            <img
              src={person.image}
              alt={person.name}
              className="mx-auto h-20 w-20 rounded-full object-cover border border-white/10"
            />

            <h3 className="mt-3 text-xs font-medium leading-5 text-white">
              {person.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
    </div>
    </div>
  );
};

export default MovieDetails;