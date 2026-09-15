const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Please provide harvest description text." }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiKey =
      Deno.env.get("GEMINI_API_KEY") || Deno.env.get("Crop_connect_key");

    if (!apiKey) {
      throw new Error("Gemini API key is not configured.");
    }

    const today = new Date().toISOString().split("T")[0];

    const prompt = `
You are an agricultural marketplace assistant for India.

Extract structured crop-listing information from the farmer's message.

The farmer may write in:
- English
- Hindi
- Hinglish
- informal Indian language

Today's date is ${today}.

Convert relative dates:
"today" / "aaj" = ${today}
"yesterday" / "kal" when referring to past harvest = one day before today.

Normalize crop names into simple English names.
Examples:
tamatar -> Tomatoes
gehun -> Wheat
aloo -> Potatoes
pyaaz -> Onions

Convert units to kilograms:
1 tonne / ton = 1000 kg
1 quintal = 100 kg

Return ONLY valid JSON.

Use exactly this structure:

{
  "crop": "",
  "quantity_kg": null,
  "price_per_kg": null,
  "location": "",
  "harvest_date": "",
  "description": ""
}

Rules:
- quantity_kg must be a number or null.
- price_per_kg must be a number or null.
- harvest_date should be YYYY-MM-DD when identifiable.
- If information is missing, use null for numbers and "" for text.
- Do not invent information.
- description should be a short cleaned summary of any extra useful crop-quality information mentioned.

Farmer message:
${text}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                crop: {
                  type: "STRING",
                },
                quantity_kg: {
                  type: "NUMBER",
                  nullable: true,
                },
                price_per_kg: {
                  type: "NUMBER",
                  nullable: true,
                },
                location: {
                  type: "STRING",
                },
                harvest_date: {
                  type: "STRING",
                },
                description: {
                  type: "STRING",
                },
              },
              required: [
                "crop",
                "quantity_kg",
                "price_per_kg",
                "location",
                "harvest_date",
                "description",
              ],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);

      return new Response(
        JSON.stringify({
          error: "AI could not understand the harvest description.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const geminiResult = await response.json();

    const outputText =
      geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!outputText) {
      throw new Error("Gemini returned no usable response.");
    }

    const parsed = JSON.parse(outputText);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Something went wrong while processing the harvest description.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
