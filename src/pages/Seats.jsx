import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const Seats = () => {
  const { showId } = useParams();

  const [loading, setLoading] = useState(true);
  const [showData, setShowData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [priceMap, setPriceMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);

  const getSeats = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/shows/${showId}/seats`,
        {
          withCredentials: true,
        }
      );

      setShowData(response.data.data);
      setSeats(response.data.data.seats);
      setPriceMap(response.data.data.priceMap);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSeats();
  }, []);

  const seatsByCategory = useMemo(() => {
    const grouped = {};

    seats.forEach((seat) => {
      if (!grouped[seat.category]) {
        grouped[seat.category] = {};
      }

      if (!grouped[seat.category][seat.row]) {
        grouped[seat.category][seat.row] = [];
      }

      grouped[seat.category][seat.row].push(seat);
    });

    Object.keys(grouped).forEach((category) => {
      Object.keys(grouped[category]).forEach((row) => {
        grouped[category][row].sort(
          (a, b) => a.column - b.column
        );
      });
    });

    return grouped;
  }, [seats]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    const exists = selectedSeats.find(
      (s) => s._id === seat._id
    );

    if (exists) {
      setSelectedSeats(
        selectedSeats.filter(
          (s) => s._id !== seat._id
        )
      );
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const isSelected = (seatId) => {
    return selectedSeats.some(
      (seat) => seat._id === seatId
    );
  };

  const totalAmount = selectedSeats.reduce(
    (total, seat) =>
      total +
      (priceMap?.[seat.category]?.price || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading Seats...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-center text-4xl font-bold text-white">
        Select Seats
      </h1>

      <p className="mb-10 text-center text-zinc-400">
        {new Date(
          showData?.showTime
        ).toLocaleString()}
      </p>

      {/* Legend */}

      <div className="mb-10 flex flex-wrap justify-center gap-8">
        <div className="flex items-center gap-2 text-white">
          <div className="h-4 w-4 rounded bg-green-500"></div>
          Available
        </div>

        <div className="flex items-center gap-2 text-white">
          <div className="h-4 w-4 rounded bg-red-500"></div>
          Selected
        </div>

        <div className="flex items-center gap-2 text-white">
          <div className="h-4 w-4 rounded bg-zinc-700"></div>
          Booked
        </div>
      </div>

      {/* Seat Categories */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        {Object.entries(seatsByCategory).map(
          ([category, rows]) => (
            <div
              key={category}
              className="mb-14"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {category}
                  </h2>

                  <p className="text-red-400">
                    ₹
                    {
                      priceMap?.[category]
                        ?.price
                    }
                  </p>
                </div>

                <div className="text-sm text-zinc-400">
                  Available{" "}
                  {
                    priceMap?.[category]
                      ?.availableSeats
                  }
                  /
                  {
                    priceMap?.[category]
                      ?.totalSeats
                  }
                </div>
              </div>

              {Object.entries(rows).map(
                ([row, rowSeats]) => (
                  <div
                    key={row}
                    className="mb-4 flex items-center justify-center gap-2"
                  >
                    <span className="mr-6 w-5 font-bold text-zinc-500">
                      {row}
                    </span>

                    {rowSeats.map(
                      (seat, index) => (
                        <div
                          key={seat._id}
                        >
                          {index ===
                            Math.floor(
                              rowSeats.length /
                                2
                            ) && (
                            <div className="inline-block w-8" />
                          )}

                          <button
                            onClick={() =>
                              handleSeatClick(
                                seat
                              )
                            }
                            disabled={
                              seat.isBooked
                            }
                            className={`
                              h-10
                              w-10
                              rounded-md
                              text-xs
                              font-semibold
                              transition-all
                              ${
                                seat.isBooked
                                  ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                                  : isSelected(
                                      seat._id
                                    )
                                  ? "bg-red-500 text-white"
                                  : "bg-green-500 text-white hover:scale-105"
                              }
                            `}
                          >
                            {seat.column}
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </div>
          )
        )}
      </div>

      {/* Screen */}

      <div className="mt-16 flex flex-col items-center">
        <p className="mb-4 text-lg font-semibold text-zinc-300">
          Screen
        </p>

        <div className="h-3 w-[75%] rounded-full bg-gradient-to-r from-zinc-700 via-white to-zinc-700"></div>

        <p className="mt-4 text-sm tracking-[0.4em] text-zinc-500">
          SCREEN THIS WAY
        </p>
      </div>

      {/* Pricing */}

      <div className="mt-14 flex flex-wrap justify-center gap-6">
        {Object.entries(priceMap).map(
          ([category, details]) => (
            <div
              key={category}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center"
            >
              <h3 className="font-semibold text-white">
                {category}
              </h3>

              <p className="mt-1 text-red-400">
                ₹{details.price}
              </p>
            </div>
          )
        )}
      </div>

      {/* Footer */}

      <div className="sticky bottom-4 mt-16 rounded-3xl border border-white/10 bg-black/80 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold text-white">
              Selected Seats
            </h3>

            <p className="mt-2 text-zinc-400">
              {selectedSeats.length
                ? selectedSeats
                    .map(
                      (seat) =>
                        seat.seatLabel
                    )
                    .join(", ")
                : "No seats selected"}
            </p>
          </div>

          <div>
            <h3 className="text-zinc-400">
              Total Amount
            </h3>

            <p className="text-3xl font-bold text-white">
              ₹{totalAmount}
            </p>
          </div>

          <button
            disabled={
              selectedSeats.length === 0
            }
            className="
              rounded-2xl
              bg-red-500
              px-8
              py-4
              font-semibold
              text-white
              transition
              hover:bg-red-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Proceed To Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Seats;