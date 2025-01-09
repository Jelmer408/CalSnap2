import { GeminiResponse } from './types';

export function parseGeminiResponse(text: string): GeminiResponse | null {
  const jsonMatch = text.match(/\{[^]*\}/);
  
  if (!jsonMatch) {
    console.error('No valid JSON found in response:', text);
    return null;
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error parsing response JSON:', error);
    return null;
  }
}
