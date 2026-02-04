import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Clock, Phone, Instagram, MessageCircle, CheckCircle, ArrowLeft, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

interface BarbershopPageProps {
    params: Promise<{ slug: string }>;
}

const DAY_NAMES: Record<string, string> = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
};

export default async function BarbershopPage({ params }: BarbershopPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // Buscar barbearia
    const { data: barbershop, error } = await supabase
        .from('barbershops')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !barbershop) {
        notFound();
    }

    // Buscar serviços
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('barbershop_id', barbershop.id)
        .eq('active', true)
        .order('price');

    // Buscar barbeiros
    const { data: barbers } = await supabase
        .from('barbers')
        .select('*')
        .eq('barbershop_id', barbershop.id)
        .eq('available', true);

    // Buscar reviews
    const { data: reviews } = await supabase
        .from('reviews')
        .select(`
      *,
      profiles:user_id (name, avatar_url)
    `)
        .eq('barbershop_id', barbershop.id)
        .order('created_at', { ascending: false })
        .limit(5);

    const openingHours = barbershop.opening_hours || {};

    return (
        <div className="pt-16 pb-24">
            {/* Cover */}
            <div className="relative h-72 sm:h-96">
                <Image
                    src={barbershop.cover_url || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&h=600&fit=crop'}
                    alt={barbershop.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />

                {/* Back Button */}
                <Link
                    href="/explorar"
                    className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-xl glass text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                            <div className="flex items-start gap-4 sm:gap-6">
                                {/* Logo */}
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0a0a0f] border-2 border-[#2a2a3a] overflow-hidden flex-shrink-0">
                                    <Image
                                        src={barbershop.logo_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop'}
                                        alt={barbershop.name}
                                        width={96}
                                        height={96}
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{barbershop.name}</h1>
                                        {barbershop.is_verified && (
                                            <CheckCircle className="w-5 h-5 text-[#ffd700] flex-shrink-0" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-5 h-5 text-[#ffd700] fill-[#ffd700]" />
                                            <span className="font-semibold text-white">{barbershop.rating?.toFixed(1) || '5.0'}</span>
                                        </div>
                                        <span className="text-[#6b6b80]">({barbershop.review_count || 0} avaliações)</span>
                                    </div>

                                    <p className="text-[#a0a0b0] line-clamp-2 mb-4">
                                        {barbershop.description || 'A melhor experiência em cuidados masculinos'}
                                    </p>

                                    <div className="flex items-center gap-2 text-[#6b6b80]">
                                        <MapPin className="w-4 h-4" />
                                        <span>
                                            {barbershop.address}{barbershop.address_number ? `, ${barbershop.address_number}` : ''} - {barbershop.neighborhood}, {barbershop.city}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Buttons */}
                            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[#2a2a3a]">
                                {barbershop.whatsapp && (
                                    <a
                                        href={`https://wa.me/${barbershop.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp
                                    </a>
                                )}
                                {barbershop.phone && (
                                    <a
                                        href={`tel:${barbershop.phone}`}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#3b82f6]/20 transition-colors"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Ligar
                                    </a>
                                )}
                                {barbershop.instagram && (
                                    <a
                                        href={`https://instagram.com/${barbershop.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E1306C]/10 border border-[#E1306C]/30 text-[#E1306C] hover:bg-[#E1306C]/20 transition-colors"
                                    >
                                        <Instagram className="w-4 h-4" />
                                        Instagram
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Services */}
                        {services && services.length > 0 && (
                            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4">Serviços</h2>
                                <div className="space-y-3">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white">{service.name}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm text-[#6b6b80]">{service.duration} min</span>
                                                    {service.description && (
                                                        <span className="text-sm text-[#6b6b80]">{service.description}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-[#e94560]">
                                                    R$ {parseFloat(service.price).toFixed(2).replace('.', ',')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Barbers */}
                        {barbers && barbers.length > 0 && (
                            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4">Profissionais</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {barbers.map((barber) => (
                                        <div
                                            key={barber.id}
                                            className="text-center p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a]"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-[#1a1a2e] mx-auto mb-3 overflow-hidden">
                                                <Image
                                                    src={barber.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'}
                                                    alt={barber.name}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h3 className="font-medium text-white mb-1">{barber.name}</h3>
                                            {barber.specialty && (
                                                <p className="text-sm text-[#6b6b80]">{barber.specialty}</p>
                                            )}
                                            <div className="flex items-center justify-center gap-1 mt-2">
                                                <Star className="w-3 h-3 text-[#ffd700] fill-[#ffd700]" />
                                                <span className="text-sm text-[#a0a0b0]">{parseFloat(barber.rating).toFixed(1)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {reviews && reviews.length > 0 && (
                            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4">Avaliações</h2>
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a]"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-[#1a1a2e] overflow-hidden">
                                                    <Image
                                                        src={(review.profiles as unknown as { avatar_url?: string })?.avatar_url || 'https://via.placeholder.com/100'}
                                                        alt="User"
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{(review.profiles as unknown as { name?: string })?.name || 'Anônimo'}</p>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3 h-3 ${i < review.rating ? 'text-[#ffd700] fill-[#ffd700]' : 'text-[#2a2a3a]'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="text-[#a0a0b0]">{review.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* CTA */}
                            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Agendar Horário</h3>
                                <p className="text-[#6b6b80] mb-4">
                                    Faça login para agendar um horário nesta barbearia
                                </p>
                                <Link
                                    href={`/login?redirect=/barbearia/${slug}/agendar`}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl btn-primary text-white font-semibold"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Agendar agora
                                </Link>
                            </div>

                            {/* Hours */}
                            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-5 h-5 text-[#e94560]" />
                                    <h3 className="text-lg font-bold text-white">Horários</h3>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(openingHours).map(([day, hours]) => {
                                        const h = hours as { open?: string; close?: string; closed?: boolean };
                                        return (
                                            <div key={day} className="flex justify-between py-2 border-b border-[#2a2a3a] last:border-0">
                                                <span className="text-[#a0a0b0]">{DAY_NAMES[day]}</span>
                                                <span className={h.closed ? 'text-[#6b6b80]' : 'text-white font-medium'}>
                                                    {h.closed ? 'Fechado' : `${h.open} - ${h.close}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Map */}
                            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-[#e94560]" />
                                    <h3 className="text-lg font-bold text-white">Localização</h3>
                                </div>
                                <p className="text-[#a0a0b0] mb-4">
                                    {barbershop.address}{barbershop.address_number ? `, ${barbershop.address_number}` : ''}<br />
                                    {barbershop.neighborhood} - {barbershop.city}/{barbershop.state}<br />
                                    {barbershop.zip_code && `CEP: ${barbershop.zip_code}`}
                                </p>
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(`${barbershop.address}, ${barbershop.city}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#e94560] hover:underline"
                                >
                                    Ver no mapa →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
