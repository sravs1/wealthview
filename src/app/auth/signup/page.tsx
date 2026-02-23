"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Mail, Lock, Eye, EyeOff, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 8) return "weak";
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return "strong";
    return "medium";
  };

  const strength = passwordStrength();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please accept the terms of service.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#050a14] bg-grid flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/6 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-violet-500/6 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">
            Wealth<span className="text-emerald-400">view</span>
          </span>
        </Link>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-6">Start tracking your entire portfolio for free</p>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <p className="text-rose-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-12 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {strength && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">
                    {["weak", "medium", "strong"].map((level, i) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          strength === "weak" && i === 0
                            ? "bg-rose-500"
                            : strength === "medium" && i <= 1
                            ? "bg-amber-400"
                            : strength === "strong"
                            ? "bg-emerald-400"
                            : "bg-white/[0.08]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${strength === "weak" ? "text-rose-400" : strength === "medium" ? "text-amber-400" : "text-emerald-400"}`}>
                    {strength}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className={`w-full bg-white/[0.04] border rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:bg-white/[0.06] transition-all ${
                    confirmPassword && confirmPassword !== password
                      ? "border-rose-500/50"
                      : "border-white/[0.08] focus:border-emerald-500/50"
                  }`}
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border transition-all ${
                    agreed
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-white/[0.04] border-white/[0.15]"
                  } flex items-center justify-center`}
                >
                  {agreed && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M1 4l3 3 5-6" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-slate-400 text-sm leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] mt-1"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-slate-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] disabled:opacity-50 text-white text-sm font-medium py-3 rounded-xl transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
