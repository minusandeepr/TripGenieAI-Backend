import "../config/env.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateItinerary = async (travelData) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an expert AI travel planner.

Using the travel information below, generate a detailed travel itinerary.

Travel Information:

${JSON.stringify(travelData, null, 2)}

Return ONLY valid JSON.

Do not use markdown.
Do not wrap inside \`\`\`json.
Do not add any explanation.

Return this format:

{
  "title": "",
  "summary": "",
  "destination": "",
  "days": [
    {
      "day": 1,
      "activities": [
        {
          "time": "",
          "activity": "",
          "location": ""
        }
      ]
    }
  ],
  "tips": [
    ""
  ]
}
              `,
            },
          ],
        },
      ],
    });

    const text =
      response.text ??
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    throw new Error(error.message);
  }
};