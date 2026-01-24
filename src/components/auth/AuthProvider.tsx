import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { checkSession, setUser } = useAuthStore();

    useEffect(() => {
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [checkSession, setUser]);

    return <>{children}</>;
};
