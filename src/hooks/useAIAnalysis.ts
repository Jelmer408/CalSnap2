import { useState, useEffect, useCallback } from 'react';
import { analyzeFoodImage } from '../lib/gemini/analyze';
import type { FoodAnalysis } from '../lib/gemini/types';

export function useAIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when app becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsAnalyzing(false);
        setError(null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const analyzeFood = useCallback(async (imageData: string): Promise<FoodAnalysis | null> => {
    try {
      // Ensure we're not already analyzing
      if (isAnalyzing) {
        return null;
      }

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
  }, [isAnalyzing]);

  return { 
    analyzeFood,
    isAnalyzing,
    error,
    clearError: () => setError(null)
  };
}
