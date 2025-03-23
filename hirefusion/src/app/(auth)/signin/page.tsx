"use client";

import LoginButton from "@/components/LoginButton";
import { signIn } from "next-auth/react";

export default function SignIn() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h1>
                
                <button
                    onClick={() => signIn("credentials", { email: "jsmith@gmail.com", password: "password123" })}
                    className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all font-medium text-lg shadow-md"
                >
                    Sign In with Credentials  
                </button>

                <p className="mt-4 text-gray-600 text-center text-sm">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
