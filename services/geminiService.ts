import { GoogleGenAI, Type } from "@google/genai";
import { FocusPlanResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateFocusPlan = async (themeContext: string): Promise<FocusPlanResponse> => {
  if (!apiKey) {
    return {
      tasks: ['Set API Key in environment', 'Reload Application', 'Focus on the goal'],
      motivationalQuote: "Configuration is the first step to success."
    };
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `I am starting a 30-minute focus session with a "${themeContext}" theme. 
    Please generate 3 small, achievable generic productivity tasks for this session and 1 short, calming, nature-inspired motivational quote.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 3 concise tasks."
            },
            motivationalQuote: {
              type: Type.STRING,
              description: "A short calming quote."
            }
          },
          required: ["tasks", "motivationalQuote"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text) as FocusPlanResponse;
    return data;

  } catch (error) {
    console.error("Error generating focus plan:", error);
    return {
      tasks: ['Breathe deeply', 'Review your top priority', 'Clear your desk'],
      motivationalQuote: "Nature does not hurry, yet everything is accomplished."
    };
  }
};
