import { MealPattern, MealSuggestion, SuggestionPreferences } from '../../types/suggestions';
import { differenceInHours, parseISO, format, isToday, isYesterday } from 'date-fns';
import { getFoodEmoji } from '../gemini/foodEmoji';
import { model } from '../gemini/config';

export async function generateSuggestions(
  patterns: Record<string, MealPattern>,
  preferences: SuggestionPreferences
): Promise<MealSuggestion[]> {
  const suggestions = await generatePatternBasedSuggestions(patterns, preferences);
  
  // If we have enough pattern-based suggestions, return them
  if (suggestions.length >= 3) {
    return suggestions;
  }

  // Otherwise, augment with AI-generated suggestions
  const aiSuggestions = await generateAISuggestions(preferences);
  return [...suggestions, ...aiSuggestions].slice(0, 5);
}

async function generatePatternBasedSuggestions(
  patterns: Record<string, MealPattern>,
  preferences: SuggestionPreferences
): Promise<MealSuggestion[]> {
  const suggestions: MealSuggestion[] = [];
  const now = new Date();
  const currentHour = now.getHours();

  for (const [key, pattern] of Object.entries(patterns)) {
    const [name, mealType] = key.split('-');
    const lastEatenDate = parseISO(pattern.lastEaten);
    
    // Calculate confidence score
    let confidence = 0;
    
    // Frequency boost (max 0.3)
    confidence += Math.min(pattern.frequency / 10, 0.3);
    
    // Time relevance boost (max 0.3)
    const patternHour = parseInt(pattern.timeOfDay.split(':')[0]);
    const hourDiff = Math.abs(currentHour - patternHour);
    if (hourDiff <= 2) confidence += 0.3;
    else if (hourDiff <= 4) confidence += 0.15;
    
    // Recency boost (max 0.4)
    if (!isToday(lastEatenDate) && !isYesterday(lastEatenDate)) {
      confidence += 0.4;
    }

    if (pattern.calories <= preferences.maxCalories && 
        !isToday(lastEatenDate) &&
        confidence > 0.3) {
      
      const emoji = await getFoodEmoji(name);
      suggestions.push({
        name,
        calories: pattern.calories,
        mealType,
        confidence: Number(confidence.toFixed(2)),
        emoji,
        lastEaten: pattern.lastEaten
      });
    }
  }

  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

async function generateAISuggestions(
  preferences: SuggestionPreferences
): Promise<MealSuggestion[]> {
  try {
    const prompt = `Suggest a healthy meal for ${preferences.timeOfDay} with these requirements:
      - Maximum calories: ${preferences.maxCalories}
      - Minimum protein: ${preferences.minProtein}g
      Return ONLY a JSON array with exactly one suggestion:
      [{ "name": "meal name", "calories": number, "mealType": "breakfast|lunch|dinner|snack" }]`;

    const result = await model.generateContent(prompt);
    if (!result.response?.text()) return [];

    const text = result.response.text().trim();
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) return [];

    const suggestions = JSON.parse(jsonMatch[0]);
    return await Promise.all(suggestions.map(async (s: any) => ({
      ...s,
      confidence: 0.5,
      emoji: await getFoodEmoji(s.name)
    })));
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return [];
  }
}
