export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          premium: boolean;
          subscription_id?: string;
          subscription_status: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          premium?: boolean;
          subscription_id?: string;
          subscription_status?: string;
        };
        Update: {
          email?: string;
          premium?: boolean;
          subscription_id?: string;
          subscription_status?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          original_text: string;
          skills: string[];
          experience: string[];
          created_at: string;
        };
        Insert: {
          user_id: string;
          original_text: string;
          skills?: string[];
          experience?: string[];
        };
        Update: {
          original_text?: string;
          skills?: string[];
          experience?: string[];
        };
      };
      resumes_rewritten: {
        Row: {
          id: string;
          resume_id: string;
          improved_text: string;
          created_at: string;
        };
        Insert: {
          resume_id: string;
          improved_text: string;
        };
        Update: {
          improved_text?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          employer_id: string;
          title: string;
          description: string;
          requirements: string[];
          salary_range: string;
          location: string;
          boosted: boolean;
          created_at: string;
        };
        Insert: {
          employer_id: string;
          title: string;
          description: string;
          requirements?: string[];
          salary_range?: string;
          location?: string;
          boosted?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          requirements?: string[];
          salary_range?: string;
          location?: string;
          boosted?: boolean;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          status: string;
          type: string;
          description: string;
          provider: string;
          stripe_payment_id: string | null;
          job_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          amount: number;
          status?: string;
          type?: string;
          description?: string;
          provider?: string;
          stripe_payment_id?: string;
          job_id?: string;
        };
        Update: {
          status?: string;
          type?: string;
          description?: string;
          provider?: string;
          stripe_payment_id?: string;
          job_id?: string;
        };
      };
    };
  };
}