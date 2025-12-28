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
      
      RULES FOR TIME CONVERSION (24-Hour Format):
      1. Always output time in "HH:mm" (24-hour) format.
      2. If specific 12h time is given, convert it:
         - "2h chiều" -> "14:00"
         - "9h sáng" -> "09:00"
         - "8h tối" -> "20:00"
      3. If vague time of day terms are used without specific numbers, map them to these defaults:
         - "Sáng" / "Buổi sáng" -> "08:00"
         - "Trưa" / "Buổi trưa" -> "12:00"
         - "Chiều" / "Buổi chiều" -> "14:00"
         - "Tối" / "Buổi tối" -> "19:00"
         - "Đêm" -> "23:00"

      If a location is mentioned, try to normalize it to standard Vietnamese city names (e.g. "SG" -> "Sài Gòn", "BP" -> "Bình Phước", "Biên Hòa" -> "Trấn Biên").
      
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            origin: { type: Type.STRING, description: "Departure city/location" },
            destination: { type: Type.STRING, description: "Arrival city/location" },
            date: { type: Type.STRING, description: "Date of travel in YYYY-MM-DD format" },
            time: { type: Type.STRING, description: "Departure time in HH:mm format (24h)" },
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