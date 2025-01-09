import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, subDays, startOfDay } from 'date-fns';

interface DateState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  goToNextDay: () => void;
  goToPreviousDay: () => void;
  goToToday: () => void;
}

export const useDateStore = create<DateState>()(
  persist(
    (set) => ({
      selectedDate: startOfDay(new Date()),
      
      setSelectedDate: (date) => set({ 
        selectedDate: startOfDay(date) 
      }),
      
      goToNextDay: () => set((state) => ({ 
        selectedDate: addDays(state.selectedDate, 1) 
      })),
      
      goToPreviousDay: () => set((state) => ({ 
        selectedDate: subDays(state.selectedDate, 1) 
      })),
      
      goToToday: () => set({ 
        selectedDate: startOfDay(new Date()) 
      }),
    }),
    {
      name: 'date-storage',
      partialize: (state) => ({ 
        selectedDate: state.selectedDate.toISOString() 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedDate = new Date(state.selectedDate);
        }
      },
    }
  )
);
