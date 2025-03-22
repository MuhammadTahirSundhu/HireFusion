import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<{ id: string; username: string; email: string; isVerified: boolean } | null> {
                await dbConnect();
                try {
                    const user: any = await UserModel.findOne({
                        $or: [{ email: credentials.identifier }, { username: credentials.identifier }]
                    });

                    if (!user) throw new Error("No user found!");
                    if (!user.isVerified) throw new Error("User is not verified. Please verify before login!");

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) throw new Error("Incorrect password!");

                    return {
                        id: user._id.toString(),
                        username: user.username,
                        email: user.email,
                        isVerified: user.isVerified
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Error logging in!");
                }
            },
        })
    ],
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            if(token){
                session.user = {
                    id: token.id,
                    username: token.username,
                    email: token.email,
                    isVerified: token.isVerified
                };
            }       
            return session;
        },
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
                token.isVerified = user.isVerified;
            }
            return token;
        }
    },
    pages: {
        signIn: "/signin"
    },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET
};
