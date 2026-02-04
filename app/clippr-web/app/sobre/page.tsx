import Link from 'next/link';
import { Scissors, Target, Heart, Users, ArrowRight } from 'lucide-react';

export default function SobrePage() {
    const team = [
        { name: 'Gabriel Costa', role: 'CEO & Fundador', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
        { name: 'Lucas Mendes', role: 'CTO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
        { name: 'Ana Silva', role: 'Head de Produto', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
    ];

    const values = [
        {
            icon: Target,
            title: 'Foco no Cliente',
            description: 'Cada decisão é tomada pensando na melhor experiência para nossos usuários e parceiros.',
        },
        {
            icon: Heart,
            title: 'Paixão pelo que fazemos',
            description: 'Amamos o mercado de barbearias e trabalhamos para revolucioná-lo.',
        },
        {
            icon: Users,
            title: 'Comunidade',
            description: 'Construímos juntos com donos de barbearia e barbeiros de todo o Brasil.',
        },
    ];

    return (
        <div className="pt-16">
            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center mx-auto mb-6">
                        <Scissors className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Sobre o <span className="gradient-text">Clippr</span>
                    </h1>

                    <p className="text-lg text-[#a0a0b0] max-w-2xl mx-auto">
                        Somos uma startup brasileira com a missão de conectar clientes às melhores barbearias
                        e ajudar donos de negócio a crescer com tecnologia.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Nossa Missão
                            </h2>
                            <p className="text-[#a0a0b0] text-lg mb-6">
                                Acreditamos que toda barbearia merece acesso a ferramentas profissionais de gestão,
                                independente do tamanho. E todo cliente merece encontrar facilmente o serviço perfeito
                                perto de casa.
                            </p>
                            <p className="text-[#a0a0b0] text-lg">
                                Por isso criamos o Clippr: uma plataforma que une os dois lados,
                                simplificando agendamentos, pagamentos e fidelização.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a] text-center">
                                <div className="text-3xl font-bold text-[#e94560]">1000+</div>
                                <div className="text-[#6b6b80]">Barbearias</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a] text-center">
                                <div className="text-3xl font-bold text-[#ffd700]">50k+</div>
                                <div className="text-[#6b6b80]">Clientes</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a] text-center">
                                <div className="text-3xl font-bold text-[#10b981]">100k+</div>
                                <div className="text-[#6b6b80]">Agendamentos</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a] text-center">
                                <div className="text-3xl font-bold text-[#3b82f6]">50+</div>
                                <div className="text-[#6b6b80]">Cidades</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-[#12121a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Nossos Valores
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((value, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-[#0a0a0f] border border-[#2a2a3a] text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#e94560]/10 flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-6 h-6 text-[#e94560]" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                                <p className="text-[#6b6b80]">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Nosso Time
                        </h2>
                        <p className="text-[#a0a0b0]">A equipe por trás do Clippr</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {team.map((member, i) => (
                            <div key={i} className="text-center">
                                <div className="w-32 h-32 rounded-full bg-[#12121a] mx-auto mb-4 overflow-hidden border-2 border-[#2a2a3a]">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                                <p className="text-[#6b6b80]">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Faça parte dessa história
                    </h2>
                    <p className="text-[#a0a0b0] text-lg mb-8">
                        Seja como cliente ou parceiro, venha crescer com a gente
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/explorar"
                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl btn-primary text-white font-semibold"
                        >
                            Encontrar barbearia
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/para-barbearias"
                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#12121a] border border-[#2a2a3a] text-white font-semibold hover:border-[#3a3a4a] transition-colors"
                        >
                            Cadastrar barbearia
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
