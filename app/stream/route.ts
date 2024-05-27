// Prevents this route's response from being cached on Vercel
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  // Create a streaming response
  const customReadable = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ message: "Connected" })}\n\n`),
      );

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          // Generate random weather data
          const weatherConditions = [
            "Sunny",
            "Cloudy",
            "Rainy",
            "Windy",
            "Snowy",
            "Thunderstorm",
          ];
          const randomCondition =
            weatherConditions[
              Math.floor(Math.random() * weatherConditions.length)
            ];
          const temperature = Math.floor(Math.random() * (100 - -20) - 20); // Random temperature between -20 and 100
          const humidity = Math.floor(Math.random() * 101); // Random humidity between 0 and 100
          const windSpeed = Math.floor(Math.random() * 51); // Random wind speed between 0 and 50

          // Create a weather data object
          const weatherData = {
            condition: randomCondition,
            temperature,
            humidity,
            windSpeed,
          };

          // Broadcast the weather data as an SSE event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(weatherData)}\n\n`),
          );

          // After the third message, stop broadcasting
          if (i === 2) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ message: "Stopped broadcasting" })}\n\n`,
              ),
            );
            controller.close();
          }
        }, i * 10000); // Delay each message by 10 seconds
      }
    },

    async cancel() {
      console.log("Connection terminated!");
    },
  });
  // Return the stream response and keep the connection alive
  return new Response(customReadable, {
    // Set the headers for Server-Sent Events (SSE)
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
