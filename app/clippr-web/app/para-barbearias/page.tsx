import Link from 'next/link';
import {
    Scissors, Calendar, Users, BarChart3, CreditCard, Star,
    CheckCircle, ArrowRight, Smartphone, Monitor, Bell, TrendingUp
} from 'lucide-react';

export default function ParaBarbeariasPage() {
    const features = [
        {
            icon: Calendar,
            title: 'Agendamento Online',
            description: 'Seus clientes agendam 24/7 direto pelo app ou site. Sem ligações, sem confusão.',
        },
        {
            icon: Users,
            title: 'Gestão de Equipe',
            description: 'Controle a agenda de cada barbeiro, defina folgas e gerencie a produtividade.',
        },
        {
            icon: BarChart3,
            title: 'Relatórios Detalhados',
            description: 'Acompanhe faturamento, serviços mais pedidos e desempenho em tempo real.',
        },
        {
            icon: CreditCard,
            title: 'Pagamentos Integrados',
            description: 'Receba online via Pix, cartão ou na barbearia. Tudo em um só lugar.',
        },
        {
            icon: Bell,
            title: 'Lembretes Automáticos',
            description: 'Reduza faltas com notificações automáticas para seus clientes.',
        },
        {
            icon: TrendingUp,
            title: 'Programa de Fidelidade',
            description: 'Fidelize clientes com pontos e recompensas exclusivas.',
        },
    ];

    const plans = [
        {
            name: 'Starter',
            price: 'Grátis',
            description: 'Para começar',
            features: [
                'Até 2 barbeiros',
                'Agendamento online básico',
                'Perfil na plataforma Clippr',
                'Suporte por email',
            ],
            cta: 'Começar grátis',
            highlighted: false,
        },
        {
            name: 'Pro',
            price: 'R$ 99',
            period: '/mês',
            description: 'Para barbearias em crescimento',
            features: [
                'Até 5 barbeiros',
                'Agendamento ilimitado',
                'Relatórios avançados',
                'Programa de fidelidade',
                'Lembretes automáticos',
                'Suporte prioritário',
            ],
            cta: 'Testar 14 dias grátis',
            highlighted: true,
        },
        {
            name: 'Enterprise',
            price: 'Personalizado',
            description: 'Para redes de barbearias',
            features: [
                'Barbeiros ilimitados',
                'Múltiplas unidades',
                'API de integração',
                'Dashboard consolidado',
                'Gerente de conta dedicado',
                'SLA garantido',
            ],
            cta: 'Falar com vendas',
            highlighted: false,
        },
    ];

    const testimonials = [
        {
            name: 'Carlos Silva',
            role: 'Dono da Barba Negra',
            content: 'Aumentamos nossos agendamentos em 40% no primeiro mês. O Clippr simplificou toda nossa operação.',
            rating: 5,
        },
        {
            name: 'Roberto Santos',
            role: 'Proprietário da Elite Barber',
            content: 'Finalmente consigo ver relatórios de verdade. Sei exatamente quanto cada barbeiro fatura.',
            rating: 5,
        },
        {
            name: 'Marcos Oliveira',
            role: 'Fundador da Old School Barber',
            content: 'Os clientes adoram o programa de pontos. Voltam sempre para ganhar recompensas.',
            rating: 5,
        },
    ];

    return (
        <div className="pt-16">
            {/* Hero */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#e94560] rounded-full blur-[180px] opacity-20" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#ffd700] rounded-full blur-[180px] opacity-10" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121a] border border-[#2a2a3a] mb-6">
                                <Scissors className="w-4 h-4 text-[#e94560]" />
                                <span className="text-sm text-[#a0a0b0]">Para Barbearias</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                Digitalize sua <span className="gradient-text">barbearia</span> hoje
                            </h1>

                            <p className="text-lg text-[#a0a0b0] mb-8 max-w-lg">
                                Gerencie agendamentos, equipe e faturamento em um só lugar.
                                Aumente sua receita e fidelize clientes com a plataforma mais completa do Brasil.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/cadastro-barbearia"
                                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl btn-primary text-white font-semibold"
                                >
                                    Começar grátis
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="#planos"
                                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#12121a] border border-[#2a2a3a] text-white font-semibold hover:border-[#3a3a4a] transition-colors"
                                >
                                    Ver planos
                                </Link>
                            </div>

                            <div className="flex items-center gap-8 mt-10">
                                <div>
                                    <div className="text-2xl font-bold text-white">1000+</div>
                                    <div className="text-[#6b6b80]">Barbearias</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">4.9/5</div>
                                    <div className="text-[#6b6b80]">Avaliação</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">+40%</div>
                                    <div className="text-[#6b6b80]">Agendamentos</div>
                                </div>
                            </div>
                        </div>

                        {/* Mock Dashboard */}
                        <div className="hidden lg:block relative">
                            <div className="rounded-2xl bg-[#12121a] border border-[#2a2a3a] p-6 shadow-2xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a]">
                                        <div className="text-[#6b6b80] text-sm">Hoje</div>
                                        <div className="text-2xl font-bold text-white">12</div>
                                        <div className="text-[#10b981] text-sm">agendamentos</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a]">
                                        <div className="text-[#6b6b80] text-sm">Receita</div>
                                        <div className="text-2xl font-bold text-white">R$ 860</div>
                                        <div className="text-[#10b981] text-sm">+15% ↑</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0f]">
                                            <div className="w-10 h-10 rounded-full bg-[#1a1a2e]" />
                                            <div className="flex-1">
                                                <div className="h-3 bg-[#1a1a2e] rounded w-24 mb-2" />
                                                <div className="h-2 bg-[#1a1a2e] rounded w-16" />
                                            </div>
                                            <div className="text-[#10b981] text-sm">10:00</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating devices */}
                            <div className="absolute -bottom-4 -left-8 p-4 rounded-xl bg-[#12121a] border border-[#2a2a3a] shadow-xl">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-5 h-5 text-[#e94560]" />
                                    <span className="text-white text-sm">App iOS & Android</span>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 p-4 rounded-xl bg-[#12121a] border border-[#2a2a3a] shadow-xl">
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-5 h-5 text-[#3b82f6]" />
                                    <span className="text-white text-sm">Dashboard Web</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Tudo que você precisa para <span className="gradient-text">crescer</span>
                        </h2>
                        <p className="text-[#a0a0b0] max-w-2xl mx-auto">
                            Ferramentas profissionais para gerenciar sua barbearia de forma eficiente
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a] card-hover">
                                <div className="w-12 h-12 rounded-xl bg-[#e94560]/10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-[#e94560]" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-[#6b6b80]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="planos" className="py-20 bg-[#12121a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Planos para todos os <span className="gradient-text">tamanhos</span>
                        </h2>
                        <p className="text-[#a0a0b0] max-w-2xl mx-auto">
                            Comece grátis e upgrade conforme seu negócio cresce
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className={`p-6 rounded-2xl border ${plan.highlighted
                                        ? 'bg-gradient-to-br from-[#e94560]/20 to-[#12121a] border-[#e94560]'
                                        : 'bg-[#0a0a0f] border-[#2a2a3a]'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="inline-block px-3 py-1 rounded-full bg-[#e94560] text-white text-xs font-medium mb-4">
                                        Mais popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                <p className="text-[#6b6b80] mb-4">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    {plan.period && <span className="text-[#6b6b80]">{plan.period}</span>}
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-2 text-[#a0a0b0]">
                                            <CheckCircle className="w-4 h-4 text-[#10b981]" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/cadastro-barbearia"
                                    className={`block text-center py-3 rounded-xl font-semibold transition-colors ${plan.highlighted
                                            ? 'btn-primary text-white'
                                            : 'bg-[#12121a] border border-[#2a2a3a] text-white hover:border-[#e94560]'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            O que nossos <span className="gradient-text">parceiros</span> dizem
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a]">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
                                    ))}
                                </div>
                                <p className="text-[#a0a0b0] mb-4">"{testimonial.content}"</p>
                                <div>
                                    <p className="font-medium text-white">{testimonial.name}</p>
                                    <p className="text-sm text-[#6b6b80]">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-[#e94560] to-[#ff6b6b]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Pronto para transformar sua barbearia?
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                        Cadastre-se agora e comece a receber agendamentos online hoje mesmo
                    </p>
                    <Link
                        href="/cadastro-barbearia"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#e94560] font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Começar agora - é grátis
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
