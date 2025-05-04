import dbConnect from "@/lib/dbConnect"
import { NotificationModel } from "@/models/User"

export async function GET(request: Request) {
  try {
    await dbConnect()

    // Get the email from the query parameters
    const url = new URL(request.url)
    const email = url.searchParams.get('email')

    // If email is not provided, return an error
    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email is required" }),
        { status: 400 }
      )
    }

    // Fetch notifications for the given email and sort by createdAt
    const notifications = await NotificationModel.find({ userEmail: email })
      .sort({ createdAt: -1 })

    interface NotificationResponse {
      id: string
      message: string
      type: "info" | "warning" | "success"
      createdAt: string
      userEmail: string
    }

    const formattedNotifications: NotificationResponse[] = notifications.map((notification) => ({
      id: notification._id.toString(),
      message: notification.message,
      type: notification.type,
      createdAt: notification.createdAt.toISOString(),
      userEmail: notification.userEmail,
    }))

    // Return the notifications as a JSON response
    return new Response(
      JSON.stringify({ notifications: formattedNotifications }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    )
  }
}
