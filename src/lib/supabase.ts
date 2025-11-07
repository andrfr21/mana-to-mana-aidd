import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
// IMPORTANT: Remplacer ces valeurs par vos vraies clés Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types de base de données
export interface Profile {
  id: string;
  user_id: string;
  user_type: 'donor' | 'beneficiary';
  full_name: string;
  phone?: string;
  location: string;
  avatar_url?: string;
  bio?: string;
  needs?: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Need {
  id: string;
  beneficiary_id: string;
  title: string;
  description: string;
  category: 'clothes' | 'food' | 'hygiene' | 'housing' | 'children' | 'other';
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'fulfilled';
  location: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  donor_id: string;
  beneficiary_id: string;
  need_id?: string;
  status: 'active' | 'archived';
  last_message_at: string;
  created_at: string;
}
