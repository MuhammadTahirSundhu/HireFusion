'use client';

import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();
    const [show404, setShow404] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated" || !session) {
            setShow404(true);
        }
    }, [status]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen text-lg font-semibold">
                Checking authentication...
            </div>
        );
    }

    if (show404) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-500 to-pink-600 text-white">
                <h1 className="text-6xl font-extrabold mb-4">401</h1>
                <p className="text-2xl font-semibold mb-2">Unauthorized Access</p>
                <p className="text-lg mb-6">You must be signed in to view this page.</p>
                <a
                    href="/signin"
                    className="px-6 py-3 bg-white text-pink-600 font-semibold rounded-lg shadow hover:bg-pink-100 transition"
                >
                    Go to Sign In
                </a>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
