import { useCallback, useState } from 'react';
import { analyzeFoodImage } from '../lib/gemini/analyze';
import type { FoodAnalysis } from '../lib/gemini/types';

export function useAIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeFood = useCallback(async (imageData: string): Promise<FoodAnalysis | null> => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      const result = await analyzeFoodImage(imageData);
      if (!result) {
        throw new Error('Could not analyze the food image. Please try again with a clearer photo.');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An error occurred while analyzing the image. Please try again.';
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { 
    analyzeFood,
    isAnalyzing,
    error,
    clearError: () => setError(null)
  };
}
