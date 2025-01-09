// src/lib/utils/shareUtils.ts

import { CalorieEntry } from '../../store/calorieStore';
import { formatCalories } from '../utils';
import { MealType, MEAL_TYPES } from '../../types/meals';
import { format } from 'date-fns';

const FONT_STACK = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

export async function generateMealImage(entries: CalorieEntry[], dailyGoal: number): Promise<string> {
  // Calculate content height based on number of entries
  const headerHeight = 100;
  const goalCardHeight = 300;
  const mealSectionPadding = 40;
  const mealItemHeight = 100;
  const mealTypeHeaderHeight = 60;
  
  // Calculate height for meal sections
  const mealsByType = Object.entries(MEAL_TYPES).reduce((acc, [type]) => {
    acc[type as MealType] = entries.filter(entry => entry.mealType === type);
    return acc;
  }, {} as Record<MealType, CalorieEntry[]>);

  let totalMealSectionsHeight = 0;
  Object.entries(mealsByType).forEach(([_, meals]) => {
    if (meals.length > 0) {
      totalMealSectionsHeight += mealTypeHeaderHeight + (meals.length * mealItemHeight) + mealSectionPadding;
    }
  });

  // Set canvas dimensions
  const width = 1080;
  const height = headerHeight + goalCardHeight + totalMealSectionsHeight + 100; // Extra padding at bottom
  const padding = 40;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = width;
  canvas.height = height;

  // Background
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, width, height);

  // Date Header
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `500 48px ${FONT_STACK}`; // medium weight
  ctx.textAlign = 'center';
  ctx.fillText(format(new Date(), 'EEE, MMM d'), width / 2, 60);

  // Daily Goal Card
  const cardY = headerHeight;
  const cardWidth = width - (padding * 2);
  
  // Card background with gradient
  const cardGradient = ctx.createLinearGradient(padding, cardY, padding + cardWidth, cardY + 250);
  cardGradient.addColorStop(0, '#3B82F6');
  cardGradient.addColorStop(1, '#4F46E5');
  
  ctx.fillStyle = cardGradient;
  roundRect(ctx, padding, cardY, cardWidth, 250, 30);
  ctx.fill();

  // Calculate totals
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const progress = Math.min(Math.round((totalCalories / dailyGoal) * 100), 100);

  // Daily Goal Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 48px ${FONT_STACK}`; // bold weight
  ctx.textAlign = 'left';
  ctx.fillText('Daily Goal', padding + 40, cardY + 60);

  // Progress percentage
  ctx.textAlign = 'right';
  ctx.fillText(`${progress}%`, width - padding - 40, cardY + 60);

  // Progress bar
  const progressBarWidth = cardWidth - 80;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  roundRect(ctx, padding + 40, cardY + 90, progressBarWidth, 20, 10);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, padding + 40, cardY + 90, progressBarWidth * (progress / 100), 20, 10);
  ctx.fill();

  // Consumed and Remaining labels
  ctx.textAlign = 'left';
  ctx.font = `400 32px ${FONT_STACK}`; // regular weight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('Consumed', padding + 40, cardY + 160);
  ctx.fillText('Remaining', padding + 40, cardY + 220);

  // Calorie values
  ctx.textAlign = 'right';
  ctx.font = `700 48px ${FONT_STACK}`; // bold weight
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(formatCalories(totalCalories), width - padding - 40, cardY + 160);
  ctx.fillText(formatCalories(Math.max(dailyGoal - totalCalories, 0)), width - padding - 40, cardY + 220);

  // Meals Sections
  let yPosition = headerHeight + goalCardHeight + 40;

  Object.entries(MEAL_TYPES).forEach(([type, info]) => {
    const meals = mealsByType[type as MealType];
    if (meals.length === 0) return;

    // Meal type headers
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `500 32px ${FONT_STACK}`; // medium weight
    ctx.textAlign = 'left';
    ctx.fillText(`${info.icon} ${info.label}`, padding, yPosition + 40);
    yPosition += mealTypeHeaderHeight;

    // Draw meals
    meals.forEach(meal => {
      // Meal container background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      roundRect(ctx, padding, yPosition, width - (padding * 2), 80, 20);
      ctx.fill();

      // Meal content
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `400 36px ${FONT_STACK}`; // regular weight
      ctx.fillText(meal.emoji || '🍽️', padding + 30, yPosition + 50);
      ctx.fillText(meal.name, padding + 100, yPosition + 50);

      // Calories
      ctx.textAlign = 'right';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`${formatCalories(meal.calories)} cal`, width - padding - 30, yPosition + 50);
      ctx.textAlign = 'left';

      yPosition += mealItemHeight;
    });

    yPosition += mealSectionPadding;
  });

  return canvas.toDataURL('image/png');
}

// Helper function for rounded rectangles
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
