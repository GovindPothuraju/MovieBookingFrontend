import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../shared/constants";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Body = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/profile`, {
          withCredentials: true,
        });

        setAuthenticated(!!res.data?.data);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <div className="text-center">
          <h1 className="animate-pulse text-5xl font-bold tracking-wider text-red-600">
            QUICKBOOK
          </h1>
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-red-600" />
            <div className="h-3 w-3 animate-bounce rounded-full bg-red-600 delay-100" />
            <div className="h-3 w-3 animate-bounce rounded-full bg-red-600 delay-200" />
          </div>
        </div>
      </div>
    );

  if (!authenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05060A] text-white">
      <Navbar />

      <main className="relative z-10 pt-[90px]">
        <Outlet />
      </main>

      <Footer/>
    </div>
  );
};

export default Body;