import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PHASES = {
  VERIFYING: "VERIFYING",
  TICKET: "TICKET",
  CONFIRMED: "CONFIRMED",
  REDIRECTING: "REDIRECTING",
};

const PHASE_TIMINGS = {
  VERIFYING: 1000,
  TICKET: 900,
  CONFIRMED: 2800,
};

const getValue = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return null;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSeats = (booking) => {
  if (!booking) return [];

  const seats =
    booking.seats ||
    booking.bookedSeats ||
    [];

  if (!Array.isArray(seats)) {
    return [];
  }

  return seats.map((seat) => {
    if (typeof seat === "string") {
      return seat;
    }

    if (seat && typeof seat === "object") {
      return (
        seat.seatLabel ||
        seat.seatNumber ||
        seat.label ||
        seat.name ||
        ""
      );
    }

    return "";
  }).filter(Boolean);
};

const getBookingDetails = (booking) => {
  const b = booking || {};

  // Your /bookings/me API returns populated references.
  const movie =
    b.movieId && typeof b.movieId === "object"
      ? b.movieId
      : {};

  const theater =
    b.theaterId && typeof b.theaterId === "object"
      ? b.theaterId
      : {};

  const screen =
    b.screenId && typeof b.screenId === "object"
      ? b.screenId
      : {};

  const show =
    b.showId && typeof b.showId === "object"
      ? b.showId
      : {};

  const showTime = getValue(
    show.showTime,
    b.showTime,
    b.showDateTime
  );

  const seats = getSeats(b);

  return {
    bookingId: getValue(
      b.bookingId,
      b._id,
      b.id,
      "—"
    ),

    movieName: getValue(
      movie.title,
      movie.name,
      b.movieName,
      "Movie"
    ),

    theaterName: getValue(
      theater.name,
      b.theaterName,
      "Theatre"
    ),

    screenName: getValue(
      screen.name,
      b.screenName,
      "Screen"
    ),

    showTime,

    date: formatDate(showTime),

    time: formatTime(showTime),

    seats,

    amount: getValue(
      b.totalAmount,
      b.amount,
      0
    ),

    qrCode: b.qrCode || null,
  };
};

