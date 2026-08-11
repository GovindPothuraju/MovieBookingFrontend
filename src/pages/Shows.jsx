import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const Shows = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const getNextSevenDays = () => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      days.push(`${year}-${month}-${day}`);
    }

    return days;
  };

  const dates = useMemo(() => getNextSevenDays(), []);

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug || !selectedDate) return;

    const getShows = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/user/movies/shows/${slug}/${selectedDate}`,
          { withCredentials: true }
        );

        setMovie(response?.data?.data?.movie || null);
        setShows(response?.data?.data?.shows || []);
      } catch (error) {
        console.error(
          "Failed to fetch shows:",
          error?.response?.data || error
        );
        setMovie(null);
        setShows([]);
      } finally {
        setLoading(false);
      }
    };

    getShows();
  }, [slug, selectedDate]);

  const theaters = useMemo(() => {
    const grouped = {};

    shows.forEach((show) => {
      const theaterId = show?.theaterId?._id;

      if (!theaterId) return;

      if (!grouped[theaterId]) {
        grouped[theaterId] = {
          theater: show.theaterId,
          shows: [],
        };
      }

      grouped[theaterId].shows.push(show);
    });

    return Object.values(grouped);
  }, [shows]);

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const getDayName = (date, index) => {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";

    const [year, month, day] = date.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("en-IN", {
      weekday: "short",
    });
  };

  if (!slug) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060A] px-5 text-white">
        <p className="text-zinc-400">Invalid movie URL.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060A] px-4 pb-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {movie && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {movie.title}
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Select a date and showtime
            </p>
          </div>
        )}

        {/* Date Selection */}
        <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-5 backdrop-blur-xl sm:p-8">
          <h2 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">
            Choose Date
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {dates.map((date, index) => (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`min-w-[85px] shrink-0 rounded-xl px-4 py-3 text-sm transition sm:min-w-[100px] sm:px-6 sm:py-4 ${
                  selectedDate === date
                    ? "bg-[#ed1c24] text-white shadow-lg shadow-red-500/20"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                <div
                  className={`text-xs ${
                    selectedDate === date
                      ? "text-white/70"
                      : "text-zinc-400"
                  }`}
                >
                  {getDayName(date, index)}
                </div>

                <div className="mt-1 font-semibold">
                  {formatDate(date)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Shows */}
        <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center rounded-3xl border border-white/10 bg-white/5">
              <div className="flex flex-col items-center gap-4">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-[#ed1c24]" />

                <p className="text-sm text-zinc-400">
                  Loading shows...
                </p>
              </div>
            </div>
          ) : theaters.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-5 text-center">
              <div>
                <p className="text-base font-medium text-white">
                  No shows available
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  There are no shows available for this date.
                </p>
              </div>
            </div>
          ) : (
            theaters.map((theaterData) => (
              <div
                key={theaterData.theater._id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8"
              >
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    {theaterData.theater.name}
                  </h2>

                  {theaterData.theater.location && (
                    <p className="mt-1 text-sm text-zinc-500">
                      {theaterData.theater.location}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex gap-3 overflow-x-auto pb-2 sm:mt-6 sm:flex-wrap sm:overflow-visible">
                  {theaterData.shows.map((show) => (
                    <button
                      key={show._id}
                      type="button"
                      onClick={() =>
                        navigate(`/shows/${show._id}/seats`)
                      }
                      className="min-w-[110px] shrink-0 rounded-xl border border-green-500/50 bg-green-500/5 px-4 py-3 text-green-400 transition hover:bg-green-500 hover:text-white active:scale-95 sm:min-w-[125px] sm:px-6 sm:py-4"
                    >
                      <div className="text-sm font-semibold">
                        {new Date(show.showTime).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </div>

                      <div className="mt-1 text-xs text-zinc-500">
                        {show.screenId?.name || "Screen"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Shows;