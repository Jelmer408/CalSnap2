import { GoogleGenerativeAI } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI('AIzaSyDb21NAH-tG7plwwpADPJbvExg-gxV5MEI');

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b", // Updated to the recommended model
});

export const generationConfig = {
  temperature: 0.4,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 1024
};
