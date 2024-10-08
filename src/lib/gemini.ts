import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI;

export function initializeGeminiAPI(apiKey: string) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function processContent(
  model: string,
  content: { fileData: { mimeType: string; fileUri: string } }[],
  features: string[]
) {
  if (!genAI) {
    throw new Error("Gemini API not initialized");
  }

  const geminiModel = genAI.getGenerativeModel({ model });

  const prompts = features.map((feature) => {
    switch (feature) {
      case 'describe':
        return "Describe the content of this image or video in detail.";
      case 'summarize':
        return "Summarize the main points or elements of this image or video.";
      case 'extrapolate':
        return "Based on this image or video, what conclusions or predictions can you make?";
      default:
        return "";
    }
  });

  const results = await Promise.all(
    prompts.map(async (prompt) => {
      const result = await geminiModel.generateContent([...content, { text: prompt }]);
      return result.response.text();
    })
  );

  return results.join('\n\n');
}