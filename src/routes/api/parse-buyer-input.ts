import { createFileRoute } from "@tanstack/react-router";

const PROMPT_HEADER = `
You are an agricultural marketplace assistant for India.

Extract structured BUYER REQUEST information from the buyer's message.

The buyer may write in English, Hindi, Hinglish, or informal Indian language.

Normalize crop names into simple English plural names.
Examples:
tamatar -> Tomatoes
gehun -> Wheat
aloo -> Potatoes
pyaaz -> Onions
chawal / dhaan -> Rice

Convert quantities to kilograms:
1 tonne / ton / tan = 1000 kg
1 quintal = 100 kg

Prices are per kilogram in Indian rupees.
"under 22", "22 se kam", "max 22 rupees per kg" -> 22.

Return ONLY valid JSON with exactly this structure:

{
  "crop": "",
  "quantity_kg": null,
  "max_price_per_kg": null,
  "location": ""
}

Rules:
- quantity_kg and max_price_per_kg must be numbers or null.
- If information is missing, use null for numbers and "" for text.
- Do NOT invent information.
- Do NOT rank, score, or recommend listings. Only extract.

Buyer message:
`;

export const Route = createFileRoute("/api/parse-buyer-input")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { text?: unknown };
          const text = body.text;

          if (!text || typeof text !== "string") {
            return Response.json(
              { error: "Please describe what produce you need." },
              { status: 400 },
            );
          }

          const apiKey =
            process.env["GEMINI_API_KEY"] || process.env["Crop_connect_key"];

          if (!apiKey) {
            return Response.json(
              { error: "AI search is not configured yet." },
              { status: 500 },
            );
          }

          const callGemini = () =>
            fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: PROMPT_HEADER + text }] }],
                  generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                      type: "OBJECT",
                      properties: {
                        crop: { type: "STRING" },
                        quantity_kg: { type: "NUMBER", nullable: true },
                        max_price_per_kg: { type: "NUMBER", nullable: true },
                        location: { type: "STRING" },
                      },
                      required: [
                        "crop",
                        "quantity_kg",
                        "max_price_per_kg",
                        "location",
                      ],
                    },
                  },
                }),
              },
            );

          let response = await callGemini();
          if (!response.ok && (response.status === 429 || response.status >= 500)) {
            await new Promise((r) => setTimeout(r, 900));
            response = await callGemini();
          }

          if (!response.ok) {
            console.error("Gemini API error:", await response.text());
            return Response.json(
              {
                error:
                  "AI is busy right now. Please try again in a moment or use the fields above.",
              },
              { status: 503 },
            );
          }


          const result = (await response.json()) as {
            candidates?: { content?: { parts?: { text?: string }[] } }[];
          };
          const outputText = result.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!outputText) {
            return Response.json(
              { error: "AI could not understand your request." },
              { status: 500 },
            );
          }

          return Response.json(JSON.parse(outputText));
        } catch (error) {
          console.error(error);
          return Response.json(
            { error: "Something went wrong while reading your request." },
            { status: 500 },
          );
        }
      },
    },
  },
});
