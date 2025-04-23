import { type NextRequest, NextResponse } from "next/server"

// LLaMA API endpoint
const LLAMA_API_URL = "http://localhost:11434/api/chat"

// Define a static fallback response in case the API fails
const STATIC_RESPONSE = {
  role: "system",
  content: "Sorry, there seems to be an issue with the service. Here's a static response: Please try again later."
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages }: { messages: { role: string; content: string }[] } = await req.json()

    // Add a system message instructing the model to give concise answers
    const enhancedMessages = [
      { role: "system", content: "Please provide concise and to-the-point answers in maximum 100 characters." },
      ...messages,
    ]

    const llamaRes = await fetch(LLAMA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2", // Change to your model name if different
        messages: enhancedMessages,
        stream: true,
      }),
    })

    if (!llamaRes.ok || !llamaRes.body) {
      // Check if the server is down or something went wrong
      throw new Error("Failed to connect to LLaMA server.")
    }

    // Proxy the response as-is
    return new Response(llamaRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Return static fallback response if API fails
    return NextResponse.json(
      { error: "Service unavailable. Here's a static response.", fallbackResponse: STATIC_RESPONSE },
      { status: 500 }
    )
  }
}
