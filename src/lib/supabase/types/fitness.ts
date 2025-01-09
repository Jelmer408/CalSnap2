export interface WeightEntry {
  id: string;
  user_id: string;
  weight: number;
  date: string;
  note?: string;
  created_at: string;
}

export interface FitnessGoal {
  user_id: string;
  target_weight: number;
  start_weight: number;
  start_date: string;
  target_date: string;
  goal_type: 'gain' | 'lose' | 'maintain';
  created_at: string;
  updated_at: string;
}

export interface FitnessMilestone {
  id: string;
  user_id: string;
  name: string;
  target_value: number;
  unit: string;
  target_date: string;
  achieved_date?: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'other';
  notes?: string;
  created_at: string;
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
