import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkExistingSession = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session?.user) {
          setUser(session.user);
          
          // Verify the session is still valid with the server
          const { data: { user: currentUser }, error: refreshError } = await supabase.auth.getUser();
          
          if (refreshError || !currentUser) {
            // If session is invalid, clear it
            await supabase.auth.signOut();
            setUser(null);
          } else {
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        // Store auth state in localStorage for PWA persistence
        localStorage.setItem('authState', JSON.stringify({
          isAuthenticated: true,
          timestamp: Date.now()
        }));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('authState');
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      }
    });

    // Check if this is a PWA and we have stored auth state
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    if (isPWA) {
      const storedAuthState = localStorage.getItem('authState');
      if (storedAuthState) {
        const { isAuthenticated, timestamp } = JSON.parse(storedAuthState);
        const hoursSinceAuth = (Date.now() - timestamp) / (1000 * 60 * 60);
        
        // If authenticated less than 24 hours ago, try to restore session
        if (isAuthenticated && hoursSinceAuth < 24) {
          checkExistingSession();
        }
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('authState');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
