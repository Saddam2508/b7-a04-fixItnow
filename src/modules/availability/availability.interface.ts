export type TCreateAvailability = {
  dayOfWeek: number; // 0 = Sunday ... 6 = Saturday
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
};

export type TUpdateAvailability = {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
};
