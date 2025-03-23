import { useSession, signOut } from "next-auth/react";

export default function Home() {
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
        <div>
            <h1>Welcome, {session.user.username}!</h1>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    );
}
