import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../shared/constants";

const Seats = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showData, setShowData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [priceMap, setPriceMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);

  const getSeats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/shows/${showId}/seats`, { withCredentials: true });
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
      if (!grouped[seat.category]) grouped[seat.category] = {};
      if (!grouped[seat.category][seat.row]) grouped[seat.category][seat.row] = [];
      grouped[seat.category][seat.row].push(seat);
    });
    Object.keys(grouped).forEach((category) => Object.keys(grouped[category]).forEach((row) => grouped[category][row].sort((a, b) => a.column - b.column)));
    return grouped;
  }, [seats]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    const exists = selectedSeats.find((s) => s._id === seat._id);
    if (exists) setSelectedSeats(selectedSeats.filter((s) => s._id !== seat._id));
    else setSelectedSeats([...selectedSeats, seat]);
  };

  const isSelected = (seatId) => selectedSeats.some((seat) => seat._id === seatId);

  const totalAmount = selectedSeats.reduce((total, seat) => total + (priceMap?.[seat.category]?.price || 0), 0);

  const handleProceedToPayment = async () => {
    try {
      const payload = { showId, seats: selectedSeats };
      const response = await axios.post(`${BASE_URL}/user/bookings/lock`, payload, { withCredentials: true });
      navigate("/payment", { state: { showId, selectedSeats, totalAmount, expiresIn: response.data.expiresIn } });
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data.message);
        getSeats();
        setSelectedSeats([]);
        return;
      }
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#05060A] text-white"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-[#ed1c24]" /></div>;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05060A] px-2 pb-28 pt-5 text-white sm:px-4">
      <div className="mx-auto max-w-[900px]">

        <div className="mb-4 text-center">
          <h1 className="text-lg font-bold sm:text-xl">{showData?.movie?.title || "Select Seats"}</h1>
          <p className="mt-1 text-[9px] text-zinc-500">{showData?.showTime ? new Date(showData.showTime).toLocaleString("en-IN") : ""}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#08090D] px-2 py-6 sm:px-5">

        <div className="mx-auto mb-7 w-full max-w-[700px]">
          <div className="relative mx-auto h-[65px] w-[82%] overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[100px] w-[115%] -translate-x-1/2 rounded-b-[50%] border-b-[10px] border-red-500/80 bg-gradient-to-b from-red-500/20 via-red-500/10 to-transparent shadow-[0_12px_45px_rgba(239,28,36,0.45),0_0_35px_rgba(239,28,36,0.25)] backdrop-blur-md" />

            <div className="absolute left-1/2 top-0 h-[45px] w-[85%] -translate-x-1/2 rounded-b-[50%] border-b border-red-300/30 bg-red-500/[0.08] shadow-[inset_0_-8px_20px_rgba(255,80,80,0.12)]" />

            <span className="absolute left-1/2 top-4 -translate-x-1/2 text-[8px] font-medium uppercase tracking-[3px] text-red-200/60">
              SCREEN
            </span>
          </div>
        </div>

          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto min-w-[600px] max-w-[760px]">

              {Object.entries(seatsByCategory).map(([category, rows]) => (
                <div key={category} className="mb-7 last:mb-1">

                  <div className="mb-3 flex items-center justify-between px-8">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-white">{category}</p>
                      <p className="mt-0.5 text-[8px] text-[#ed1c24]">₹{priceMap?.[category]?.price}</p>
                    </div>
                    <p className="text-[8px] text-zinc-600">{priceMap?.[category]?.availableSeats} available</p>
                  </div>

                  {Object.entries(rows).map(([row, rowSeats]) => (
                    <div key={row} className="mb-1.5 flex items-center justify-center">
                      <span className="mr-2 w-3 text-right text-[8px] font-semibold text-zinc-500">{row}</span>

                      <div className="flex items-center gap-[4px]">
                        {rowSeats.map((seat, index) => (
                          <div key={seat._id} className="flex items-center">
                            {index === Math.floor(rowSeats.length / 2) && <div className="w-5" />}

                          <button type="button" onClick={() => handleSeatClick(seat)} disabled={seat.isBooked} className={`h-[18px] w-[18px] rounded-[4px] border text-[6px] font-bold transition-all sm:h-[20px] sm:w-[20px] ${seat.isBooked ? "cursor-not-allowed border-red-950 bg-[#171719] text-zinc-700" : isSelected(seat._id) ? "border-red-400 bg-[#ed1c24] text-white shadow-[0_0_12px_rgba(237,28,36,0.6)]" : "border-[#ed1c24]/70 bg-[#141416] text-red-300 hover:scale-110 hover:border-red-400 hover:bg-[#1d1d20] hover:shadow-[0_0_8px_rgba(237,28,36,0.3)]"}`}>
                            {seat.column}
                            </button>
                          </div>
                        ))}
                      </div>

                      <span className="ml-2 w-3 text-[8px] font-semibold text-zinc-500">{row}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-6 flex max-w-[600px] justify-center gap-5 border-t border-white/[0.05] pt-4 text-[8px] text-zinc-500 sm:gap-8">
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[2px] bg-[#f1f0e8]" />Available</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[2px] bg-[#3f4000]" />Booked</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[2px] bg-[#ed1c24]" />Selected</div>
          </div>                
          <div className="mt-3 text-center text-[8px] text-zinc-600">
            {selectedSeats.length ? `${selectedSeats.length} Selected Seats` : "Select your seats"}
          </div>

        </div>

        <div className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-16px)] max-w-[700px] -translate-x-1/2 rounded-xl border border-white/[0.08] bg-[#111113]/95 px-3 py-2.5 shadow-2xl backdrop-blur-xl sm:bottom-5 sm:px-4">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[7px] uppercase tracking-[1.5px] text-zinc-500">Selected</p>
              <p className="mt-0.5 truncate text-[9px] font-semibold text-white">{selectedSeats.length ? selectedSeats.map((seat) => seat.seatLabel).join(", ") : "No seats selected"}</p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[7px] text-zinc-500">Total</p>
              <p className="text-sm font-bold text-white">₹{totalAmount}</p>
            </div>

            <button type="button" disabled={selectedSeats.length === 0} onClick={handleProceedToPayment} className="rounded-lg bg-[#ed1c24] px-4 py-2.5 text-[9px] font-bold text-white transition hover:bg-[#d91820] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6">
              Proceed
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Seats;