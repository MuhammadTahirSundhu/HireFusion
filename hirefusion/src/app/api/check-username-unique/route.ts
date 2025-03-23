import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const queryParam = { username: searchParams.get("username") };

        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return NextResponse.json({ success: false, message: usernameErrors }, { status: 400 });
        }

        const { username } = result.data;

        const existingUser = await UserModel.findOne({ username, isVerified: true });

        if (existingUser) {
            return NextResponse.json({ success: false, message: "Username is already taken" }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Username is unique" }, { status: 200 });

    } catch (error) {
        console.error("Error in check-username-unique GET route:", error);
        return NextResponse.json({ success: false, message: "Error checking username" }, { status: 500 });
    }
}
