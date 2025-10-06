
export interface Profile {
  fullName: string;
  professionalSummary: string;
  skills: string[];
  desiredRole: string;
}

export interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  description?: string;
}

export enum Role {
  User = 'user',
  AI = 'ai',
}

export interface Message {
  role: Role;
  content: string;
  jobs?: Job[];
}
