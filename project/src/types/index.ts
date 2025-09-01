export interface User {
  id: string;
  email: string;
  premium: boolean;
  subscription_id?: string;
  subscription_status: string;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  original_text: string;
  skills: string[];
  experience: string[];
  created_at: string;
}

export interface ResumeRewritten {
  id: string;
  resume_id: string;
  improved_text: string;
  created_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  requirements: string[];
  salary_range: string;
  location: string;
  boosted: boolean;
  created_at: string;
}

export interface JobMatch {
  job: Job;
  score: number;
  matching_skills: string[];
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'subscription' | 'job_boost';
  description: string;
  provider: 'stripe' | 'paystack';
  stripe_payment_id?: string;
  job_id?: string;
  created_at: string;
}

export interface ParsedResume {
  skills: string[];
  experience: string[];
}