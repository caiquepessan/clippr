import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Barbershop } from '@/types';
import { supabase } from '@/lib/supabase';

interface BarbershopContextType {
    barbershops: Barbershop[];
    currentBarbershop: Barbershop | null;
    favorites: string[];
    isLoading: boolean;
    searchBarbershops: (query?: string, city?: string) => Promise<void>;
    getBarbershopBySlug: (slug: string) => Promise<Barbershop | null>;
    setCurrentBarbershop: (barbershop: Barbershop | null) => void;
    toggleFavorite: (barbershopId: string) => Promise<void>;
    isFavorite: (barbershopId: string) => boolean;
}

const BarbershopContext = createContext<BarbershopContextType | undefined>(undefined);

export function BarbershopProvider({ children }: { children: ReactNode }) {
    const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
    const [currentBarbershop, setCurrentBarbershop] = useState<Barbershop | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Carregar barbearias
    const searchBarbershops = async (query?: string, city?: string) => {
        setIsLoading(true);
        try {
            let queryBuilder = supabase
                .from('barbershops')
                .select('*')
                .eq('is_active', true)
                .order('rating', { ascending: false });

            if (query) {
                queryBuilder = queryBuilder.ilike('name', `%${query}%`);
            }

            if (city) {
                queryBuilder = queryBuilder.ilike('city', `%${city}%`);
            }

            const { data, error } = await queryBuilder;

            if (error) {
                console.error('Erro ao buscar barbearias:', error);
                return;
            }

            if (data) {
                setBarbershops(data.map(mapBarbershop));
            }
        } catch (error) {
            console.error('Erro ao buscar barbearias:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Buscar barbearia por slug
    const getBarbershopBySlug = async (slug: string): Promise<Barbershop | null> => {
        try {
            const { data, error } = await supabase
                .from('barbershops')
                .select('*')
                .eq('slug', slug)
                .eq('is_active', true)
                .single();

            if (error) {
                console.error('Erro ao buscar barbearia:', error);
                return null;
            }

            return data ? mapBarbershop(data) : null;
        } catch (error) {
            console.error('Erro ao buscar barbearia:', error);
            return null;
        }
    };

    // Carregar favoritos do usuário
    const loadFavorites = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('favorites')
            .select('barbershop_id')
            .eq('user_id', user.id);

        if (!error && data) {
            setFavorites(data.map(f => f.barbershop_id));
        }
    };

    // Toggle favorito
    const toggleFavorite = async (barbershopId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const isFav = favorites.includes(barbershopId);

        if (isFav) {
            await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('barbershop_id', barbershopId);
            setFavorites(prev => prev.filter(id => id !== barbershopId));
        } else {
            await supabase
                .from('favorites')
                .insert({ user_id: user.id, barbershop_id: barbershopId });
            setFavorites(prev => [...prev, barbershopId]);
        }
    };

    const isFavorite = (barbershopId: string) => favorites.includes(barbershopId);

    // Carregar dados iniciais
    useEffect(() => {
        searchBarbershops();
        loadFavorites();
    }, []);

    return (
        <BarbershopContext.Provider
            value={{
                barbershops,
                currentBarbershop,
                favorites,
                isLoading,
                searchBarbershops,
                getBarbershopBySlug,
                setCurrentBarbershop,
                toggleFavorite,
                isFavorite,
            }}
        >
            {children}
        </BarbershopContext.Provider>
    );
}

// Helper para mapear dados do Supabase para o tipo Barbershop
function mapBarbershop(data: any): Barbershop {
    return {
        id: data.id,
        ownerId: data.owner_id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        logoUrl: data.logo_url,
        coverUrl: data.cover_url,
        address: data.address,
        addressNumber: data.address_number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        instagram: data.instagram,
        openingHours: data.opening_hours,
        subscriptionPlanId: data.subscription_plan_id,
        subscriptionStatus: data.subscription_status,
        trialEndsAt: data.trial_ends_at,
        rating: parseFloat(data.rating) || 0,
        reviewCount: data.review_count || 0,
        totalBookings: data.total_bookings || 0,
        isActive: data.is_active,
        isVerified: data.is_verified,
    };
}

export function useBarbershop() {
    const context = useContext(BarbershopContext);
    if (context === undefined) {
        throw new Error('useBarbershop deve ser usado dentro de BarbershopProvider');
    }
    return context;
}
