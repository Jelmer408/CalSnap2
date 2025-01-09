import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyMealPlan } from '../types/mealPlan';

interface MealPlanState {
  plans: DailyMealPlan[];
  activePlan: DailyMealPlan | null;
  addPlan: (plan: DailyMealPlan) => void;
  setActivePlan: (plan: DailyMealPlan | null) => void;
  deletePlan: (id: string) => void;
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set) => ({
      plans: [],
      activePlan: null,
      addPlan: (plan) =>
        set((state) => ({
          plans: [plan, ...state.plans],
          activePlan: plan
        })),
      setActivePlan: (plan) =>
        set({ activePlan: plan }),
      deletePlan: (id) =>
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
          activePlan: state.activePlan?.id === id ? null : state.activePlan
        }))
    }),
    {
      name: 'meal-plan-storage'
    }
  )
);
