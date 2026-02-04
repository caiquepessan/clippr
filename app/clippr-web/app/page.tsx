import Link from 'next/link';
import { Search, MapPin, Star, Calendar, Trophy, Shield, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BarbershopCard } from '@/components/BarbershopCard';

export default async function HomePage() {
  const supabase = await createClient();

  // Buscar barbearias em destaque
  const { data: barbershops } = await supabase
    .from('barbershops')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(6);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />

        {/* Grid Pattern with CSS */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(233, 69, 96, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(233, 69, 96, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e94560] rounded-full blur-[150px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffd700] rounded-full blur-[150px] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121a] border border-[#2a2a3a] mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-[#a0a0b0]">+1000 barbearias cadastradas</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Encontre a <span className="gradient-text">barbearia perfeita</span> perto de você
            </h1>

            <p className="text-lg sm:text-xl text-[#a0a0b0] mb-10 max-w-2xl mx-auto">
              Descubra as melhores barbearias da sua região. Agende online, ganhe pontos de fidelidade e tenha a melhor experiência em cuidados masculinos.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                <input
                  type="text"
                  placeholder="Sua localização..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#12121a] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                />
              </div>
              <Link
                href="/explorar"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl btn-primary text-white font-semibold"
              >
                <Search className="w-5 h-5" />
                <span>Buscar</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">1000+</div>
                <div className="text-[#6b6b80]">Barbearias</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">50k+</div>
                <div className="text-[#6b6b80]">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">4.9</div>
                <div className="text-[#6b6b80]">Avaliação média</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Por que escolher o <span className="gradient-text">Clippr</span>?
            </h2>
            <p className="text-[#a0a0b0] max-w-2xl mx-auto">
              A plataforma mais completa para encontrar e agendar serviços de barbearia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a] card-hover">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Agendamento Fácil</h3>
              <p className="text-[#6b6b80]">Agende seu horário em poucos segundos, sem ligações ou espera</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a] card-hover">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#ffed4a] flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Avaliações Reais</h3>
              <p className="text-[#6b6b80]">Veja avaliações de clientes reais antes de escolher</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a] card-hover">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#34d399] flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Programa de Pontos</h3>
              <p className="text-[#6b6b80]">Acumule pontos a cada visita e troque por recompensas</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a3a] card-hover">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">100% Seguro</h3>
              <p className="text-[#6b6b80]">Pagamentos seguros e dados protegidos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Barbershops */}
      {barbershops && barbershops.length > 0 && (
        <section className="py-20 bg-[#12121a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Barbearias em Destaque
                </h2>
                <p className="text-[#a0a0b0]">
                  As mais bem avaliadas na plataforma
                </p>
              </div>
              <Link
                href="/explorar"
                className="hidden sm:flex items-center gap-2 text-[#e94560] hover:text-[#ff6b6b] transition-colors"
              >
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbershops.map((barbershop) => (
                <BarbershopCard key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/explorar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary text-white font-medium"
              >
                Ver todas as barbearias
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Tem uma barbearia?
          </h2>
          <p className="text-[#a0a0b0] text-lg mb-8">
            Cadastre-se gratuitamente e comece a receber agendamentos online hoje mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/para-barbearias"
              className="px-8 py-4 rounded-xl btn-primary text-white font-semibold"
            >
              Cadastrar minha barbearia
            </Link>
            <Link
              href="/sobre"
              className="px-8 py-4 rounded-xl bg-[#12121a] border border-[#2a2a3a] text-white font-semibold hover:border-[#3a3a4a] transition-colors"
            >
              Saiba mais
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
