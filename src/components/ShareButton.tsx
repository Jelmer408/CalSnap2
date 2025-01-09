// src/components/ShareButton.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react'; // Using Share2 for a more subtle icon
import { CalorieEntry } from '../store/calorieStore';
import { generateMealImage } from '../lib/utils/shareUtils';
import { useToastContext } from '../providers/ToastProvider';
import { cn } from '../lib/utils';

interface ShareButtonProps {
  entries: CalorieEntry[];
  dailyGoal: number;
}

export function ShareButton({ entries, dailyGoal }: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastContext();

  const shareMeals = async () => {
    if (!entries.length) {
      showToast('No meals to share', 'info');
      return;
    }

    setLoading(true);
    try {
      const imageData = await generateMealImage(entries, dailyGoal);
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], 'meals.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Daily Meals',
            text: 'Check out my meals for today!'
          });
          showToast('Meals shared successfully!');
        } catch (shareError) {
          if (shareError instanceof Error && shareError.name !== 'AbortError') {
            downloadImage(imageData);
          }
        }
      } else {
        downloadImage(imageData);
      }
    } catch (error) {
      console.error('Error sharing meals:', error);
      showToast('Failed to share meals. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageData: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'meals.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Image downloaded successfully!');
  };

  return (
    <div className="mt-6 flex justify-end">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={shareMeals}
        disabled={loading || !entries.length}
        className={cn(
          "group flex items-center space-x-2 px-4 py-2",
          "text-sm text-gray-500 dark:text-gray-400",
          "bg-gray-50 dark:bg-gray-800/50",
          "border border-gray-200 dark:border-gray-700",
          "rounded-lg transition-all duration-200",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "hover:border-gray-300 dark:hover:border-gray-600",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        )}
      >
        <Share2 
          className={cn(
            "w-4 h-4 transition-all duration-200",
            loading ? "animate-spin" : "group-hover:text-blue-500"
          )}
        />
        <span className="group-hover:text-gray-700 dark:group-hover:text-gray-300">
          {loading ? 'Processing...' : 'Share Summary'}
        </span>
      </motion.button>
    </div>
  );
}
