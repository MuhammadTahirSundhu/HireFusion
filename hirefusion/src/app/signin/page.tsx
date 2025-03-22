"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthComponent() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-sm w-full text-center">
        {session ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800">Welcome,</h2>
            <p className="text-gray-600 mt-2">{session.user.email}</p>
            <button
              onClick={() => signOut()}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800">Hello, Guest!</h2>
            <p className="text-gray-600 mt-2">Sign in to access your account</p>
            <button
              onClick={() => signIn()}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
