import { create } from 'zustand';
import { supabase, Profile } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        set({ user: data.user, isAuthenticated: true });
        await get().fetchProfile();
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error.message);
      throw error;
    }
  },

  signUp: async (email, password, userData) => {
    try {
      // 1. Créer l'utilisateur
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // 2. Créer le profil
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            ...userData,
            verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        
        if (profileError) throw profileError;
        
        set({ user: data.user, isAuthenticated: true });
        await get().fetchProfile();
      }
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error.message);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, profile: null, isAuthenticated: false });
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error.message);
      throw error;
    }
  },

  fetchProfile: async () => {
    try {
      const user = get().user;
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      set({ profile: data, loading: false });
    } catch (error: any) {
      console.error('Erreur de chargement du profil:', error.message);
      set({ loading: false });
    }
  },

  updateProfile: async (updates) => {
    try {
      const user = get().user;
      if (!user) throw new Error('Non authentifié');
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      set({ profile: data });
    } catch (error: any) {
      console.error('Erreur de mise à jour du profil:', error.message);
      throw error;
    }
  },
}));

// Initialisation de l'authentification
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null);
  if (session?.user) {
    useAuthStore.getState().fetchProfile();
  }
});
