import { GoogleGenAI } from "@google/genai";
import { AstroObject } from "../types";

// Initialize the API client
// Note: In a real production app, this should be handled via a backend proxy to protect the key.
// For this design doc implementation, we use the env variable directly as per instructions.
const apiKey = process.env.API_KEY || ''; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateObjectSummary = async (object: AstroObject): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning mock summary.");
    return `[Mock Summary] ${object.primaryName || object.inputName} is a fascinating astronomical object located at RA ${object.ra?.toFixed(4)}, Dec ${object.dec?.toFixed(4)}. Data indicates it is likely a ${object.objectType}. (Add API_KEY to enable AI summaries)`;
  }

  try {
    const prompt = `
      Act as an expert astronomer. 
      Generate a concise, scientific summary paragraph (approx 80-100 words) for the astronomical object with the following data:
      
      Name: ${object.primaryName || object.inputName}
      Type: ${object.objectType || 'Unknown'}
      Coordinates: RA ${object.ra}, Dec ${object.dec}
      Distance: ${object.distance ? object.distance + ' pc' : 'Unknown'}
      Spectral Type: ${object.spectralType || 'Unknown'}
      Temperature: ${object.temperature ? object.temperature + ' K' : 'Unknown'}
      Magnitude: ${object.magnitude || 'Unknown'} (${object.magBand || ''})
      
      Focus on the physical nature of the object and its context in the galaxy.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating AI summary. Please check API configuration.";
  }
};