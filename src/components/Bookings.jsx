import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const Bookings = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/bookings/me`,
        {
          withCredentials: true,
        }
      );

      setBookings(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-white">
        Loading Bookings...
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-white">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-10 text-4xl font-bold text-white">
        My Bookings
      </h1>

      <div className="space-y-8">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
              {/* Left */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">
                  {booking.movieId?.title}
                </h2>

                <p className="text-zinc-300">
                  🎬 Booking ID :{" "}
                  <span className="font-semibold">
                    {booking.bookingId}
                  </span>
                </p>

                <p className="text-zinc-300">
                  🏢 {booking.theaterId?.name}
                </p>

                <p className="text-zinc-300">
                  🖥 {booking.screenId?.name}
                </p>

                <p className="text-zinc-300">
                  🕒{" "}
                  {new Date(
                    booking.showId?.showTime
                  ).toLocaleString("en-IN")}
                </p>

                <p className="text-zinc-300">
                  🎟 Seats :{" "}
                  <span className="font-semibold text-white">
                    {booking.seats.join(", ")}
                  </span>
                </p>

                <p className="text-2xl font-bold text-red-500">
                  ₹{booking.totalAmount}
                </p>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end justify-between">
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-sm text-zinc-400">
                      Booking Status
                    </p>

                    <span
                      className={`rounded-full px-4 py-1 text-sm font-semibold ${
                        booking.bookingStatus ===
                        "CONFIRMED"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </div>

                  <div>
                    <p className="mb-1 text-sm text-zinc-400">
                      Payment Status
                    </p>

                    <span
                      className={`rounded-full px-4 py-1 text-sm font-semibold ${
                        booking.paymentStatus ===
                        "SUCCESS"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">
                      Booked On
                    </p>

                    <p className="text-white">
                      {new Date(
                        booking.bookedAt
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/bookings/${booking._id}`
                    )
                  }
                  className="mt-8 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;