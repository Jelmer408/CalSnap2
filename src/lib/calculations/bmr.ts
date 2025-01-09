// Basal Metabolic Rate calculations using Mifflin-St Jeor Equation
export function calculateBMR(
  weight: number, 
  weightUnit: 'kg' | 'lbs',
  height: number,
  heightUnit: 'cm' | 'ft',
  age: number,
  sex: 'male' | 'female' | 'other'
): number {
  // Convert to metric if needed
  const weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
  const heightCm = heightUnit === 'ft' ? height * 30.48 : height;

  // Base BMR calculation
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  
  // Sex-specific adjustment
  if (sex === 'male') {
    bmr += 5;
  } else if (sex === 'female') {
    bmr -= 161;
  } else {
    // For non-binary individuals, use an average
    bmr -= 78;
  }

  return Math.round(bmr);
}
