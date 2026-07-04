import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../shared/constants";
import Navbar from "./Navbar";

const Body = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/user/profile`,
          {
            withCredentials: true,
          }
        );

        if (res.data?.data) {
          setAuthenticated(true);
        }
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  if (loading) {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-600 tracking-wider animate-pulse">
          QUICKBOOK
        </h1>

        <div className="flex justify-center gap-2 mt-6">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060A] text-white">
      {/* Glow 1 */}
      <div className="pointer-events-none absolute left-[-200px] top-[250px] h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[180px]" />

      {/* Glow 2 */}
      <div className="pointer-events-none absolute right-[-250px] bottom-[100px] h-[500px] w-[500px] rounded-full bg-red-700/10 blur-[180px]" />

      {/* Glow 3 */}
      <div className="pointer-events-none absolute left-1/2 top-[800px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-500/5 blur-[180px]" />

      <Navbar />

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
export default Body;