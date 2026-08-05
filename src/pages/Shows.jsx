import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const Shows = () => {
  const { movieId } = useParams();

  const navigate = useNavigate();

  const getNextSevenDays = () => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      days.push(date.toISOString().split("T")[0]); // YYYY-MM-DD
    }

    return days;
  };

  const dates = getNextSevenDays();

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [shows, setShows] = useState([]);

  const getShows = async (date) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/movies/shows/${movieId}/${date}`,
        {
          withCredentials: true,
        }
      );

      setShows(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getShows(selectedDate);
  }, [selectedDate]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-8 backdrop-blur-xl">
        <h2 className="mb-6 text-2xl font-bold">
          Choose Date
        </h2>

        <div className="flex flex-wrap gap-4">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`rounded-xl px-6 py-4 transition ${
                selectedDate === date
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-zinc-300"
              }`}
            >
              {new Date(date).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                }
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {shows.map((theaterData) => (
          <div
            key={theaterData.theater._id}
            className="rounded-3xl border border-white/10 bg-white/5 p-8"
          >
            <h2 className="text-2xl font-bold">
              {theaterData.theater.name}
            </h2>

            <div className="mt-6 flex flex-wrap gap-4">
              {theaterData.shows.map((show) => (
                <button
                  key={show.showId}
                  onClick={() =>
                    navigate(
                      `/shows/${show.showId}/seats`
                    )
                  }
                  className="rounded-xl border border-green-500 px-6 py-4 text-green-400 transition hover:bg-green-500 hover:text-white"
                >
                  <div>
                    {new Date(
                      show.showTime
                    ).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="mt-1 text-xs">
                    {show.screen}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shows;