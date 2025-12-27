import { GoogleGenAI, Type } from "@google/genai";
import { SearchFilters, RideType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseSearchIntent = async (query: string): Promise<SearchFilters> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found, returning empty filters.");
    return {};
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract search parameters from this Vietnamese ride request: "${query}".
      Current Date: ${new Date().toISOString().split('T')[0]}.
      If a location is mentioned, try to normalize it to standard Vietnamese city names (e.g. "SG" -> "Sài Gòn", "BP" -> "Bình Phước", "Biên Hòa" -> "Trấn Biên").
      For time, convert to 24h format HH:mm (e.g. "2 chiều" -> "14:00", "9h sáng" -> "09:00").
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            origin: { type: Type.STRING, description: "Departure city/location" },
            destination: { type: Type.STRING, description: "Arrival city/location" },
            date: { type: Type.STRING, description: "Date of travel in YYYY-MM-DD format" },
            time: { type: Type.STRING, description: "Departure time in HH:mm format" },
            type: { 
              type: Type.STRING, 
              enum: [RideType.SHARED, RideType.CONVENIENT, RideType.PRIVATE],
              description: "Type of ride if specified (Xe ghép, Tiện chuyến, Bao xe)"
            }
          },
          required: [] 
        }
      }
    });

    const text = response.text;
    if (!text) return {};
    
    return JSON.parse(text) as SearchFilters;
  } catch (error) {
    console.error("Gemini parsing error:", error);
    return {};
  }
};