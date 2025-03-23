import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {NextRequest, NextResponse} from "next/server";

export async function GET() {
    try {
        await dbConnect();
        // Get all Users
        const users = await UserModel.find({});
        console
        .log("users", users);
        return NextResponse.json({success: true, message: users},{status: 200});
        
    } catch (error:any) {
        console.error("Error getting Users!", error);
        return NextResponse.json({success: false, message: "Error getting Users!"}, {status: 500});
        
    }
 
} 