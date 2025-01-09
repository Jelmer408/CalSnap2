export interface DaySchedule {
  startTime: string;
  endTime: string;
}

export interface WeekSchedule {
  weekday: DaySchedule;
  weekend: DaySchedule;
}
