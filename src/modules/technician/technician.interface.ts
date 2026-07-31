export type TCreateTechnicianProfile = {
  skills: string[];
  experience?: number;
  hourlyRate: number;
  location?: string;
};

export type TUpdateTechnicianProfile = {
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  location?: string;
};
