import Link from 'next/link';
import { redirect } from 'next/navigation';
import { User, Calendar, Star, Trophy, Settings, LogOut, MapPin, Clock, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Buscar dados do usuário
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Buscar agendamentos do usuário
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
      *,
      barbershops (name, logo_url, slug),
      services (name, price),
      barbers (name)
    `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

    // Buscar pontos de fidelidade
    const { data: loyaltyPoints } = await supabase
        .from('loyalty_points')
        .select('points, barbershops (name)')
        .eq('user_id', user.id);

    const totalPoints = loyaltyPoints?.reduce((acc, lp) => acc + (lp.points || 0), 0) || 0;
    const upcomingBookings = bookings?.filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled') || [];
    const pastBookings = bookings?.filter(b => new Date(b.date) < new Date() || b.status === 'completed') || [];

    return (
        <div className="pt-20 pb-16 min-h-screen bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Olá, {profile?.name || user.user_metadata?.name || 'Usuário'}! 👋
                        </h1>
                        <p className="text-[#6b6b80] mt-1">
                            Bem-vindo de volta ao Clippr
                        </p>
                    </div>
                    <Link
                        href="/explorar"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl btn-primary text-white font-medium"
                    >
                        Agendar horário
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#e94560]/10 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-[#e94560]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{upcomingBookings.length}</p>
                                <p className="text-[#6b6b80] text-sm">Próximos</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-[#10b981]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalPoints}</p>
                                <p className="text-[#6b6b80] text-sm">Pontos</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center">
                                <Star className="w-6 h-6 text-[#ffd700]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{pastBookings.length}</p>
                                <p className="text-[#6b6b80] text-sm">Visitas</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-[#3b82f6]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white truncate max-w-[120px]">{user.email}</p>
                                <p className="text-[#6b6b80] text-sm">Membro</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Bookings */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upcoming Bookings */}
                        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">Próximos Agendamentos</h2>
                                <Link href="/dashboard/agendamentos" className="text-[#e94560] text-sm hover:underline">
                                    Ver todos
                                </Link>
                            </div>

                            {upcomingBookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="w-12 h-12 text-[#2a2a3a] mx-auto mb-3" />
                                    <p className="text-[#6b6b80]">Nenhum agendamento próximo</p>
                                    <Link
                                        href="/explorar"
                                        className="inline-block mt-4 px-4 py-2 rounded-lg bg-[#e94560]/10 text-[#e94560] text-sm"
                                    >
                                        Agendar agora
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center">
                                                        <Calendar className="w-5 h-5 text-[#e94560]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">
                                                            {(booking.services as { name: string })?.name || 'Serviço'}
                                                        </p>
                                                        <p className="text-sm text-[#6b6b80]">
                                                            {(booking.barbershops as { name: string })?.name || 'Barbearia'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-medium">
                                                        {new Date(booking.date).toLocaleDateString('pt-BR')}
                                                    </p>
                                                    <p className="text-sm text-[#6b6b80]">{booking.start_time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Histórico Recente</h2>

                            {pastBookings.length === 0 ? (
                                <p className="text-[#6b6b80] text-center py-4">Nenhuma visita ainda</p>
                            ) : (
                                <div className="space-y-3">
                                    {pastBookings.slice(0, 3).map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between py-3 border-b border-[#2a2a3a] last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-[#6b6b80]" />
                                                <span className="text-[#a0a0b0]">
                                                    {(booking.services as { name: string })?.name} - {(booking.barbershops as { name: string })?.name}
                                                </span>
                                            </div>
                                            <span className="text-[#6b6b80] text-sm">
                                                {new Date(booking.date).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
                            <div className="space-y-2">
                                <Link
                                    href="/explorar"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a2e] transition-colors"
                                >
                                    <MapPin className="w-5 h-5 text-[#e94560]" />
                                    <span className="text-white">Explorar barbearias</span>
                                </Link>
                                <Link
                                    href="/dashboard/favoritos"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a2e] transition-colors"
                                >
                                    <Star className="w-5 h-5 text-[#ffd700]" />
                                    <span className="text-white">Meus favoritos</span>
                                </Link>
                                <Link
                                    href="/dashboard/pontos"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a2e] transition-colors"
                                >
                                    <Trophy className="w-5 h-5 text-[#10b981]" />
                                    <span className="text-white">Meus pontos</span>
                                </Link>
                                <Link
                                    href="/dashboard/configuracoes"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a2e] transition-colors"
                                >
                                    <Settings className="w-5 h-5 text-[#6b6b80]" />
                                    <span className="text-white">Configurações</span>
                                </Link>
                            </div>
                        </div>

                        {/* Loyalty Card */}
                        <div className="bg-gradient-to-br from-[#e94560] to-[#ff6b6b] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Trophy className="w-8 h-8 text-white" />
                                <div>
                                    <h3 className="text-white font-bold">Programa de Pontos</h3>
                                    <p className="text-white/70 text-sm">Clippr Rewards</p>
                                </div>
                            </div>
                            <div className="text-4xl font-bold text-white mb-2">{totalPoints}</div>
                            <p className="text-white/70 text-sm">pontos acumulados</p>
                            <Link
                                href="/dashboard/pontos"
                                className="inline-block mt-4 px-4 py-2 rounded-lg bg-white/20 text-white text-sm hover:bg-white/30 transition-colors"
                            >
                                Ver recompensas
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
