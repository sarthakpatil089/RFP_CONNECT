import { openai } from "./openAiClient.js";

export async function callAiParser(input) {
  const { title, requirements, expectedDelivery, budget, context } = input;
  const systemPrompt =
    "You are an expert B2B software solution analyst. " +
    "Given an RFP in natural language, extract structured requirements for vendor matching. " +
    "Answer in valid JSON only." +
    "Add the Tech stack used in market if not mention by the user ( e.g. MERN (Mongo, express, react, node), MEAN etc. )";

  const userText = `
RFP TITLE:
${title}

REQUIREMENTS:
${requirements}

EXPECTED DELIVERY:
${expectedDelivery}

BUDGET (optional):
${budget || "Not specified"}

ADDITIONAL CONTEXT (optional):
${context || "None"}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", 
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content:
          userText +
          `

Return STRICT JSON with this shape (no explanation, no extra keys):

{
  "summary": "1–2 sentence summary of the RFP",
  "businessDomain": "e.g. SaaS, e-commerce, fintech, healthcare",
  "primaryGoal": "single sentence describing what buyer wants to achieve",
  "techStack": ["list", "of", "requested", "or", "implied", "technologies"],
  "mustHaveFeatures": ["feature 1", "feature 2", "..."],
  "niceToHaveFeatures": ["feature 1", "feature 2"],
  "expectedDelivery": "cleaned delivery timeline derived from input"
}
`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const raw = response.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(raw);
  return parsed;
}
