import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

// GET /api/users/get-profile?email=someone@example.com
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // --- 1. pull email from query string ---------------------------
    const email = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json(
        { message: "Email query parameter is required" },
        { status: 400 }
      );
    }

    // --- 2. look up user ------------------------------------------
    const user = await UserModel.findOne({ email })
      .select("-password -verifyCode -verifyCodeExpire") // hide sensitive fields
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // --- 3. send profile ------------------------------------------
    return NextResponse.json({ profile: user });
  } catch (err) {
    console.error("/api/users/get-profile error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
