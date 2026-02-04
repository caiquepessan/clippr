import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar sessão existente
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    name: session.user.user_metadata?.name || 'Usuário',
                    email: session.user.email || '',
                    phone: session.user.user_metadata?.phone || '',
                    avatar: session.user.user_metadata?.avatar,
                });
            }
            setIsLoading(false);
        });

        // Listener para mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    name: session.user.user_metadata?.name || 'Usuário',
                    email: session.user.email || '',
                    phone: session.user.user_metadata?.phone || '',
                    avatar: session.user.user_metadata?.avatar,
                });
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { success: false, error: translateError(error.message) };
            }

            if (data.user) {
                setUser({
                    id: data.user.id,
                    name: data.user.user_metadata?.name || 'Usuário',
                    email: data.user.email || '',
                    phone: data.user.user_metadata?.phone || '',
                    avatar: data.user.user_metadata?.avatar,
                });
                setSession(data.session);
                return { success: true };
            }

            return { success: false, error: 'Erro desconhecido' };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: 'Erro de conexão' };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        phone: string
    ): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        phone,
                    },
                },
            });

            if (error) {
                return { success: false, error: translateError(error.message) };
            }

            if (data.user) {
                setUser({
                    id: data.user.id,
                    name,
                    email,
                    phone,
                });
                setSession(data.session);
                return { success: true };
            }

            return { success: false, error: 'Erro desconhecido' };
        } catch (error) {
            console.error('Erro no registro:', error);
            return { success: false, error: 'Erro de conexão' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isAuthenticated: !!session,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Traduzir erros do Supabase para português
function translateError(error: string): string {
    const translations: Record<string, string> = {
        // Erros de login
        'Invalid login credentials': 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
        'invalid_credentials': 'Email ou senha incorretos.',

        // Erros de email
        'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
        'User already registered': 'Este email já está cadastrado. Tente fazer login.',
        'Unable to validate email address: invalid format': 'Formato de email inválido.',
        'A user with this email address has already been registered': 'Este email já está em uso.',

        // Erros de senha
        'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
        'Password is too weak': 'A senha é muito fraca. Use letras, números e símbolos.',

        // Erros de rate limit
        'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
        'For security purposes, you can only request this after': 'Por segurança, aguarde alguns minutos antes de tentar novamente.',

        // Erros de conexão
        'Network request failed': 'Sem conexão com a internet. Verifique sua rede.',
        'fetch failed': 'Erro de conexão. Verifique sua internet.',

        // Outros
        'User not found': 'Usuário não encontrado.',
        'Too many requests': 'Muitas tentativas. Aguarde e tente novamente.',
    };

    // Verificar correspondência parcial
    for (const [key, value] of Object.entries(translations)) {
        if (error.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }

    return translations[error] || error;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
}
