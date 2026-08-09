import { useState } from "react";
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

  const navigate = useNavigate();
  const userDispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      userDispatch(addUser(response?.data?.data ?? response?.data));
      navigate("/movies");
    } catch (err) {
      setError("Login failed. Please check your information and try again." + err?.message);
    }
  };

  const handleSignUp = async () => {
    try {
      setError("");

      const response = await axios.post(
        `${BASE_URL}/user/register`,
        {
          name,
          email,
          password,
          phone,
        },
        { withCredentials: true }
      );

      // Some backends return the created user; others rely on the session cookie.
      const payload = response?.data?.data ?? response?.data;
      if (payload) userDispatch(addUser(payload));

      navigate("/movies");
    } catch (err) {
      setError("Sign-up failed. Please check your information and try again." + err?.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] relative overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[180px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[180px]" />

      <img
        src={HomePage}
        alt="Dashboard"
        className="
          hidden
          lg:block
          absolute
          right-[-150px]
          top-1/2
          -translate-y-1/2
          w-[900px]
          opacity-15
          select-none
          pointer-events-none
        "
      />

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex w-1/2 items-center px-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="uppercase tracking-[0.3em] text-red-400 text-sm font-medium">
                QuickBook
              </span>
            </div>

            <h1 className="text-white text-7xl font-bold leading-[1.1]">
              Book
              <br />
              Smarter.
              <br />
              Reserve
              <br />
              Faster.

            </h1>

            <p className="mt-8 max-w-xl text-lg text-zinc-400 leading-relaxed">
              Manage bookings, schedules, payments and customer experiences from a single modern platform.
            </p>

            <div className="flex gap-10 mt-12">
              <div>
                <h3 className="text-white text-3xl font-bold">10K+</h3>
                <p className="text-zinc-500 mt-1">Monthly Bookings</p>
              </div>
              <div>
                <h3 className="text-white text-3xl font-bold">99.9%</h3>
                <p className="text-zinc-500 mt-1">Uptime</p>
              </div>
              <div>
                <h3 className="text-white text-3xl font-bold">24/7</h3>
                <p className="text-zinc-500 mt-1">Support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              p-8
              shadow-[0_0_60px_rgba(0,0,0,0.4)]
            "
          >
            <div className="lg:hidden text-center mb-10">
              <h1 className="text-4xl font-bold text-white">QuickBook</h1>
              <p className="text-zinc-400 mt-2">Smart Booking Platform</p>
            </div>

            <div className="flex bg-white/5 rounded-xl p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg font-medium transition ${
                  isLogin ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg font-medium transition ${
                  !isLogin ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-4xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-zinc-400 mt-2 mb-8">
              {isLogin ? "Login to continue your journey." : "Create your account and start booking."}
            </p>

            <div className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block mb-2 text-zinc-300 text-sm">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4
                      py-3
                      text-white
                      placeholder:text-zinc-500
                      outline-none
                      focus:border-red-500
                    "
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 text-zinc-300 text-sm">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                    text-white
                    placeholder:text-zinc-500
                    outline-none
                    focus:border-red-500
                  "
                />
              </div>

              <div>
                <label className="block mb-2 text-zinc-300 text-sm">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                    text-white
                    placeholder:text-zinc-500
                    outline-none
                    focus:border-red-500
                  "
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block mb-2 text-zinc-300 text-sm">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    onChange={(e) => setPhone(e.target.value)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4
                      py-3
                      text-white
                      placeholder:text-zinc-500
                      outline-none
                      focus:border-red-500
                    "
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-red-400 hover:text-red-300">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="button"
                className="
                  w-full
                  rounded-xl
                  bg-red-600
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                "
                onClick={isLogin ? handleLogin : handleSignUp}
              >
                {isLogin ? "Login" : "Create Account"}
              </button>

              {error && <div className="mt-4 text-red-400 text-center">{error}</div>}
            </div>

            <div className="mt-8 text-center">
              <span className="text-zinc-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-red-400 hover:text-red-300 font-medium"
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


