import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { NotificationModel } from '@/models/User'

export async function DELETE(req: NextRequest) {
  const { email, id } = await req.json()

  console.log('Received data:', { email, id });
  
  // Validate email and notification ID
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 })
  }
  if (!id) {
    return NextResponse.json({ message: 'Notification ID is required' }, { status: 400 })
  }

  try {
    await dbConnect()

    // Find and delete the notification with the specified email and ID
    const notification = await NotificationModel.findOneAndDelete({
      _id: id,
      userEmail: email,
    })

    if (!notification) {
      return NextResponse.json({ message: 'Notification not found or not authorized' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Notification deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
