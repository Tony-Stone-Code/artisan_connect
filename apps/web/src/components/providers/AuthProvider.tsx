'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 1. Instantly hydrate from cache if available to prevent UI blocking
    const cachedUser = localStorage.getItem('artisan_user_cache');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        setIsLoading(false);
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Update cache
      if (session?.user) {
        localStorage.setItem('artisan_user_cache', JSON.stringify(session.user));
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('artisan_user_cache');
      }
      
      setIsLoading(false);
    });

    // Initial session fetch from server to ensure validity
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        localStorage.setItem('artisan_user_cache', JSON.stringify(session.user));
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
