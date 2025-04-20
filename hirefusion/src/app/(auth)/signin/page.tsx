"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password.");
        setLoading(false);
      } else if (res?.ok) {
        const destination = searchParams.get("redirect") || "/home";
        router.push(destination);
      } else {
        throw new Error("Unexpected error occurred");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-white bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none placeholder-white/60"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-white bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none placeholder-white/60"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all font-medium text-lg shadow-md flex items-center justify-center"
            disabled={loading}
          >
            {loading && <AiOutlineLoading3Quarters className="animate-spin mr-2" />}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="mx-3 text-white/60 text-sm">OR</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>

        {/* Signup Redirect */}
        <p className="mt-4 text-white text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-300 hover:underline">
            Sign Up
          </a>
        </p>
      </div>

      {/* Toast Container to show toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
