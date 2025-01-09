import { cleanJsonString } from './jsonCleaner';
import { validateJsonStructure } from './jsonValidator';

export function sanitizeJsonResponse(text: string): string | null {
  try {
    // Step 1: Find JSON array in response
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) {
      console.error('No JSON array found in response');
      return null;
    }

    // Step 2: Clean the JSON string
    const cleanedJson = cleanJsonString(jsonMatch[0]);

    // Step 3: Validate the structure
    if (!validateJsonStructure(cleanedJson)) {
      return null;
    }

    return cleanedJson;
  } catch (error) {
    console.error('Error sanitizing JSON response:', error);
    return null;
  }
}
