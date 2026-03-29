export interface UserData {
  firstName: string;
  email: string;
  service: string;
  revenue: string;
  method: string;
  struggle: string;
  score: number;
}

export type FunnelStep = 'landing' | 'lead-capture' | 'quiz' | 'results' | 'payment' | 'delivery';
