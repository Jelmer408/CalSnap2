import { model, generationConfig } from './config';
import { FoodAnalysis, GeminiResponse } from './types';
import { parseGeminiResponse } from './parser';
import { validateGeminiResponse } from './validators/responseValidators';

export async function analyzeFoodImage(imageData: string): Promise<FoodAnalysis | null> {
  try {
    const base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      },
      {
        text: "Analyze this food image and return ONLY a JSON object with these keys and types: \"Food name\" (string), \"Calories\" (number, no decimals), \"Proteins\" (number, max 1 decimal). Format: {\"Food name\": \"Apple\", \"Calories\": 95, \"Proteins\": 0.5}. Do not include any other text."
      }
    ], generationConfig);

    if (!result.response) {
      throw new Error('No response from Gemini API');
    }

    const text = result.response.text();
    const parsedResponse = parseGeminiResponse(text);
    if (!parsedResponse) {
      throw new Error('Failed to parse Gemini response');
    }

    const validatedResponse = validateGeminiResponse(parsedResponse);
    if (!validatedResponse) {
      throw new Error('Invalid response data');
    }

    return {
      name: validatedResponse["Food name"],
      calories: Math.round(validatedResponse.Calories),
      protein: Number(validatedResponse.Proteins.toFixed(1))
    };
  } catch (error) {
    console.error('Error analyzing food:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return null;
  }
}
