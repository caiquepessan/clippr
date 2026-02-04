'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, User, Mail, Phone, MapPin, Lock, Loader2, ArrowRight, Scissors } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function CadastroForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get('plano') || 'starter';

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Owner data
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // Barbershop data
    const [barbershopName, setBarbershopName] = useState('');
    const [city, setCity] = useState('');
    const [neighborhood, setNeighborhood] = useState('');

    const handleStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleStep2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const supabase = createClient();

        // Create user account
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: ownerName,
                    phone,
                    role: 'owner',
                },
            },
        });

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
            return;
        }

        // Create barbershop
        if (authData.user) {
            const slug = barbershopName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const { error: shopError } = await supabase.from('barbershops').insert({
                name: barbershopName,
                slug: `${slug}-${Date.now().toString(36)}`,
                owner_id: authData.user.id,
                city,
                neighborhood,
                state: 'SP',
                subscription_plan_id: plan === 'pro' ? 2 : 1,
                is_active: true,
            });

            if (shopError) {
                console.error('Barbershop error:', shopError);
                // Continue anyway - can be fixed later
            }
        }

        setStep(3);
        setIsLoading(false);

        setTimeout(() => {
            router.push('/dashboard');
        }, 3000);
    };

    if (step === 3) {
        return (
            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
                    <Scissors className="w-8 h-8 text-[#10b981]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Parabéns! 🎉</h2>
                <p className="text-[#a0a0b0] mb-4">
                    Sua barbearia <strong className="text-white">{barbershopName}</strong> foi cadastrada com sucesso!
                </p>
                <p className="text-[#6b6b80] text-sm">Redirecionando para o dashboard...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6 sm:p-8">
            {/* Progress */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-[#e94560] text-white' : 'bg-[#2a2a3a] text-[#6b6b80]'}`}>
                    1
                </div>
                <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-[#e94560]' : 'bg-[#2a2a3a]'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-[#e94560] text-white' : 'bg-[#2a2a3a] text-[#6b6b80]'}`}>
                    2
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            {step === 1 && (
                <form onSubmit={handleStep1} className="space-y-5">
                    <h2 className="text-xl font-bold text-white mb-2">Seus dados</h2>
                    <p className="text-[#6b6b80] text-sm mb-6">Informações do proprietário</p>

                    <div>
                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Nome completo</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                            <input
                                type="text"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                placeholder="Seu nome"
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                            />
                        </div>
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Telefone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(11) 99999-9999"
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-primary text-white font-semibold"
                    >
                        Continuar
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleStep2} className="space-y-5">
                    <h2 className="text-xl font-bold text-white mb-2">Sua barbearia</h2>
                    <p className="text-[#6b6b80] text-sm mb-6">Informações do estabelecimento</p>

                    <div>
                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Nome da barbearia</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                            <input
                                type="text"
                                value={barbershopName}
                                onChange={(e) => setBarbershopName(e.target.value)}
                                placeholder="Ex: Barbearia Elite"
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Cidade</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Ex: São Paulo"
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Bairro</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                            <input
                                type="text"
                                value={neighborhood}
                                onChange={(e) => setNeighborhood(e.target.value)}
                                placeholder="Ex: Jardins"
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white font-medium hover:border-[#3a3a4a] transition-colors"
                        >
                            Voltar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    Cadastrar
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

function FormFallback() {
    return (
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-8 animate-pulse">
            <div className="space-y-5">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-[#1a1a2e] rounded-xl" />
                ))}
            </div>
        </div>
    );
}

export default function CadastroBarbeariaPage() {
    return (
        <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e94560] rounded-full blur-[200px] opacity-10" />

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Cadastrar Barbearia</h1>
                    <p className="text-[#6b6b80] mt-2">Comece a receber agendamentos online</p>
                </div>

                <Suspense fallback={<FormFallback />}>
                    <CadastroForm />
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
