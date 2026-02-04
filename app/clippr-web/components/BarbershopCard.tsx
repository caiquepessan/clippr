import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Barbershop } from '@/types';

interface BarbershopCardProps {
    barbershop: Barbershop;
}

export function BarbershopCard({ barbershop }: BarbershopCardProps) {
    return (
        <Link
            href={`/barbearia/${barbershop.slug}`}
            className="block rounded-2xl bg-[#0a0a0f] border border-[#2a2a3a] overflow-hidden card-hover"
        >
            {/* Cover */}
            <div className="relative h-48">
                <Image
                    src={barbershop.cover_url || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=400&fit=crop'}
                    alt={barbershop.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />

                {/* Verified Badge */}
                {barbershop.is_verified && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#ffd700] text-black text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Verificado
                    </div>
                )}

                {/* Logo */}
                <div className="absolute -bottom-8 left-4">
                    <div className="w-16 h-16 rounded-xl bg-[#12121a] border-2 border-[#2a2a3a] overflow-hidden">
                        <Image
                            src={barbershop.logo_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop'}
                            alt={barbershop.name}
                            width={64}
                            height={64}
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 pt-12">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{barbershop.name}</h3>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#ffd700]/10">
                        <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
                        <span className="text-sm font-medium text-[#ffd700]">{barbershop.rating?.toFixed(1) || '5.0'}</span>
                    </div>
                </div>

                <p className="text-[#6b6b80] text-sm mb-3 line-clamp-2">
                    {barbershop.description || 'A melhor experiência em cuidados masculinos'}
                </p>

                <div className="flex items-center gap-2 text-[#6b6b80] text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{barbershop.neighborhood}, {barbershop.city}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-[#2a2a3a] flex items-center justify-between">
                    <span className="text-[#6b6b80] text-sm">
                        {barbershop.review_count || 0} avaliações
                    </span>
                    <span className="text-[#e94560] text-sm font-medium">
                        Ver mais →
                    </span>
                </div>
            </div>
        </Link>
    );
}
