import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";

// Initialize the Gemini Client
// The API key must be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends a prompt (text and optional image) to the Gemini model.
 * Supports "Thinking Mode" configuration.
 */
export const generateResponse = async (
  prompt: string,
  imageBase64: string | null,
  useThinking: boolean
): Promise<string> => {
  try {
    const modelName = 'gemini-3-pro-preview';
    
    const parts: Part[] = [];

    // Add Image if present
    if (imageBase64) {
      // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      const mimeType = imageBase64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || 'image/jpeg';

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      });
    }

    // Add Text Prompt
    parts.push({ text: prompt });

    const config: any = {};

    // Configure Thinking Mode if enabled
    if (useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
      // Note: explicitly NOT setting maxOutputTokens when thinking is enabled as per guidelines
    } 

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: {
        role: 'user',
        parts: parts
      },
      config: config,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating response: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};
