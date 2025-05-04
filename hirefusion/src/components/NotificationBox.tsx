"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { FaTimes, FaInfoCircle, FaExclamationCircle, FaCheckCircle } from "react-icons/fa"
import { getSession, useSession } from "next-auth/react"

interface Notification {
  id: string
  message: string
  type: "info" | "warning" | "success"
  createdAt: string
}

interface NotificationsBoxProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    buttonRef: React.RefObject<HTMLButtonElement | null>
  }

export default function NotificationsBox({ isOpen, setIsOpen, buttonRef }: NotificationsBoxProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  // Fetch notifications when component opens
  useEffect(() => {
    if (isOpen && session?.user?.email) {
      fetchNotifications()
    }
  }, [isOpen, session])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        boxRef.current &&
        !boxRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setIsOpen, buttonRef])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      // Get the session to get the logged-in user's email
      const session = await getSession()
      if (!session || !session.user || !session.user.email) {
        console.error("User is not authenticated or email is missing")
        return
      }
  
      const email = session.user.email  // Get the email from session
  
      // Construct the URL with the email as a query parameter
      const url = `/api/notifications/getAllnotifications?email=${encodeURIComponent(email)}`
  
      const response = await fetch(url, {
        method: "GET", // Changed to GET since we're using query parameters
        headers: {
          "Content-Type": "application/json", // Headers for the GET request (optional here)
        },
      })
  
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      } else {
        console.error("Failed to fetch notifications")
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }
  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch('/api/notifications/deletenotification', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email,
          id: id,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Success message
  
        // Refetch notifications after successful deletion
        fetchNotifications();
      } else {
        const error = await response.json();
        console.error(error.message); // Error message
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };
      
  


  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <FaInfoCircle className="text-blue-500" />
      case "warning":
        return <FaExclamationCircle className="text-yellow-500" />
      case "success":
        return <FaCheckCircle className="text-green-500" />
      default:
        return <FaInfoCircle className="text-blue-500" />
    }
  }

  return (
<div
  ref={boxRef}
  className={`fixed w-80 bg-white dark:bg-gray-900 shadow-2xl rounded-lg overflow-hidden z-50 transition-all duration-200 ${
    isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
  }`}
  style={{
    top: '60px', // Fixed offset from the top of the viewport (adjust as needed)
    right: '5%', // 5% from the right edge
  }}
>
    
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close notifications"
        >
          <FaTimes />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notifications available
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Delete notification"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}