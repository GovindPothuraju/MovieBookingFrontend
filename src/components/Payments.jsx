import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [timeLeft, setTimeLeft] = useState(
    state?.expiresIn || 0
  );

  if (!state) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Invalid Payment Request
      </div>
    );
  }

  const {
    showId,
    selectedSeats,
    totalAmount,
  } = state;

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/bookings`,
        {
          showId,
          paymentId: "TEST_PAYMENT_123",
        },
        {
          withCredentials: true,
        }
      );

      alert(response.data.message);

      navigate("/bookings");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Booking failed."
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

        <h1 className="text-3xl font-bold text-white">
          Payment
        </h1>

        <div className="mt-8 space-y-5">

          <div>
            <p className="text-zinc-400">
              Show ID
            </p>

            <p className="text-white break-all">
              {showId}
            </p>
          </div>

          <div>
            <p className="text-zinc-400">
              Selected Seats
            </p>

            <p className="text-white">
              {selectedSeats
                .map((seat) => seat.seatLabel)
                .join(", ")}
            </p>
          </div>

          <div>
            <p className="text-zinc-400">
              Total Amount
            </p>

            <p className="text-3xl font-bold text-red-500">
              ₹{totalAmount}
            </p>
          </div>

          <div>
            <p className="text-zinc-400">
              Seat Lock Expires In
            </p>

            <p
              className={`font-semibold ${
                timeLeft <= 30
                  ? "text-red-500"
                  : "text-yellow-400"
              }`}
            >
              {timeLeft} seconds
            </p>
          </div>

        </div>

        <button
          disabled={timeLeft <= 0}
          onClick={handlePayment}
          className="mt-10 w-full rounded-xl bg-red-500 py-4 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-zinc-600"
        >
          {timeLeft > 0
            ? "Pay Now"
            : "Seat Lock Expired"}
        </button>

      </div>
    </div>
  );
};

export default Payment;