'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Scissors, ArrowRight, Loader2, User, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
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
            setError(translateError(error.message));
            setIsLoading(false);
            return;
        }

        setSuccess(true);
        setTimeout(() => {
            router.push(redirectTo);
        }, 2000);
    };

    const translateError = (msg: string) => {
        const translations: Record<string, string> = {
            'User already registered': 'Este email já está cadastrado. Tente fazer login.',
            'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
            'Unable to validate email address: invalid format': 'Formato de email inválido.',
        };
        return translations[msg] || msg;
    };

    if (success) {
        return (
            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
                    <Scissors className="w-8 h-8 text-[#10b981]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Conta criada!</h2>
                <p className="text-[#6b6b80]">Redirecionando para o dashboard...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6 sm:p-8">
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            <div className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Nome completo</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu nome"
                            required
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Email</label>
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

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Telefone (opcional)</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(11) 99999-9999"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
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

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Confirmar senha</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repita a senha"
                            required
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                        />
                    </div>
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
                            <span>Criando conta...</span>
                        </>
                    ) : (
                        <>
                            Criar conta
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

function FormFallback() {
    return (
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-8 animate-pulse">
            <div className="space-y-5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-[#1a1a2e] rounded-xl" />
                ))}
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />
            <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-[#10b981] rounded-full blur-[200px] opacity-10" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center mx-auto mb-4">
                        <Scissors className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Crie sua conta</h1>
                    <p className="text-[#6b6b80] mt-2">Junte-se ao Clippr gratuitamente</p>
                </div>

                <Suspense fallback={<FormFallback />}>
                    <RegisterForm />
                </Suspense>

                <p className="text-center mt-6 text-[#6b6b80]">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="text-[#e94560] hover:underline">
                        Fazer login
                    </Link>
                </p>
            </div>
        </div>
    );
}
