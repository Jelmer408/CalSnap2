// src/lib/utils/shareUtils.ts
import { CalorieEntry } from '../../store/calorieStore';
import { formatCalories } from '../utils';

export async function generateMealImage(entries: CalorieEntry[], dailyGoal: number): Promise<string> {
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas dimensions
  const width = 1200;
  const headerHeight = 160;
  const mealHeight = 100;
  const padding = 40;
  const height = headerHeight + (entries.length * mealHeight) + (padding * 2);

  canvas.width = width;
  canvas.height = height;

  // Fill background
  ctx.fillStyle = '#111827'; // Dark background
  ctx.fillRect(0, 0, width, height);

  // Draw header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Inter, system-ui, sans-serif';
  ctx.fillText('Daily Meals', padding, padding + 48);

  // Draw calorie summary
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  ctx.font = '32px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText(
    `${formatCalories(totalCalories)} / ${formatCalories(dailyGoal)} calories`,
    padding,
    padding + 100
  );

  // Draw meals
  let yPosition = headerHeight + padding;
  entries.forEach((meal, index) => {
    // Draw meal container
    ctx.fillStyle = '#1F2937';
    roundRect(ctx, padding, yPosition, width - (padding * 2), mealHeight - 20, 16);
    ctx.fill();

    // Draw meal emoji
    ctx.font = '32px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(meal.emoji || '🍽️', padding + 20, yPosition + 45);

    // Draw meal name
    ctx.font = 'bold 32px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(meal.name, padding + 80, yPosition + 45);

    // Draw calories
    ctx.font = '32px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#9CA3AF';
    const calorieText = `${formatCalories(meal.calories)} cal`;
    const calorieWidth = ctx.measureText(calorieText).width;
    ctx.fillText(calorieText, width - padding - calorieWidth - 20, yPosition + 45);

    yPosition += mealHeight;
  });

  return canvas.toDataURL('image/png');
}

// Helper function to draw rounded rectangles
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
