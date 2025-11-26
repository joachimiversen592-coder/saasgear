import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'startup' | 'lawyer' | 'enterprise_admin';
          organization_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          plan: 'starter' | 'growth' | 'enterprise';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      contracts: {
        Row: {
          id: string;
          title: string;
          content: string;
          status: 'draft' | 'in_review' | 'reviewed' | 'signed' | 'archived';
          owner_id: string;
          organization_id: string | null;
          lawyer_id: string | null;
          counterparty: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contracts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contracts']['Insert']>;
      };
      contract_versions: {
        Row: {
          id: string;
          contract_id: string;
          content: string;
          version_number: number;
          changed_by: string;
          change_description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contract_versions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contract_versions']['Insert']>;
      };
      contract_comments: {
        Row: {
          id: string;
          contract_id: string;
          user_id: string;
          content: string;
          position: number | null;
          resolved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contract_comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contract_comments']['Insert']>;
      };
      lawyer_reviews: {
        Row: {
          id: string;
          contract_id: string;
          lawyer_id: string;
          status: 'pending' | 'in_progress' | 'completed';
          fee_amount: number;
          paid: boolean;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lawyer_reviews']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['lawyer_reviews']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          details: Record<string, any> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
    };
  };
};
