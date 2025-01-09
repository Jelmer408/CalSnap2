export interface FitnessMilestone {
  id: string;
  name: string;
  targetValue: number;
  unit: string;
  targetDate: string;
  achievedDate?: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'other';
  notes?: string;
}

export const MILESTONE_CATEGORIES = {
  strength: {
    label: 'Strength',
    icon: '💪',
    units: ['kg', 'lbs', 'reps']
  },
  cardio: {
    label: 'Cardio',
    icon: '🏃',
    units: ['km', 'miles', 'minutes']
  },
  flexibility: {
    label: 'Flexibility',
    icon: '🧘',
    units: ['cm', 'inches', 'degrees']
  },
  other: {
    label: 'Other',
    icon: '🎯',
    units: ['kg', 'lbs', 'reps', 'km', 'miles', 'minutes']
  }
} as const;
