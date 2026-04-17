export type ScheduleType = 'open' | 'closed' | 'appointment';

export interface DaySchedule {
  type: ScheduleType;
  openTime?: string;  // Formato HH:mm
  closeTime?: string; // Formato HH:mm
}

export interface OpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}