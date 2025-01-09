import { model, generationConfig } from './config';

const DEFAULT_EMOJI = '🍽️';
const MAX_RETRIES = 2;

const COMMON_FOOD_EMOJIS: Record<string, string> = {
  'apple': '🍎',
  'banana': '🍌',
  'bread': '🍞',
  'burger': '🍔',
  'coffee': '☕️',
  'egg': '🥚',
  'milk': '🥛',
  'orange': '🍊',
  'pizza': '🍕',
  'rice': '🍚',
  'salad': '🥗',
  'sandwich': '🥪',
  'soup': '🥣',
  'sushi': '🍱',
  'yogurt': '🥛'
};

export async function getFoodEmoji(foodName: string, retryCount = 0): Promise<string> {
  try {
    // Check common foods first
    const lowerFoodName = foodName.toLowerCase();
    for (const [key, emoji] of Object.entries(COMMON_FOOD_EMOJIS)) {
      if (lowerFoodName.includes(key)) {
        return emoji;
      }
    }

    // If retries exceeded, return default emoji
    if (retryCount >= MAX_RETRIES) {
      return DEFAULT_EMOJI;
    }

    const result = await model.generateContent([
      `Return only a single emoji that best represents this food: "${foodName}". 
       Return ONLY the emoji, no text or quotes.`
    ], {
      ...generationConfig,
      maxOutputTokens: 10,
      temperature: 0.1
    });

    const emoji = result.response?.text().trim();
    
    // Validate emoji
    if (!emoji || !emoji.match(/\p{Emoji}/u)) {
      throw new Error('Invalid emoji generated');
    }

    return emoji;
  } catch (error) {
    console.error('Error generating food emoji:', error);
    
    // Retry with backoff
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return getFoodEmoji(foodName, retryCount + 1);
    }
    
    return DEFAULT_EMOJI;
  }
}
