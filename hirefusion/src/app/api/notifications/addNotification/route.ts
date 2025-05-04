import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import { NotificationModel, INotification } from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    const { email, message, type } = await request.json()
    console.log("Received data:", { email, message, type });
    
    if (!email || !message || !type) {
      return NextResponse.json({ message: "Email, message, and type are required" }, { status: 400 })
    }

    if (!["info", "warning", "success"].includes(type)) {
      return NextResponse.json({ message: "Invalid notification type" }, { status: 400 })
    }

    await dbConnect()

    const notificationData: Pick<INotification, "message" | "type" | "userEmail"> = {
      message,
      type: type as "info" | "warning" | "success",
      userEmail: email,
    }

    const notification = new NotificationModel(notificationData)
    await notification.save()

    interface NotificationResponse {
      id: string
      message: string
      type: "info" | "warning" | "success"
      createdAt: string
      userEmail: string
    }

    const response: NotificationResponse = {
      id: notification._id.toString(),
      message: notification.message,
      type: notification.type,
      createdAt: notification.createdAt.toISOString(),
      userEmail: notification.userEmail,
    }

    return NextResponse.json({ notification: response }, { status: 201 })
  } catch (error) {
    console.error("Error adding notification:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}