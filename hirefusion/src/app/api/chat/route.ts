import { type NextRequest, NextResponse } from "next/server"

// This is a placeholder API route that you'll replace with your Ollama integration
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // This is where you would integrate with Ollama
    // For now, we'll simulate a streaming response

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Get the last user message
        const userMessage = messages.filter((m: any) => m.role === "user").pop()

        // Generate a career advice response based on the user's query
        let response = ""

        if (userMessage) {
          // Simulate a response based on keywords in the user's message
          const query = userMessage.content.toLowerCase()

          if (query.includes("resume") || query.includes("cv")) {
            response =
              "Creating an effective resume is crucial for your job search. Here are some key tips:\n\n1. Tailor your resume for each job application\n2. Use action verbs and quantify achievements\n3. Keep it concise - ideally 1-2 pages\n4. Include relevant skills and keywords\n5. Proofread carefully for errors\n\nWould you like me to help you with a specific section of your resume?"
          } else if (query.includes("interview")) {
            response =
              "Preparing for interviews is essential for career success. Here's my advice:\n\n1. Research the company thoroughly\n2. Practice common questions and your answers\n3. Prepare examples using the STAR method (Situation, Task, Action, Result)\n4. Dress professionally and arrive early\n5. Prepare thoughtful questions to ask the interviewer\n\nIs there a specific type of interview you're preparing for?"
          } else if (query.includes("career change") || query.includes("switch")) {
            response =
              "Changing careers can be challenging but rewarding. Consider these steps:\n\n1. Assess your transferable skills\n2. Research growth industries that interest you\n3. Network with professionals in your target field\n4. Consider additional education or certifications if needed\n5. Update your resume to highlight relevant experience\n\nWhat field are you considering moving into?"
          } else {
            response =
              "Thank you for your career question. As a career advisor, I can help with:\n\n- Resume and cover letter writing\n- Interview preparation\n- Career planning and transitions\n- Skill development recommendations\n- Networking strategies\n- Salary negotiation\n\nCould you provide more details about your specific career goals or challenges?"
          }
        }

        // Stream the response character by character with delays
        const characters = response.split("")
        for (let i = 0; i < characters.length; i++) {
          const char = characters[i]
          controller.enqueue(encoder.encode(char))

          // Add a small delay between characters to simulate typing
          // Vary the delay slightly to make it feel more natural
          const delay = 30 + Math.random() * 20
          await new Promise((resolve) => setTimeout(resolve, delay))
        }

        controller.close()
      },
    })

    return new Response(stream)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
