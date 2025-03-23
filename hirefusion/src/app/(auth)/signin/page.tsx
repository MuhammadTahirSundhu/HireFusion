import { signIn } from "next-auth/react";

export default function signin() {
    return (
        <div>
            <h1>Sign In</h1>
            <button onClick={() => signIn("credentials", { email: "jsmith@gmail.com", password: "password123" })}>
                Sign In with Credentials
            </button>
        </div>
    );
}
