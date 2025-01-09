/**
 * Cleans and formats JSON string for parsing
 */
export function cleanJsonString(jsonStr: string): string {
  try {
    // Step 1: Remove any text before the first '[' and after the last ']'
    let cleaned = jsonStr.substring(
      jsonStr.indexOf('['),
      jsonStr.lastIndexOf(']') + 1
    );

    // Step 2: Fix common JSON formatting issues
    cleaned = cleaned
      // Remove trailing commas
      .replace(/,(\s*[}\]])/g, '$1')
      // Ensure property names are quoted
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')
      // Fix string values that should be numbers
      .replace(/"(\d+)"(?=\s*[,}])/g, '$1')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Fix any double quotes around numbers
      .replace(/"(-?\d+\.?\d*)"/, '$1');

    // Step 3: Validate basic JSON structure
    if (!cleaned.startsWith('[') || !cleaned.endsWith(']')) {
      throw new Error('Invalid JSON array structure');
    }

    return cleaned;
  } catch (error) {
    console.error('Error cleaning JSON string:', error);
    throw error;
  }
}
