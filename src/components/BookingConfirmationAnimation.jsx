import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Cinematic booking confirmation overlay - Tailwind CSS Version
 * PURELY VISUAL: never creates a booking, never calls any API.
 */

export const PHASES = {
  VERIFYING: "VERIFYING",
  TICKET_ASSEMBLING: "TICKET_ASSEMBLING",
  TICKET_ROTATING: "TICKET_ROTATING",
  TICKET_FLIPPING: "TICKET_FLIPPING",
  CONFIRMED: "CONFIRMED",
  REDIRECTING: "REDIRECTING",
};

const ORDER = [
  PHASES.VERIFYING,
  PHASES.TICKET_ASSEMBLING,
  PHASES.TICKET_ROTATING,
  PHASES.TICKET_FLIPPING,
  PHASES.CONFIRMED,
  PHASES.REDIRECTING,
];

const FULL_TIMINGS = {
  [PHASES.VERIFYING]: 1100,
  [PHASES.TICKET_ASSEMBLING]: 1000,
  [PHASES.TICKET_ROTATING]: 900,
  [PHASES.TICKET_FLIPPING]: 1150,
  [PHASES.CONFIRMED]: 2400,
};

const REDUCED_TIMINGS = {
  [PHASES.VERIFYING]: 700,
  [PHASES.TICKET_ASSEMBLING]: 320,
  [PHASES.TICKET_ROTATING]: 0,
  [PHASES.TICKET_FLIPPING]: 260,
  [PHASES.CONFIRMED]: 1500,
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function pick(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
}

function formatTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function readTicket(booking) {
  const b = booking || {};
  const show = b.show || b.showId || b.showtime || {};
  const movie = b.movie || show.movie || b.movieId || {};
  const seats = pick(b.seats, b.bookedSeats, b.seatNumbers, show.seats) || [];
  
  const seatList = Array.isArray(seats)
    ? seats.map((seat) => {
        if (typeof seat === "string") return seat;
        if (typeof seat === "object" && seat !== null) {
          return pick(seat.seatNumber, seat.seatLabel, seat.label, seat.name, seat.id, "");
        }
        return "";
      })
    : [];
    
  const showDate = pick(b.showDateTime, show.showDateTime, show.startTime, show.date, b.date);
  const id = String(pick(b._id, b.id, b.bookingId, "") || "");

  return {
    movieTitle: pick(typeof movie === "string" ? movie : movie?.title, movie?.name, b.movieTitle, "YOUR MOVIE"),
    screenLabel: pick(show?.screenType, show?.format, b.screenType, "Premium Screen"),
    date: formatDate(showDate),
    time: pick(formatTime(showDate), show?.time, b.time, "—"),
    screen: pick(show?.screen, show?.screenName, show?.hall, b.screen, "—"),
    seats: seatList.filter(Boolean).join(" ") || "—",
    ticketNo: id ? `#${id.slice(-8).toUpperCase()}` : "#PREMIUM",
  };
}

export default function BookingConfirmationAnimation({ booking, onComplete }) {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState(PHASES.VERIFYING);
  const [showConfetti, setShowConfetti] = useState(false);
  const completedRef = useRef(false);
  const timings = reducedMotion ? REDUCED_TIMINGS : FULL_TIMINGS;
  const ticket = useMemo(() => readTicket(booking), [booking]);

  // Animation state machine
  useEffect(() => {
    if (phase === PHASES.REDIRECTING) return;
    const next = ORDER[ORDER.indexOf(phase) + 1];
    const timer = setTimeout(() => {
      setPhase(next);
      if (next === PHASES.CONFIRMED) setShowConfetti(true);
    }, timings[phase] ?? 0);
    return () => clearTimeout(timer);
  }, [phase, timings]);

  // Redirect once after animation completes
  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (phase !== PHASES.REDIRECTING) return;
    const timer = setTimeout(finish, 350);
    return () => clearTimeout(timer);
  }, [phase, finish]);

  const showVerify = phase === PHASES.VERIFYING;
  const showHalves = phase === PHASES.TICKET_ASSEMBLING;
  const showComplete = phase !== PHASES.VERIFYING && phase !== PHASES.TICKET_ASSEMBLING;
  const isFlipped = phase === PHASES.TICKET_FLIPPING || phase === PHASES.CONFIRMED || phase === PHASES.REDIRECTING;
  const confirmed = phase === PHASES.CONFIRMED || phase === PHASES.REDIRECTING;

  // Generate confetti particles
  const confettiParticles = useMemo(() => {
    if (!showConfetti || reducedMotion) return [];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 0.5}s`,
      animationDuration: `${1.5 + Math.random() * 2}s`,
      color: ['#F97316', '#EF4444', '#FFD700', '#FBBF24', '#F59E0B', '#FEE2E2'][Math.floor(Math.random() * 6)],
      size: `${6 + Math.random() * 8}px`,
      xDrift: `${(Math.random() - 0.5) * 200}px`,
    }));
  }, [showConfetti, reducedMotion]);

  return (
    <>
      {/* Inline keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes checkDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.3); }
          100% { box-shadow: 0 0 0 22px rgba(249, 115, 22, 0); }
        }
        @keyframes flyLeft {
          0% { transform: translateX(-100vw) translateY(-40px) rotate(-12deg) scale(0.9); opacity: 0; }
          55% { opacity: 1; }
          100% { transform: translateX(-85px) translateY(0) rotate(0deg) scale(1); opacity: 1; }
        }
        @keyframes flyRight {
          0% { transform: translateX(100vw) translateY(40px) rotate(12deg) scale(0.9); opacity: 0; }
          55% { opacity: 1; }
          100% { transform: translateX(85px) translateY(0) rotate(0deg) scale(1); opacity: 1; }
        }
        @keyframes shockwave {
          0% { transform: scale(0.2); opacity: 0.9; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        @keyframes tilt3D {
          0% { transform: rotateY(180deg) rotateX(0deg); }
          45% { transform: rotateY(196deg) rotateX(9deg) scale(1.03); }
          100% { transform: rotateY(180deg) rotateX(0deg); }
        }
        @keyframes stampIn {
          0% { transform: rotate(-16deg) scale(0.4); opacity: 0; }
          60% { transform: rotate(-9deg) scale(1.12); opacity: 1; }
          100% { transform: rotate(-9deg) scale(1); opacity: 1; }
        }
        @keyframes riseUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg) scale(0); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) scale(1); opacity: 0; }
        }
        @keyframes progressBar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>

      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-6 overflow-hidden"
        style={{ 
          background: 'radial-gradient(120% 90% at 50% 0%, rgba(249, 115, 22, 0.12) 0%, rgba(10, 10, 14, 0) 60%), radial-gradient(100% 80% at 50% 100%, rgba(120, 80, 255, 0.08) 0%, rgba(10, 10, 14, 0) 55%), #08080c',
          animation: 'fadeIn 0.42s cubic-bezier(0.22, 1, 0.36, 1) both'
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Booking confirmation"
      >
        {/* Vignette effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(70% 60% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.75) 100%)' }}
        />

        {/* Confetti particles */}
        {showConfetti && confettiParticles.map(particle => (
          <div
            key={particle.id}
            className="fixed rounded-sm pointer-events-none"
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              animation: `confettiFall ${particle.animationDuration} ease-out ${particle.animationDelay} forwards`,
              top: '-20px',
            }}
          />
        ))}

        {/* Stage container */}
        <div className="relative w-full max-w-[460px] flex flex-col items-center gap-6 text-center z-10">
          
          {/* Phase 1: Payment Verified */}
          {showVerify && (
            <div className="flex flex-col items-center gap-3.5" style={{ animation: 'scaleIn 0.3s ease-out' }}>
              <div 
                className="w-[72px] h-[72px] rounded-full grid place-items-center border"
                style={{ 
                  borderColor: 'rgba(249, 115, 22, 0.45)',
                  animation: 'pulse 1.6s ease-out infinite'
                }}
              >
                <svg className="w-[34px] h-[34px]" viewBox="0 0 24 24" aria-hidden="true">
                  <path 
                    d="M4.5 12.5 10 18 20 6.5"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="34"
                    strokeDashoffset="34"
                    style={{ animation: 'checkDraw 0.52s cubic-bezier(0.65, 0, 0.35, 1) 0.12s forwards' }}
                  />
                </svg>
              </div>
              <h2 className="text-[19px] font-semibold text-[#f5f2ea] tracking-wide">Payment Verified</h2>
              <p className="text-[13.5px] text-white/60 tracking-wider">Securing your seats…</p>
            </div>
          )}

          {/* Ticket container */}
          {!showVerify && (
            <div className="relative w-full max-w-[400px] h-[300px] flex items-center justify-center" style={{ perspective: '1400px' }}>
              
              {/* Phase 2: Two halves fly in */}
              {showHalves && (
                <>
                  {/* Left half */}
                  <div 
                    className="absolute w-[170px] h-[250px] rounded-l-[18px] overflow-hidden border border-r-0"
                    style={{
                      background: 'linear-gradient(155deg, #17171f 0%, #101018 55%, #0c0c12 100%)',
                      borderColor: 'rgba(249, 115, 22, 0.22)',
                      boxShadow: '0 30px 70px -28px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.03) inset',
                      animation: 'flyLeft 0.9s cubic-bezier(0.16, 0.9, 0.25, 1) forwards',
                    }}
                  >
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(249,115,22,0.06)_0_2px,transparent_2px_12px)] grid place-items-center">
                      <div className="text-center">
                        <div className="text-[22px] font-extrabold tracking-[0.42em] text-[#F97316] indent-[0.42em]">MOVIEBOOK</div>
                        <div className="text-[10.5px] tracking-[0.28em] uppercase text-white/45 mt-2.5">Generating…</div>
                      </div>
                    </div>
                    {/* Perforation dots */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-2 bg-[#08080c] rounded-full" />
                      ))}
                    </div>
                  </div>

                  {/* Right half */}
                  <div 
                    className="absolute w-[170px] h-[250px] rounded-r-[18px] overflow-hidden border border-l-0"
                    style={{
                      background: 'linear-gradient(155deg, #17171f 0%, #101018 55%, #0c0c12 100%)',
                      borderColor: 'rgba(249, 115, 22, 0.22)',
                      boxShadow: '0 30px 70px -28px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.03) inset',
                      animation: 'flyRight 0.9s cubic-bezier(0.16, 0.9, 0.25, 1) forwards',
                    }}
                  >
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(249,115,22,0.06)_0_2px,transparent_2px_12px)] grid place-items-center">
                      <div className="text-center">
                        <div className="text-[22px] font-extrabold tracking-[0.42em] text-[#F97316] indent-[0.42em]">MOVIEBOOK</div>
                        <div className="text-[10.5px] tracking-[0.28em] uppercase text-white/45 mt-2.5">Generating…</div>
                      </div>
                    </div>
                    {/* Perforation dots */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-2 bg-[#08080c] rounded-full" />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Phases 3-6: Complete ticket with flip */}
              {showComplete && (
                <>
                  {/* Shockwave */}
                  {phase === PHASES.TICKET_ROTATING && (
                    <div 
                      className="absolute w-[120px] h-[120px] rounded-full border pointer-events-none"
                      style={{
                        borderColor: 'rgba(249, 115, 22, 0.6)',
                        animation: 'shockwave 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                      }}
                    />
                  )}

                  {/* Flipper container */}
                  <div 
                    className="relative w-[340px] h-[250px]"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                      transition: 'transform 1.1s cubic-bezier(0.6, 0.02, 0.2, 1)',
                      animation: phase === PHASES.TICKET_ROTATING ? 'tilt3D 0.9s cubic-bezier(0.4, 0, 0.2, 1) both' : 'none',
                    }}
                  >
                    {/* Back face */}
                    <div 
                      className="absolute inset-0 rounded-[18px] overflow-hidden border"
                      style={{
                        background: 'linear-gradient(155deg, #17171f 0%, #101018 55%, #0c0c12 100%)',
                        borderColor: 'rgba(249, 115, 22, 0.22)',
                        boxShadow: '0 30px 70px -28px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.03) inset',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(249,115,22,0.06)_0_2px,transparent_2px_12px)] grid place-items-center">
                        <div className="text-center">
                          <div className="text-[22px] font-extrabold tracking-[0.42em] text-[#F97316] indent-[0.42em]">MOVIEBOOK</div>
                          <div className="text-[10.5px] tracking-[0.28em] uppercase text-white/45 mt-2.5">Generating your ticket…</div>
                          <div className="mt-8 space-y-2">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Front face */}
                    <div 
                      className="absolute inset-0 rounded-[18px] overflow-hidden border"
                      style={{
                        background: 'linear-gradient(155deg, #17171f 0%, #101018 55%, #0c0c12 100%)',
                        borderColor: 'rgba(249, 115, 22, 0.22)',
                        boxShadow: '0 30px 70px -28px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.03) inset',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <div className="absolute inset-0 flex">
                        {/* Main content */}
                        <div className="flex-1 p-4 flex flex-col gap-2 text-left">
                          <span className="text-[9.5px] tracking-[0.34em] uppercase text-orange-500/85">MOVIEBOOK · Movie Ticket</span>
                          <h3 className="text-[21px] leading-tight font-bold text-[#f7f4ec] line-clamp-2">{ticket.movieTitle}</h3>
                          <span className="text-[11px] text-white/50 tracking-[0.12em] uppercase">{ticket.screenLabel}</span>
                          
                          <div className="mt-auto grid grid-cols-3 gap-2">
                            <div>
                              <div className="text-[8.5px] tracking-[0.22em] uppercase text-white/40">Date</div>
                              <div className="text-[11px] font-semibold text-[#f2eee3]">{ticket.date}</div>
                            </div>
                            <div>
                              <div className="text-[8.5px] tracking-[0.22em] uppercase text-white/40">Screen</div>
                              <div className="text-[11px] font-semibold text-[#f2eee3]">{ticket.screen}</div>
                            </div>
                            <div>
                              <div className="text-[8.5px] tracking-[0.22em] uppercase text-white/40">Time</div>
                              <div className="text-[11px] font-semibold text-[#f2eee3]">{ticket.time}</div>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-[8.5px] tracking-[0.22em] uppercase text-white/40">Seats</div>
                            <div className="text-[11px] font-semibold text-[#f2eee3]">{ticket.seats}</div>
                          </div>
                          
                          <div className="mt-3 self-start text-[9.5px] tracking-[0.24em] uppercase text-green-400 border border-green-400/35 bg-green-400/10 rounded-full px-2.5 py-1">
                            ● BOOKED
                          </div>
                        </div>

                        {/* Stub with barcode */}
                        <div className="w-[92px] flex flex-col items-center justify-center gap-2.5 p-3.5 bg-gradient-to-b from-orange-500/10 to-orange-500/5 border-l-2 border-dashed border-white/20">
                          <div className="flex gap-0.5 items-end h-[46px]">
                            {[...Array(22)].map((_, i) => (
                              <div 
                                key={i} 
                                className="bg-white/80 rounded-sm"
                                style={{ width: i % 3 === 0 ? '3px' : '2px', height: `${Math.min(1, 0.4 + ((i * 37) % 11) / 14) * 100}%` }}
                              />
                            ))}
                          </div>
                          <div className="w-[46px] h-[46px] rounded-md bg-[#f5f2ea] relative overflow-hidden">
                            <div className="absolute inset-0" style={{
                              backgroundImage: 'linear-gradient(90deg, #0b0b10 25%, transparent 25% 50%, #0b0b10 50% 62%, transparent 62%), linear-gradient(0deg, #0b0b10 18%, transparent 18% 44%, #0b0b10 44% 58%, transparent 58%)',
                              backgroundSize: '12px 12px, 12px 12px'
                            }} />
                          </div>
                          <div className="text-[8.5px] tracking-[0.14em] text-white/55" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                            {ticket.ticketNo}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation stamp */}
                  {confirmed && (
                    <div 
                      className="absolute z-[3] bottom-[22px] right-[10px] px-4 py-2.5 border-2 border-green-400 rounded-lg text-green-400 text-[13px] font-extrabold tracking-[0.18em] uppercase"
                      style={{
                        background: 'rgba(8, 20, 14, 0.55)',
                        boxShadow: '0 0 40px -6px rgba(126, 224, 168, 0.5)',
                        animation: 'stampIn 0.72s cubic-bezier(0.18, 1.5, 0.4, 1) forwards',
                      }}
                    >
                      ✓ Booking Confirmed
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Footer */}
          {confirmed && (
            <div className="grid gap-1.5 justify-items-center" style={{ animation: 'riseUp 0.62s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
              <h2 className="text-xl font-bold text-[#f5f2ea]">You're All Set! 🎬</h2>
              <p className="text-[13.5px] text-white/60 tracking-wider">Your movie ticket is confirmed.</p>
              <span className="text-xs tracking-[0.16em] uppercase text-white/50 mt-1">Taking you to your booking…</span>
              <div className="mt-1.5 w-[190px] h-0.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500/20 to-orange-500 origin-left"
                  style={{ animation: `progressBar ${timings[PHASES.CONFIRMED]}ms linear forwards` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}