export default function BookingConfirmationAnimation({
  booking,
  onComplete,
}) {
  const [phase, setPhase] = useState(
    PHASES.VERIFYING
  );

  const completedRef = useRef(false);

  const details = useMemo(
    () => getBookingDetails(booking),
    [booking]
  );

  useEffect(() => {
    if (phase === PHASES.REDIRECTING) {
      return;
    }

    const duration =
      PHASE_TIMINGS[phase] || 1000;

    const timer = setTimeout(() => {
      if (phase === PHASES.VERIFYING) {
        setPhase(PHASES.TICKET);
      } else if (phase === PHASES.TICKET) {
        setPhase(PHASES.CONFIRMED);
      } else if (phase === PHASES.CONFIRMED) {
        setPhase(PHASES.REDIRECTING);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [phase]);

  const finish = useCallback(() => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;

    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (phase !== PHASES.REDIRECTING) {
      return;
    }

    const timer = setTimeout(() => {
      finish();
    }, 400);

    return () => clearTimeout(timer);
  }, [phase, finish]);

  const isVerifying =
    phase === PHASES.VERIFYING;

  const showTicket =
    phase === PHASES.TICKET ||
    phase === PHASES.CONFIRMED ||
    phase === PHASES.REDIRECTING;

  const isConfirmed =
    phase === PHASES.CONFIRMED ||
    phase === PHASES.REDIRECTING;

  return (
    <>
      <style>
        {`
          @keyframes qbFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes qbScaleIn {
            0% {
              opacity: 0;
              transform: scale(.82);
            }
            70% {
              opacity: 1;
              transform: scale(1.04);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes qbCheck {
            0% {
              stroke-dashoffset: 100;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes qbRing {
            0% {
              transform: scale(.7);
              opacity: .8;
            }
            100% {
              transform: scale(1.45);
              opacity: 0;
            }
          }

          @keyframes qbTicketIn {
            0% {
              opacity: 0;
              transform:
                translateY(70px)
                scale(.88)
                rotateX(12deg);
            }
            70% {
              opacity: 1;
              transform:
                translateY(-5px)
                scale(1.02)
                rotateX(0deg);
            }
            100% {
              opacity: 1;
              transform:
                translateY(0)
                scale(1)
                rotateX(0deg);
            }
          }

          @keyframes qbGlow {
            0% {
              box-shadow:
                0 0 0 0 rgba(237,28,36,.25);
            }
            70% {
              box-shadow:
                0 0 0 25px rgba(237,28,36,0);
            }
            100% {
              box-shadow:
                0 0 0 0 rgba(237,28,36,0);
            }
          }

          @keyframes qbStamp {
            0% {
              opacity: 0;
              transform:
                translate(-50%,-50%)
                scale(.4)
                rotate(-12deg);
            }
            65% {
              opacity: 1;
              transform:
                translate(-50%,-50%)
                scale(1.08)
                rotate(-4deg);
            }
            100% {
              opacity: 1;
              transform:
                translate(-50%,-50%)
                scale(1)
                rotate(-4deg);
            }
          }

          @keyframes qbRise {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes qbShine {
            0% {
              transform: translateX(-120%);
            }
            100% {
              transform: translateX(120%);
            }
          }

          @keyframes qbProgress {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          @keyframes qbPop {
            0% {
              opacity: 0;
              transform: scale(.5);
            }
            70% {
              opacity: 1;
              transform: scale(1.12);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @media (max-width: 640px) {
            .qb-ticket {
              width: 94vw !important;
            }

            .qb-ticket-main {
              padding: 20px !important;
            }

            .qb-ticket-stub {
              width: 105px !important;
            }

            .qb-movie-title {
              font-size: 22px !important;
            }
          }
        `}
      </style>

      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto px-4 py-8"
        style={{
          background:
            "radial-gradient(circle at 50% 25%, rgba(237,28,36,.13), transparent 38%), #05060A",
          animation:
            "qbFadeIn .35s ease-out both",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Booking confirmation"
      >
        {/* Background atmosphere */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,.75) 100%)",
          }}
        />

        {/* Red background glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "rgba(237,28,36,.06)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 w-full max-w-[760px] text-center">

          {/* VERIFYING */}
          {isVerifying && (
            <div
              className="flex flex-col items-center"
              style={{
                animation:
                  "qbScaleIn .5s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              <div className="relative mb-7">

                <div
                  className="absolute inset-0 rounded-full border border-[#ed1c24]/40"
                  style={{
                    animation:
                      "qbRing 1.5s ease-out infinite",
                  }}
                />

                <div
                  className="absolute inset-0 rounded-full border border-[#ed1c24]/30"
                  style={{
                    animation:
                      "qbRing 1.5s ease-out .45s infinite",
                  }}
                />

                <div
                  className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#ed1c24]/40 bg-[#111113]"
                  style={{
                    animation:
                      "qbGlow 1.6s ease-out infinite",
                  }}
                >
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 42 42"
                  >
                    <circle
                      cx="21"
                      cy="21"
                      r="18"
                      fill="none"
                      stroke="#ed1c24"
                      strokeWidth="2.5"
                      strokeDasharray="113"
                      strokeDashoffset="113"
                      strokeLinecap="round"
                      style={{
                        animation:
                          "qbCheck .7s ease-out .2s forwards",
                      }}
                    />

                    <path
                      d="M13 21.5l5.5 5.5L29.5 15"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="25"
                      strokeDashoffset="25"
                      style={{
                        animation:
                          "qbCheck .55s ease-out .65s forwards",
                      }}
                    />
                  </svg>
                </div>
              </div>

              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[4px] text-[#ed1c24]">
                QuickBook
              </p>

              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Payment Verified
              </h2>

              <p className="mt-3 text-sm text-zinc-500">
                Securing your movie tickets...
              </p>

              <div className="mt-7 h-1 w-48 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full bg-[#ed1c24]"
                  style={{
                    animation:
                      "qbProgress 1s linear forwards",
                  }}
                />
              </div>
            </div>
          )}

          {/* TICKET */}
          {showTicket && (
            <div
              className="mx-auto"
              style={{
                animation:
                  "qbTicketIn .8s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              {/* Heading */}
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[4px] text-[#ed1c24]">
                  QuickBook
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  {isConfirmed
                    ? "Booking Confirmed"
                    : "Preparing Your Ticket"}
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  {isConfirmed
                    ? "Your movie tickets are ready."
                    : "Creating your digital movie ticket..."}
                </p>
              </div>

              {/* Ticket */}
              <div
                className="qb-ticket relative mx-auto w-full max-w-[680px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101114] text-left shadow-[0_30px_100px_rgba(0,0,0,.65)]"
              >
                {/* Shine */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[35%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
                  style={{
                    animation:
                      "qbShine 2.2s ease-in-out .5s both",
                  }}
                />

                {/* Header */}
                <div className="border-b border-white/[0.07] bg-[#0b0c0f] px-5 py-4 sm:px-7">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-lg font-black tracking-tight text-white">
                        Quick<span className="text-[#ed1c24]">Book</span>
                      </p>

                      <p className="mt-0.5 text-[9px] uppercase tracking-[2px] text-zinc-600">
                        Digital Movie Ticket
                      </p>
                    </div>

                    <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-[1px] text-green-400">
                        ✓ Confirmed
                      </span>
                    </div>

                  </div>
                </div>

                {/* Ticket body */}
                <div className="flex flex-col sm:flex-row">

                  {/* Main section */}
                  <div className="qb-ticket-main flex-1 p-6 sm:p-8">

                    <p className="text-[9px] font-semibold uppercase tracking-[2px] text-zinc-600">
                      Movie
                    </p>

                    <h3 className="qb-movie-title mt-1.5 text-2xl font-bold leading-tight text-white sm:text-3xl">
                      {details.movieName}
                    </h3>

                    <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4">

                      <div>
                        <p className="text-[8px] uppercase tracking-[1.5px] text-zinc-600">
                          Date
                        </p>
                        <p className="mt-1 text-xs font-semibold text-zinc-200">
                          {details.date}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] uppercase tracking-[1.5px] text-zinc-600">
                          Time
                        </p>
                        <p className="mt-1 text-xs font-semibold text-zinc-200">
                          {details.time}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] uppercase tracking-[1.5px] text-zinc-600">
                          Screen
                        </p>
                        <p className="mt-1 text-xs font-semibold text-zinc-200">
                          {details.screenName}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] uppercase tracking-[1.5px] text-zinc-600">
                          Seats
                        </p>
                        <p className="mt-1 text-xs font-semibold text-white">
                          {details.seats.join(", ") || "—"}
                        </p>
                      </div>

                    </div>

                    <div className="mt-6 border-t border-white/[0.06] pt-5">

                      <p className="text-[8px] uppercase tracking-[1.5px] text-zinc-600">
                        Theatre
                      </p>

                      <p className="mt-1 text-sm font-semibold text-zinc-200">
                        {details.theaterName}
                      </p>

                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                      <div>
                        <p className="text-[8px] uppercase tracking-[1.5px] text-zinc-600">
                          Booking ID
                        </p>

                        <p className="mt-1 font-mono text-xs font-semibold text-zinc-300">
                          {details.bookingId}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[8px] uppercase tracking-[1.5px] text-zinc-600">
                          Amount Paid
                        </p>

                        <p className="mt-1 text-xl font-bold text-white">
                          ₹{details.amount}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Ticket stub */}
                  <div
                    className="qb-ticket-stub relative flex w-full flex-col items-center justify-center border-t border-dashed border-white/10 bg-[#0b0c0f] p-6 sm:w-[175px] sm:border-l sm:border-t-0"
                  >

                    {/* Notches */}
                    <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#05060A] sm:-left-3 sm:top-1/2 sm:-translate-y-1/2" />

                    {details.qrCode ? (
                      <div className="rounded-xl bg-white p-2.5 shadow-lg">
                        <img
                          src={details.qrCode}
                          alt="Booking QR"
                          className="h-[125px] w-[125px]"
                        />
                      </div>
                    ) : (
                      <div className="flex h-[125px] w-[125px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-center">
                        <span className="px-4 text-[9px] uppercase tracking-[1px] text-zinc-600">
                          QR unavailable
                        </span>
                      </div>
                    )}

                    <p className="mt-4 text-center text-[8px] uppercase tracking-[1.5px] text-zinc-600">
                      Scan at entrance
                    </p>

                  </div>

                </div>

                {/* Bottom strip */}
                <div className="flex items-center justify-between border-t border-white/[0.06] bg-[#0b0c0f] px-6 py-3">

                  <span className="text-[8px] uppercase tracking-[1.5px] text-zinc-600">
                    Keep this ticket ready
                  </span>

                  <span className="text-[9px] font-semibold text-[#ed1c24]">
                    QuickBook
                  </span>

                </div>

                {/* Confirmed stamp */}
                {isConfirmed && (
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 z-30"
                    style={{
                      animation:
                        "qbStamp .65s cubic-bezier(.18,1.5,.4,1) both",
                    }}
                  >
                    <div className="rotate-[-4deg] rounded-xl border-2 border-green-400 bg-[#07130d]/95 px-6 py-3 shadow-[0_0_45px_rgba(34,197,94,.2)]">
                      <p className="text-sm font-black uppercase tracking-[2px] text-green-400">
                        ✓ Confirmed
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom confirmation */}
              {isConfirmed && (
                <div
                  className="mt-7"
                  style={{
                    animation:
                      "qbRise .6s cubic-bezier(.22,1,.36,1) .2s both",
                  }}
                >
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-400"
                    style={{
                      animation:
                        "qbPop .55s cubic-bezier(.22,1,.36,1) .25s both",
                    }}
                  >
                    <span className="text-2xl">
                      ✓
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    You're all set!
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Your booking has been confirmed successfully.
                  </p>

                  <div className="mx-auto mt-5 h-1 w-52 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full bg-[#ed1c24]"
                      style={{
                        animation:
                          "qbProgress 2.8s linear forwards",
                      }}
                    />
                  </div>

                  <p className="mt-3 text-[9px] uppercase tracking-[2px] text-zinc-700">
                    Taking you to your booking
                  </p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}