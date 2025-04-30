import { type NextRequest, NextResponse } from "next/server";

// LLaMA API endpoint
const LLAMA_API_URL = "http://localhost:11434/api/chat";

// Define a static fallback response with career advice
const STATIC_RESPONSE = {
  role: "assistant",
  content: "Explore new skills and network actively to boost your career growth.",
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages }: { messages: { role: string; content: string }[] } = await req.json();
    console.log("Received messages:", messages);

    // Add a system message instructing the model to give concise answers
    const enhancedMessages = [
      { role: "system", content: "Please provide concise and to-the-point answers in maximum 100 characters." },
      ...messages,
    ];

    console.log("Sending request to LLaMA API:", LLAMA_API_URL);
    let llamaRes;
    try {
      llamaRes = await fetch(LLAMA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          messages: enhancedMessages,
          stream: true,
        }),
      });
    } catch (fetchError: any) {
      // Handle fetch-specific errors like ECONNREFUSED
      if (fetchError.cause?.code === "ECONNREFUSED") {
        console.log("LLaMA server unavailable (ECONNREFUSED). Returning static response.");
        const stream = new ReadableStream({
          start(controller) {
            const responseChunk = {
              message: STATIC_RESPONSE,
              done: false,
            };
            const encodedChunk = `data: ${JSON.stringify(responseChunk)}\n\n`;
            controller.enqueue(new TextEncoder().encode(encodedChunk));

            const doneChunk = `data: {"done": true}\n\n`;
            controller.enqueue(new TextEncoder().encode(doneChunk));

            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }
      throw fetchError; // Re-throw other fetch errors
    }

    if (!llamaRes.ok || !llamaRes.body) {
      console.log(`LLaMA server returned status: ${llamaRes.status}. Returning static response.`);
      const stream = new ReadableStream({
        start(controller) {
          const responseChunk = {
            message: STATIC_RESPONSE,
            done: false,
          };
          const encodedChunk = `data: ${JSON.stringify(responseChunk)}\n\n`;
          controller.enqueue(new TextEncoder().encode(encodedChunk));

          const doneChunk = `data: {"done": true}\n\n`;
          controller.enqueue(new TextEncoder().encode(doneChunk));

          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    console.log("LLaMA response received, proxying stream.");
    return new Response(llamaRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Unexpected error in chat API:", error);
    return NextResponse.json(
      { error: "Service unavailable. Unexpected error occurred." },
      { status: 500 }
    );
  }
}