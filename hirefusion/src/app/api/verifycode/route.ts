import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        console.log(user);
        console.log(code);
        
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        if (user.verifyCode !== code) {
            return NextResponse.json({ success: false, message: "Invalid code" }, { status: 400 });
        }
        if (new Date(user.verifyCodeExpire) < new Date()) {
            return NextResponse.json({ success: false, message: "Code expired" }, { status: 400 });
        }
        user.isVerified = true;
        await user.save();
        return NextResponse.json({ success: true, message: "User verified successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error verifying user:", error);
        return NextResponse.json({ success: false, message: "Error verifying user" }, { status: 500 });
    }
}
