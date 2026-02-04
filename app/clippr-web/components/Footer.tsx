import Link from 'next/link';
import { Scissors, Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#0a0a0f] border-t border-[#2a2a3a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Clippr</span>
                        </Link>
                        <p className="text-[#6b6b80] max-w-sm mb-6">
                            A plataforma que conecta você às melhores barbearias da sua região.
                            Agende online, ganhe pontos e tenha a melhor experiência.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-[#12121a] border border-[#2a2a3a] flex items-center justify-center text-[#6b6b80] hover:text-white hover:border-[#e94560] transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[#12121a] border border-[#2a2a3a] flex items-center justify-center text-[#6b6b80] hover:text-white hover:border-[#e94560] transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[#12121a] border border-[#2a2a3a] flex items-center justify-center text-[#6b6b80] hover:text-white hover:border-[#e94560] transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Navegação</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/explorar" className="text-[#6b6b80] hover:text-white transition-colors">
                                    Explorar Barbearias
                                </Link>
                            </li>
                            <li>
                                <Link href="/para-barbearias" className="text-[#6b6b80] hover:text-white transition-colors">
                                    Para Barbearias
                                </Link>
                            </li>
                            <li>
                                <Link href="/sobre" className="text-[#6b6b80] hover:text-white transition-colors">
                                    Sobre Nós
                                </Link>
                            </li>
                            <li>
                                <Link href="/contato" className="text-[#6b6b80] hover:text-white transition-colors">
                                    Contato
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contato</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-[#6b6b80]">
                                <Mail className="w-4 h-4" />
                                <span>contato@clippr.com.br</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#6b6b80]">
                                <Phone className="w-4 h-4" />
                                <span>(11) 99999-9999</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#2a2a3a] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#6b6b80] text-sm">
                        © {new Date().getFullYear()} Clippr. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/termos" className="text-[#6b6b80] hover:text-white transition-colors">
                            Termos de Uso
                        </Link>
                        <Link href="/privacidade" className="text-[#6b6b80] hover:text-white transition-colors">
                            Privacidade
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
