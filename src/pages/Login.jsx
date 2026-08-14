import { useState, useEffect } from "react";
import HomePage from "../shared/assets/HomePage.webp";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../shared/constants";
import axios from "axios";
import { addUser } from "../app/store/userSlice";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userDispatch = useDispatch();

  const getUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/profile`, {
        withCredentials: true,
      });

      if (response.data.success) navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleLogin = async () => {
  if (loading) return;

  try {
    setError("");
    setLoading(true);

    const response = await axios.post(
      `${BASE_URL}/user/login`,
      { email, password },
      { withCredentials: true }
    );

    userDispatch(addUser(response?.data?.data ?? response?.data));
    navigate("/home");
  } catch (err) {
    setError(
      err?.response?.data?.message ||
        "Login failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const handleSignUp = async () => {
  if (loading) return;

  try {
    setError("");
    setLoading(true);

    const response = await axios.post(
      `${BASE_URL}/user/register`,
      { name, email, password, phone },
      { withCredentials: true }
    );

    const payload = response?.data?.data ?? response?.data;

    if (payload) userDispatch(addUser(payload));

    navigate("/movies");
  } catch (err) {
    setError(
      err?.response?.data?.message ||
        "Sign-up failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const switchMode = (login) => {
    setIsLogin(login);
    setError("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090B]">
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[180px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[180px]" />

      <img
        src={HomePage}
        alt="Dashboard"
        className="pointer-events-none absolute right-[-150px] top-1/2 hidden w-[900px] -translate-y-1/2 select-none opacity-15 lg:block"
      />

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden w-1/2 items-center px-20 lg:flex">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium uppercase tracking-[0.3em] text-red-400">
                QuickBook
              </span>
            </div>

            <h1 className="text-7xl font-bold leading-[1.1] text-white">
              Book
              <br />
              Smarter.
              <br />
              Reserve
              <br />
              Faster.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
              Manage bookings, schedules, payments and customer
              experiences from a single modern platform.
            </p>

            <div className="mt-12 flex gap-10">
              <div>
                <h3 className="text-3xl font-bold text-white">10K+</h3>
                <p className="mt-1 text-zinc-500">Monthly Bookings</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">99.9%</h3>
                <p className="mt-1 text-zinc-500">Uptime</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">24/7</h3>
                <p className="mt-1 text-zinc-500">Support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="mb-10 text-center lg:hidden">
              <h1 className="text-4xl font-bold text-white">
                QuickBook
              </h1>
              <p className="mt-2 text-zinc-400">
                Smart Booking Platform
              </p>
            </div>

            <div className="mb-8 flex rounded-xl bg-white/5 p-1">
              <button
                type="button"
                onClick={() => switchMode(true)}
                className={`flex-1 rounded-lg py-3 font-medium transition ${
                  isLogin
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => switchMode(false)}
                className={`flex-1 rounded-lg py-3 font-medium transition ${
                  !isLogin
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-4xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="mb-8 mt-2 text-zinc-400">
              {isLogin
                ? "Login to continue your journey."
                : "Create your account and start booking."}
            </p>

            <div className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-red-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-red-500"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-red-500"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={isLogin ? handleLogin : handleSignUp}
                className={`
                  group relative w-full overflow-hidden rounded-xl
                  bg-red-600 py-3 font-semibold text-white
                  transition-all duration-200
                  ${
                    loading
                      ? "cursor-not-allowed opacity-80"
                      : "hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-[0.97]"
                  }
                `}
              >
                {/* Animated shine */}
                {!loading && (
                  <span
                    className="
                      absolute inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent via-white/20 to-transparent
                      transition-transform duration-700
                      group-hover:translate-x-full
                    "
                  />
                )}

                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      {/* Spinner */}
                      <span
                        className="
                          h-5 w-5 animate-spin rounded-full
                          border-2 border-white/30
                          border-t-white
                        "
                      />

                      <span>
                        {isLogin ? "Logging in..." : "Creating account..."}
                      </span>
                    </>
                  ) : (
                    <span>
                      {isLogin ? "Login" : "Create Account"}
                    </span>
                  )}
                </span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <span className="text-zinc-400">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>

              <button
                type="button"
                onClick={() => switchMode(!isLogin)}
                className="ml-2 font-medium text-red-400 hover:text-red-300"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;