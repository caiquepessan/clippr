'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';

export default function ContatoPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        setSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
    };

    return (
        <div className="pt-16">
            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Entre em <span className="gradient-text">Contato</span>
                    </h1>
                    <p className="text-lg text-[#a0a0b0]">
                        Tem alguma dúvida ou sugestão? Fale com a gente!
                    </p>
                </div>
            </section>

            {/* Contact Form + Info */}
            <section className="py-20 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6 sm:p-8">
                            {success ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-[#10b981]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Mensagem enviada!</h3>
                                    <p className="text-[#6b6b80]">Responderemos em até 24 horas.</p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="mt-6 px-6 py-2 rounded-lg bg-[#e94560]/10 text-[#e94560] hover:bg-[#e94560]/20 transition-colors"
                                    >
                                        Enviar outra mensagem
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <h2 className="text-xl font-bold text-white mb-4">Envie sua mensagem</h2>

                                    <div>
                                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Nome</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Seu nome"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="seu@email.com"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Assunto</label>
                                        <select
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white focus:outline-none focus:border-[#e94560] transition-colors"
                                        >
                                            <option value="">Selecione um assunto</option>
                                            <option value="duvida">Dúvida geral</option>
                                            <option value="suporte">Suporte técnico</option>
                                            <option value="parceria">Parceria</option>
                                            <option value="imprensa">Imprensa</option>
                                            <option value="outro">Outro</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Mensagem</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Como podemos ajudar?"
                                            rows={4}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                Enviar mensagem
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6">Informações de Contato</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#e94560]/10 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-[#e94560]" />
                                        </div>
                                        <div>
                                            <p className="text-[#6b6b80] text-sm">Email</p>
                                            <p className="text-white">contato@clippr.com.br</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-[#10b981]" />
                                        </div>
                                        <div>
                                            <p className="text-[#6b6b80] text-sm">WhatsApp</p>
                                            <p className="text-white">(11) 99999-9999</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-[#3b82f6]" />
                                        </div>
                                        <div>
                                            <p className="text-[#6b6b80] text-sm">Endereço</p>
                                            <p className="text-white">São Paulo, SP - Brasil</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Horário de Atendimento</h3>
                                <div className="space-y-2 text-[#a0a0b0]">
                                    <div className="flex justify-between">
                                        <span>Segunda a Sexta</span>
                                        <span className="text-white">09:00 - 18:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sábado</span>
                                        <span className="text-white">09:00 - 13:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Domingo</span>
                                        <span className="text-[#6b6b80]">Fechado</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#e94560] to-[#ff6b6b] rounded-2xl p-6 text-center">
                                <h3 className="text-lg font-bold text-white mb-2">Precisa de ajuda rápida?</h3>
                                <p className="text-white/80 mb-4">Confira nossa central de ajuda</p>
                                <a
                                    href="#"
                                    className="inline-block px-6 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                                >
                                    Ver FAQ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
