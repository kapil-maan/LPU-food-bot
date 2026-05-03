
import foodPlaces, { SUMMARY } from "../../../data/food-places";

function buildKnowledgeBase() {
  let kb = `You are a helpful food assistant for LPU campus.

STRICT RULE:
If the question is NOT about LPU food → reply EXACTLY:
"I'm only able to help with food-related questions at LPU campus! 🍽️ Try asking me about food places, prices, or what to eat."

=== FOOD DATA ===
`;

  foodPlaces.forEach((place) => {
    kb += `\n📍 ${place.name}
Location: ${place.location}
Category: ${place.category}
Timings: ${place.timings}
Price: ${place.priceRange}
Rating: ${place.rating}
Menu:\n`;

    place.menu.forEach((item) => {
      kb += `- ${item.item}: ₹${item.price}\n`;
    });
  });

  kb += `\n=== SUMMARY ===
Cheapest: ${SUMMARY.cheapest}
Best Rated: ${SUMMARY.bestRated}
`;

  return kb;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Missing OPENROUTER_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const systemPrompt = buildKnowledgeBase();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content || "",
          })),
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return Response.json(
        { error: data.error?.message || "OpenRouter failed" },
        { status: 500 }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "⚠️ No response from AI";

    return Response.json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}