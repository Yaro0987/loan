import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  cardValidated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  cardValidated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cardValidated, setCardValidated] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin, card_validated')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(profile?.is_admin ?? false);
        setCardValidated(profile?.card_validated ?? false);
      } else {
        setIsAdmin(false);
        setCardValidated(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, cardValidated }}>
      {children}
    </AuthContext.Provider>
  );
};