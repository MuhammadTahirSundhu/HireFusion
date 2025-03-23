import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        // Check if a verified user already exists with the same username
        const existingUserByUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingUserByUsername) {
            return Response.json({ success: false, message: "Username is already taken!" }, { status: 400 });
        }

        // Check if a user exists with the same email
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({ success: false, message: "User already exists with this email" }, { status: 400 });
            }
            existingUserByEmail.password = await bcrypt.hash(password, 10);
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
        } else {
            const emailResponse = await sendVerificationEmail(email, username, verifyCode);
            if (!emailResponse.success) {
                return Response.json({ success: false, message: emailResponse.message }, { status: 500 });
            }
            const newUser = new UserModel({
                username,
                email,
                password: await bcrypt.hash(password, 10),
                verifyCode,
                verifyCodeExpire: new Date(Date.now() + 3600000),
                isVerified: false
            });
            await newUser.save();
        }


        return Response.json({ success: true, message: "User registered successfully. Please verify your email." }, { status: 201 });

    } catch (error) {
        console.error("Error registering user!", error);
        return Response.json({ success: false, message: "Error registering user!" }, { status: 500 });
    }
}
