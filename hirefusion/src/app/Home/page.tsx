'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin"); // Redirect to signin
        }
    }, [status, router]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) return null;

    return (
        <div>
            <h1>Welcome, {session.user?.username || "User"}</h1>
        </div>
    );
}
