import { GoogleGenAI, Modality } from "@google/genai";

// Fix: Use process.env.API_KEY as per the Gemini API guidelines.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set. Please add it to your project settings.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // The API can return multiple parts (text, image). We need to find the image part.
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    // If no image part is found in the response
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Made the error message more specific to help with debugging.
    throw new Error("Failed to generate image. Please check your prompt and ensure the API key is configured correctly.");
  }
};
