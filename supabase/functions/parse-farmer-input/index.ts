const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function isValid(y: number, m: number, d: number) {
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

// Accepts YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY (day-first Indian format).
function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;

  const iso = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (iso) {
    const [, y, m, d] = iso;
    return isValid(+y, +m, +d) ? `${y}-${pad(+m)}-${pad(+d)}` : null;
  }

  const dmy = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return isValid(+y, +m, +d) ? `${y}-${pad(+m)}-${pad(+d)}` : null;
  }

  return null;
}

// Last-resort: pull an explicit date straight out of the farmer's message.
function extractDate(text: string): string | null {
  const match = text.match(/\b\d{1,2}[-/.]\d{1,2}[-/.]\d{4}\b|\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/);
  return match ? normalizeDate(match[0]) : null;
}


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

Dates written as DD/MM/YYYY or DD-MM-YYYY are day-first Indian format.
Example: 16/09/2026 -> 2026-09-16.
harvest_date must ALWAYS be strict YYYY-MM-DD, or "" if it cannot be determined.
Never guess a date that is not stated or clearly implied.


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

    const callGemini = async () =>
      await fetch(
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

    let response = await callGemini();

    // Gemini can be briefly overloaded (429/503). Retry a few times before failing.
    for (let attempt = 0; attempt < 3 && !response.ok; attempt++) {
      if (response.status !== 429 && response.status < 500) break;
      const errorText = await response.text();
      console.error(`Gemini transient error (attempt ${attempt + 1}):`, errorText);
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      response = await callGemini();
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);

      return new Response(
        JSON.stringify({
          error:
            "The AI assistant is busy right now. Please try again in a moment.",
        }),
        {
          status: 503,
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

    // Harvest date must never break the request: normalize or drop it.
    parsed.harvest_date = normalizeDate(parsed.harvest_date) ?? extractDate(text) ?? "";

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
