export interface TAvailabilityInput {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface TCreateTechnicianProfile {
  bio?: string | null;
  skills: string[];
  experience?: number;
  hourlyRate: number;
  location?: string | null;
  availability?: TAvailabilityInput[];
}

export interface TUpdateTechnicianProfile {
  bio?: string | null;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  location?: string | null;
  availability?: TAvailabilityInput[];
}
