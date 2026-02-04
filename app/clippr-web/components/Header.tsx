'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Scissors, Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setIsDropdownOpen(false);
        router.push('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center">
                            <Scissors className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Clippr</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/explorar"
                            className={`transition-colors ${pathname === '/explorar' ? 'text-white' : 'text-[#a0a0b0] hover:text-white'}`}
                        >
                            Explorar
                        </Link>
                        <Link
                            href="/para-barbearias"
                            className={`transition-colors ${pathname === '/para-barbearias' ? 'text-white' : 'text-[#a0a0b0] hover:text-white'}`}
                        >
                            Para Barbearias
                        </Link>
                        <Link
                            href="/sobre"
                            className={`transition-colors ${pathname === '/sobre' ? 'text-white' : 'text-[#a0a0b0] hover:text-white'}`}
                        >
                            Sobre
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/explorar"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12121a] border border-[#2a2a3a] text-[#a0a0b0] hover:text-white hover:border-[#3a3a4a] transition-all"
                        >
                            <Search className="w-4 h-4" />
                            <span>Buscar</span>
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12121a] border border-[#2a2a3a] text-white hover:border-[#3a3a4a] transition-all"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center text-xs font-bold">
                                        {user.user_metadata?.name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="max-w-[100px] truncate">
                                        {user.user_metadata?.name?.split(' ')[0] || 'Usuário'}
                                    </span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#12121a] border border-[#2a2a3a] shadow-lg py-2">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-[#a0a0b0] hover:text-white hover:bg-[#1a1a2e] transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/dashboard/configuracoes"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-[#a0a0b0] hover:text-white hover:bg-[#1a1a2e] transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            Minha Conta
                                        </Link>
                                        <hr className="my-2 border-[#2a2a3a]" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 text-[#e94560] hover:bg-[#1a1a2e] transition-colors w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-white font-medium"
                            >
                                <User className="w-4 h-4" />
                                <span>Entrar</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#12121a] border-t border-[#2a2a3a]">
                    <div className="px-4 py-4 space-y-4">
                        <Link
                            href="/explorar"
                            className="block py-2 text-[#a0a0b0] hover:text-white"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Explorar
                        </Link>
                        <Link
                            href="/para-barbearias"
                            className="block py-2 text-[#a0a0b0] hover:text-white"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Para Barbearias
                        </Link>
                        <Link
                            href="/sobre"
                            className="block py-2 text-[#a0a0b0] hover:text-white"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sobre
                        </Link>
                        <hr className="border-[#2a2a3a]" />
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block py-2 text-[#a0a0b0] hover:text-white"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block py-2 text-[#e94560]"
                                >
                                    Sair
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block py-2 text-center btn-primary rounded-xl text-white font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
