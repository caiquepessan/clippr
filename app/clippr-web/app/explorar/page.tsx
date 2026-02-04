import { Suspense } from 'react';
import { Search, MapPin, SlidersHorizontal, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BarbershopCard } from '@/components/BarbershopCard';

interface SearchParams {
    q?: string;
    cidade?: string;
}

async function BarbershopList({ searchParams }: { searchParams: SearchParams }) {
    const supabase = await createClient();

    let query = supabase
        .from('barbershops')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

    // Filtros
    if (searchParams.q) {
        query = query.ilike('name', `%${searchParams.q}%`);
    }
    if (searchParams.cidade) {
        query = query.ilike('city', `%${searchParams.cidade}%`);
    }

    const { data: barbershops, error } = await query;

    if (error) {
        console.error('Erro ao buscar barbearias:', error);
        return (
            <div className="text-center py-12">
                <p className="text-[#6b6b80]">Erro ao carregar barbearias</p>
            </div>
        );
    }

    if (!barbershops || barbershops.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#12121a] flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-[#6b6b80]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma barbearia encontrada</h3>
                <p className="text-[#6b6b80]">Tente buscar com outros termos ou em outra cidade</p>
            </div>
        );
    }

    return (
        <>
            <p className="text-[#6b6b80] mb-6">
                {barbershops.length} {barbershops.length === 1 ? 'barbearia encontrada' : 'barbearias encontradas'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {barbershops.map((barbershop) => (
                    <BarbershopCard key={barbershop.id} barbershop={barbershop} />
                ))}
            </div>
        </>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-[#12121a] border border-[#2a2a3a] overflow-hidden animate-pulse-slow">
                    <div className="h-48 bg-[#1a1a2e]" />
                    <div className="p-4 pt-12 space-y-3">
                        <div className="h-6 bg-[#1a1a2e] rounded w-3/4" />
                        <div className="h-4 bg-[#1a1a2e] rounded w-full" />
                        <div className="h-4 bg-[#1a1a2e] rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default async function ExplorarPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;

    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'];

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        Explorar Barbearias
                    </h1>
                    <p className="text-[#a0a0b0]">
                        Encontre a barbearia perfeita perto de você
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-4 sm:p-6 mb-8">
                    <form className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                            <input
                                type="text"
                                name="q"
                                defaultValue={params.q || ''}
                                placeholder="Buscar barbearias..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#e94560] transition-colors"
                            />
                        </div>

                        {/* Location */}
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
                            <select
                                name="cidade"
                                defaultValue={params.cidade || ''}
                                className="pl-12 pr-8 py-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] text-white focus:outline-none focus:border-[#e94560] transition-colors appearance-none cursor-pointer min-w-[180px]"
                            >
                                <option value="">Todas as cidades</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl btn-primary text-white font-medium"
                        >
                            <Search className="w-5 h-5" />
                            Buscar
                        </button>
                    </form>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#a0a0b0] hover:border-[#e94560] transition-colors">
                            <Star className="w-3 h-3" />
                            Mais avaliados
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0a0a0f] border border-[#2a2a3a] text-sm text-[#a0a0b0] hover:border-[#e94560] transition-colors">
                            <SlidersHorizontal className="w-3 h-3" />
                            Filtros
                        </button>
                    </div>
                </div>

                {/* Results */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <BarbershopList searchParams={params} />
                </Suspense>
            </div>
        </div>
    );
}
