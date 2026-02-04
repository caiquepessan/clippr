'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Scissors, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(translateError(error.message));
            setIsLoading(false);
            return;
        }

        router.push(redirectTo);
    };

    const translateError = (msg: string) => {
        const translations: Record<string, string> = {
            'Invalid login credentials': 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
            'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
        };
        return translations[msg] || msg;
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6 sm:p-8">
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            <div className="space-y-5">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-[#a0a0b0] mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-[#a0a0b0] mb-2">
                        Senha
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b80] hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                    <Link href="/esqueci-senha" className="text-sm text-[#e94560] hover:underline">
                        Esqueceu a senha?
                    </Link>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Entrando...</span>
                        </>
                    ) : (
                        <>
                            Entrar
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

function LoginFormFallback() {
    return (
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6 sm:p-8 animate-pulse">
            <div className="space-y-5">
                <div className="h-16 bg-[#1a1a2e] rounded-xl" />
                <div className="h-16 bg-[#1a1a2e] rounded-xl" />
                <div className="h-12 bg-[#1a1a2e] rounded-xl" />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen pt-16 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#e94560] rounded-full blur-[200px] opacity-10" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center mx-auto mb-4">
                        <Scissors className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
                    <p className="text-[#6b6b80] mt-2">Entre para acessar sua conta</p>
                </div>

                {/* Form with Suspense */}
                <Suspense fallback={<LoginFormFallback />}>
                    <LoginForm />
                </Suspense>

                {/* Register Link */}
                <p className="text-center mt-6 text-[#6b6b80]">
                    Não tem uma conta?{' '}
                    <Link href="/registrar" className="text-[#e94560] hover:underline">
                        Criar conta
                    </Link>
                </p>
            </div>
        </div>
    );
}
