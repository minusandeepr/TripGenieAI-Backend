import "../config/env.js";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


export const analyzeTravelDocument = async (file) => {
  try {
    // Read uploaded file
    const fileBuffer = fs.readFileSync(file.path);
    const base64Data = fileBuffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: file.mimetype,
                data: base64Data,
              },
            },
            {
              text: `
You are an AI travel document parser.

Analyze the uploaded travel document.

Return ONLY a valid JSON object.

If a field is missing, use an empty string "".

Do NOT return markdown.
Do NOT wrap the JSON in \`\`\`.
Do NOT add any explanation.

{
  "documentType":"",
  "travelerName":"",
  "airline":"",
  "flightNumber":"",
  "hotelName":"",
  "trainNumber":"",
  "departureCity":"",
  "arrivalCity":"",
  "departureAirport":"",
  "arrivalAirport":"",
  "departureDate":"",
  "departureTime":"",
  "arrivalDate":"",
  "arrivalTime":"",
  "bookingReference":"",
  "seat":"",
  "terminal":"",
  "gate":""
}
              `,
            },
          ],
        },
      ],
    });

    const text =
      typeof response.text === "function"
        ? response.text()
        : response.text ??
          response.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("========== GEMINI RESPONSE ==========");
    console.log(text);
    console.log("=====================================");

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error(error.message);
  }
};