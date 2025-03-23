'use client';
import Navbar from "@/components/Navbar";
import { useSession, signOut } from "next-auth/react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div>
                <h1>You are not signed in</h1>
                <a href="/signin">Go to Sign In</a>
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
