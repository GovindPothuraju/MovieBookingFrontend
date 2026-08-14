import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";
import BookingConfirmationAnimation from "./BookingConfirmationAnimation";

const Payments = () => {
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    state?.expiresIn || 0
  );
  const [showConfirmation, setShowConfirmation] =
    useState(false);
  const [confirmedBooking, setConfirmedBooking] =
    useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

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
        console.error(
          "Error fetching user profile:",
          err
        );
      }
    };

    fetchUser();
  }, []);

  // Invalid payment state
  if (!state) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Invalid Payment Request
      </div>
    );
  }

  const {
    showId,
    selectedSeats = [],
    totalAmount,
  } = state;

  // Seat lock countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

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
  }, [timeLeft]);

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

        const bookings =
          response.data?.data || [];

        if (bookings.length > 0) {
          return bookings[0];
        }
      } catch (err) {
        console.error(
          "Error fetching booking:",
          err
        );
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

    try {
      setLoading(true);
      setError(null);

      // Create Razorpay order
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
            // Wait until webhook creates booking
            const booking =
              await waitForBooking();

            if (!booking) {
              console.error(
                "Booking not found after payment"
              );

              setError(
                "Payment successful, but booking is still processing. Redirecting..."
              );

              setTimeout(() => {
                window.location.href =
                  "/bookings";
              }, 3000);

              return;
            }

            // Show confirmation animation
            setConfirmedBooking(booking);
            setShowConfirmation(true);
          } catch (err) {
            console.error(
              "Error in payment handler:",
              err
            );

            setError(
              "Something went wrong. Redirecting to bookings..."
            );

            setTimeout(() => {
              window.location.href =
                "/bookings";
            }, 3000);
          }
        },

        modal: {
          ondismiss: async function () {
            try {
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
            } catch (err) {
              console.error(
                "Error releasing seat lock:",
                err
              );
            }
          },
        },

        theme: {
          color: "#F97316",
        },

        // Logged-in user's details
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
      };

      const razorpay =
        new window.Razorpay(options);

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
          } catch (err) {
            console.error(
              "Error releasing seat lock:",
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

  return (
    <>
      {/* Booking Confirmation Animation */}
      {showConfirmation &&
        confirmedBooking && (
          <BookingConfirmationAnimation
            booking={confirmedBooking}
            onComplete={
              handleConfirmationComplete
            }
          />
        )}

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-bold text-white">
            Payment
          </h1>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          <div className="mt-8 space-y-5">
            <div>
              <p className="text-zinc-400">
                Show ID
              </p>

              <p className="break-all text-white">
                {showId}
              </p>
            </div>

            <div>
              <p className="text-zinc-400">
                Selected Seats
              </p>

              <p className="text-white">
                {selectedSeats
                  .map(
                    (seat) => seat.seatLabel
                  )
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
            type="button"
            onClick={handlePayment}
            disabled={
              timeLeft <= 0 ||
              loading ||
              !user
            }
            className="mt-10 w-full rounded-xl bg-red-500 py-4 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-zinc-600"
          >
            {loading
              ? "Creating Order..."
              : timeLeft > 0
              ? `Pay ₹${totalAmount}`
              : "Seat Lock Expired"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Payments;