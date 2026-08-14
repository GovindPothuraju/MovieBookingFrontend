import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";
import BookingConfirmationAnimation from "./BookingConfirmationAnimation";

const Payments = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    state?.expiresIn || 0
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const showId = state?.showId;
  const selectedSeats = state?.selectedSeats || [];
  const totalAmount = state?.totalAmount || 0;

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/profile`,
          {
            withCredentials: true,
          }
        );

        if (response.data?.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Unable to load your profile.");
      }
    };

    if (state) {
      fetchUser();
    }
  }, [state]);

  // Seat lock countdown
  useEffect(() => {
    if (!state || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, state]);

  // Release current user's Redis seat locks
  const releaseSeatLocks = async () => {
    if (!showId || selectedSeats.length === 0) {
      return;
    }

    await axios.delete(
      `${BASE_URL}/user/bookings/lock`,
      {
        data: {
          showId,
          seats: selectedSeats.map(
            (seat) => seat.seatLabel
          ),
        },
        withCredentials: true,
      }
    );
  };

  // Go back and release seats
  const handleGoBack = async () => {
    try {
      setLoading(true);
      setError("");

      await releaseSeatLocks();

      navigate(`/shows/${showId}/seats`);
    } catch (err) {
      console.error("Release seat error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to release seats. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Wait for webhook to create booking
  const waitForBooking = async () => {
    for (let i = 0; i < 10; i++) {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/bookings/me`,
          {
            withCredentials: true,
          }
        );

        const bookings = response.data?.data || [];

        if (bookings.length > 0) {
          return bookings[0];
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    }

    return null;
  };

  // Confirmation animation complete
  const handleConfirmationComplete = () => {
    if (confirmedBooking?._id) {
      window.location.href = `/bookings/${confirmedBooking._id}`;
    } else {
      window.location.href = "/bookings";
    }
  };

  // Start payment
  const handlePayment = async () => {
    if (!window.Razorpay) {
      setError(
        "Payment system is not ready. Please refresh the page."
      );
      return;
    }

    if (!user) {
      setError(
        "Unable to load your profile. Please try again."
      );
      return;
    }

    if (timeLeft <= 0) {
      setError(
        "Your seat lock has expired. Please select the seats again."
      );
      return;
    }

    if (!showId || selectedSeats.length === 0) {
      setError("Invalid payment request.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${BASE_URL}/user/payments/create-order`,
        { showId },
        {
          withCredentials: true,
        }
      );

      const {
        orderId,
        amount,
        currency,
        key,
      } = response.data.data;

      const options = {
        key,
        amount,
        currency,
        name: "Movie Booking",
        description: "Movie Ticket Booking",
        order_id: orderId,

        handler: async function () {
          try {
            const booking = await waitForBooking();

            if (!booking) {
              setError(
                "Payment successful, but booking is still processing. Redirecting..."
              );

              setTimeout(() => {
                window.location.href = "/bookings";
              }, 3000);

              return;
            }

            setConfirmedBooking(booking);
            setShowConfirmation(true);
          } catch (err) {
            console.error(
              "Payment handler error:",
              err
            );

            setError(
              "Something went wrong. Redirecting to bookings..."
            );

            setTimeout(() => {
              window.location.href = "/bookings";
            }, 3000);
          }
        },

        // User closes Razorpay
        modal: {
          ondismiss: async function () {
            try {
              await releaseSeatLocks();
            } catch (err) {
              console.error(
                "Error releasing seat locks:",
                err
              );
            }
          },
        },

        theme: {
          color: "#F97316",
        },

        // Logged-in user details
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
      };

      const razorpay = new window.Razorpay(options);

      // Payment failed
      razorpay.on(
        "payment.failed",
        async function (response) {
          console.error(
            "Payment failed:",
            response.error
          );

          setError(
            "Payment failed. Please try again."
          );

          try {
            await releaseSeatLocks();
          } catch (err) {
            console.error(
              "Error releasing seat locks:",
              err
            );
          }
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(
        "Payment initiation error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to initiate payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Invalid state
  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060A] text-white">
        Invalid Payment Request
      </div>
    );
  }

  return (
    <>
      {showConfirmation && confirmedBooking && (
        <BookingConfirmationAnimation
          booking={confirmedBooking}
          onComplete={handleConfirmationComplete}
        />
      )}

      <div className="min-h-screen bg-[#05060A] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

            {/* Header */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[2px] text-red-400">
                Secure Checkout
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                Payment
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Complete your payment before the seat lock expires.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Booking details */}
            <div className="space-y-5">

              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Show ID
                </p>

                <p className="mt-2 break-all text-sm text-white">
                  {showId}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Selected Seats
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedSeats
                    .map(
                      (seat) => seat.seatLabel
                    )
                    .join(", ")}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Total Amount
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    Amount to pay
                  </p>
                </div>

                <p className="text-3xl font-bold text-red-500">
                  ₹{totalAmount}
                </p>
              </div>

              {/* Timer */}
              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Seat Lock
                  </p>

                  <p
                    className={`font-bold ${
                      timeLeft <= 30
                        ? "text-red-500"
                        : "text-yellow-400"
                    }`}
                  >
                    {timeLeft}s
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${
                      timeLeft <= 30
                        ? "bg-red-500"
                        : "bg-yellow-400"
                    }`}
                    style={{
                      width: `${Math.min(
                        (timeLeft / 300) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Complete your payment before the timer reaches zero.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-3">

              <button
                type="button"
                onClick={handlePayment}
                disabled={
                  timeLeft <= 0 ||
                  loading ||
                  !user
                }
                className="w-full rounded-xl bg-red-500 py-4 font-semibold text-white transition hover:bg-red-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {loading
                  ? "Processing..."
                  : timeLeft > 0
                  ? `Pay ₹${totalAmount}`
                  : "Seat Lock Expired"}
              </button>

              <button
                type="button"
                onClick={handleGoBack}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Releasing Seats..."
                  : "← Go Back"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-zinc-600">
                Your selected seats are temporarily reserved for you.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;