import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const BookingDetails = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/bookings/${bookingId}`,
          {
            withCredentials: true,
          }
        );

        setBooking(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading booking...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Booking not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black shadow-2xl">

        {/* Header */}
        <div className="bg-red-600 px-6 py-6 text-center sm:px-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {booking.movieId.title}
          </h1>

          <p className="mt-2 text-sm text-red-100">
            Booking ID : {booking.bookingId}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-8 p-6 sm:p-8">

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div>
              <p className="text-sm text-zinc-400">Theatre</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {booking.theaterId.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Screen</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {booking.screenId.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Date</p>
              <p className="mt-1 text-white">
                {new Date(
                  booking.showId.showTime
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Time</p>
              <p className="mt-1 text-white">
                {new Date(
                  booking.showId.showTime
                ).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Seats</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {booking.seats.map((seat) => (
                  <span
                    key={seat}
                    className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Amount Paid</p>
              <p className="mt-1 text-2xl font-bold text-red-400">
                ₹{booking.totalAmount}
              </p>
            </div>

          </div>

          {/* Status */}
          <div className="flex flex-wrap justify-center gap-3">

            <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">
              {booking.bookingStatus}
            </span>

            <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-400">
              {booking.paymentStatus}
            </span>

          </div>

          {/* QR */}
          <div className="border-t border-dashed border-white/10 pt-8">

            <h2 className="mb-5 text-center text-xl font-semibold text-white">
              Entry QR Ticket
            </h2>

            <div className="flex justify-center">

              <img
                src={booking.qrCode}
                alt="QR Ticket"
                className="h-40 w-40 rounded-xl bg-white p-3 shadow-xl sm:h-48 sm:w-48"
              />

            </div>

            <p className="mt-5 text-center text-sm text-zinc-400">
              Scan this QR code at the theatre entrance.
            </p>

          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-6">

            <p className="text-center text-sm text-zinc-500">
              Booked on{" "}
              {new Date(
                booking.bookedAt
              ).toLocaleString("en-IN")}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BookingDetails;