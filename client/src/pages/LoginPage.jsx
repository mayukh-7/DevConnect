import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageCircle, Check, Github } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";
import AuthImagePattern from "../components/AuthImagePattern.jsx";

// Simple Google SVG Icon Component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isValidEmail, setIsValidEmail] = useState(false);

  const { login, isLoggingIn } = useAuthStore();

  useEffect(() => {
    // Simple email regex check for visual cues
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(formData.identifier));
  }, [formData.identifier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = formData;

    if (!identifier.trim()) return toast.error("Email is required");
    if (!password.trim()) return toast.error("Password is required");

    // Auto-detect email vs username
    const loginData = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password };

    login(loginData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-gradient-to-t from-base-100 via-base-100 to-base-200/20">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 shadow-sm group-hover:shadow-primary/20 group-hover:-translate-y-1">
                <MessageCircle className="size-7 text-primary" />
              </div>
              <h1 className="text-4xl font-extrabold mt-6 tracking-tighter text-base-content leading-tight">Welcome back 👋</h1>
              <p className="text-base-content/60 text-lg leading-relaxed mt-2">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Identifier Input */}
            <div className="form-control group">
              <label className="label pl-1">
                <span className="label-text font-medium text-base-content/60 group-focus-within:text-primary transition-colors duration-200">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 w-full">
                  <Mail className={`size-5 transition-colors duration-300 ${isValidEmail ? 'text-primary' : 'text-base-content/40 group-focus-within:text-primary'}`} />
                </div>
                <input
                  type="text"
                  name="identifier"
                  autoFocus
                  className="input w-full pl-11 pr-10 h-14 rounded-xl border-none bg-base-200/50 shadow-inner focus:bg-base-100 focus:ring-4 focus:ring-primary/10 transition-all duration-300 font-medium placeholder:text-base-content/30"
                  placeholder="you@example.com"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  required
                />
                {/* Visual Checkmark for valid email */}
                {isValidEmail && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none animate-in zoom-in duration-200">
                    <Check className="size-5 text-primary" />
                  </div>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control group">
              <label className="label pl-1">
                <span className="label-text font-medium text-base-content/60 group-focus-within:text-primary transition-colors duration-200">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40 group-focus-within:text-primary transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input w-full pl-11 h-14 rounded-xl border-none bg-base-200/50 shadow-inner focus:bg-base-100 focus:ring-4 focus:ring-primary/10 transition-all duration-300 font-medium pr-12 placeholder:text-base-content/30"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                {/* Toggle Visibility */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 cursor-pointer p-2 rounded-full hover:bg-base-200/50 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40 hover:text-base-content transition-colors duration-200" />
                  ) : (
                    <Eye className="size-5 text-base-content/40 hover:text-base-content transition-colors duration-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full h-14 rounded-2xl text-lg font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-6 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-content/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 py-1 rounded-full bg-base-100 text-base-content/50 border border-base-content/5">Or continue with</span>
            </div>
          </div>

          {/* Social Icons - Premium Cards */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-base-100 border border-base-content/10 hover:bg-base-200/50 hover:border-base-content/20 transition-all duration-200 group">
              <div className="p-1 rounded-full bg-base-100 group-hover:scale-110 transition-transform">
                <GoogleIcon />
              </div>
              <span className="font-semibold text-base-content/80 group-hover:text-base-content transition-colors">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-base-100 border border-base-content/10 hover:bg-base-200/50 hover:border-base-content/20 transition-all duration-200 group">
              <div className="p-1 rounded-full bg-base-100 group-hover:scale-110 transition-transform">
                <Github className="size-5" />
              </div>
              <span className="font-semibold text-base-content/80 group-hover:text-base-content transition-colors">GitHub</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-base-content/40">We never post without permission</p>
          </div>

          {/* Footer */}
          <div className="text-center pt-6">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-bold text-primary hover:text-primary-focus hover:underline transition-all duration-200">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};

export default LoginPage;