import { GeminiResponse } from '../types';

export function validateGeminiResponse(response: GeminiResponse): GeminiResponse | null {
  try {
    // Check if all required fields exist
    if (!response["Food name"] || 
        !response.Calories || 
        !response.Proteins) {
      console.error('Missing required fields in response');
      return null;
    }

    // Validate food name
    if (typeof response["Food name"] !== 'string' || 
        response["Food name"].trim().length === 0) {
      console.error('Invalid food name');
      return null;
    }

    // Validate calories
    if (typeof response.Calories !== 'number' || 
        response.Calories < 0 || 
        response.Calories > 5000) {
      console.error('Invalid calories value');
      return null;
    }

    // Validate proteins
    if (typeof response.Proteins !== 'number' || 
        response.Proteins < 0 || 
        response.Proteins > 200) {
      console.error('Invalid proteins value');
      return null;
    }

    return {
      "Food name": response["Food name"].trim(),
      Calories: Math.round(response.Calories),
      Proteins: Number(response.Proteins.toFixed(1))
    };
  } catch (error) {
    console.error('Error validating Gemini response:', error);
    return null;
  }
}
