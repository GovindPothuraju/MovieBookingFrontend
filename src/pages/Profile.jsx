import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  CalendarDays,
} from "lucide-react";
import { BASE_URL } from "../shared/constants";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/profile`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        setProfile(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);

      setError(
        err?.response?.data?.message || "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080809] px-5 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-red-500" />

          <p className="text-sm text-zinc-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080809] px-5 text-white">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-5 text-center">
          <p className="text-sm text-red-400">
            {error || "Profile not found."}
          </p>
        </div>
      </div>
    );
  }

  const firstLetter =
    profile.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#080809] text-white">
      <main className="relative overflow-hidden px-5 pb-16 pt-8 sm:px-8 sm:pt-10 lg:px-12">
        {/* Background Glow */}
        <div className="pointer-events-none absolute left-[-150px] top-[150px] h-[350px] w-[350px] rounded-full bg-red-600/10 blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full bg-red-600/10 blur-[150px]" />

        <div className="relative mx-auto max-w-5xl">
          {/* Page Heading */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[3px] text-red-500">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Manage your personal information and account details.
            </p>
          </div>

          {/* Profile Card */}
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111113] shadow-2xl">
            {/* Profile Header */}
            <div className="border-b border-white/[0.08] px-5 py-7 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-red-500/30 bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/10">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black text-white">
                      {firstLetter}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">
                      {profile.name}
                    </h2>

                    {profile.isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 text-[10px] font-semibold text-green-400">
                        <ShieldCheck size={11} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-[10px] font-semibold text-yellow-400">
                        <ShieldAlert size={11} />
                        Not Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-zinc-400">
                    {profile.email}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="px-5 py-7 sm:px-8">
              <h3 className="mb-5 text-lg font-bold text-white">
                Personal Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileItem
                  icon={<User size={18} />}
                  label="Full Name"
                  value={profile.name}
                />

                <ProfileItem
                  icon={<Mail size={18} />}
                  label="Email Address"
                  value={profile.email}
                />

                <ProfileItem
                  icon={<Phone size={18} />}
                  label="Phone Number"
                  value={profile.phone || "Not provided"}
                />

                <ProfileItem
                  icon={<ShieldCheck size={18} />}
                  label="Account Type"
                  value={profile.role}
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="border-t border-white/[0.08] px-5 py-7 sm:px-8">
              <h3 className="mb-5 text-lg font-bold text-white">
                Account Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      <ShieldCheck size={18} />
                    </div>

                    <div>
                      <p className="text-[11px] text-zinc-500">
                        Verification Status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {profile.isVerified
                          ? "Email Verified"
                          : "Email Not Verified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      <CalendarDays size={18} />
                    </div>

                    <div>
                      <p className="text-[11px] text-zinc-500">
                        Account ID
                      </p>

                      <p className="mt-1 max-w-[220px] truncate text-sm font-semibold text-white">
                        {profile._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-red-500/20 hover:bg-white/[0.03]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] text-zinc-500">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;