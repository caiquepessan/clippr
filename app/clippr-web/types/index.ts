// =====================================================
// CLIPPR WEB - Tipos TypeScript
// =====================================================

// ----- Barbearia -----
export interface OpeningHours {
    open: string | null;
    close: string | null;
    closed: boolean;
}

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired';

export interface Barbershop {
    id: string;
    owner_id?: string;
    name: string;
    slug: string;
    description?: string;
    logo_url?: string;
    cover_url?: string;
    address?: string;
    address_number?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zip_code?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    whatsapp?: string;
    email?: string;
    instagram?: string;
    opening_hours: {
        monday: OpeningHours;
        tuesday: OpeningHours;
        wednesday: OpeningHours;
        thursday: OpeningHours;
        friday: OpeningHours;
        saturday: OpeningHours;
        sunday: OpeningHours;
    };
    subscription_status: SubscriptionStatus;
    rating: number;
    review_count: number;
    is_active: boolean;
    is_verified: boolean;
}

// ----- Barbeiro -----
export interface Barber {
    id: string;
    barbershop_id?: string;
    name: string;
    avatar_url?: string;
    specialty?: string;
    rating: number;
    review_count: number;
    available: boolean;
}

// ----- Serviço -----
export type ServiceCategory = 'corte' | 'barba' | 'combo' | 'tratamento' | 'outros';

export interface Service {
    id: string;
    barbershop_id?: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    icon?: string;
    category: ServiceCategory;
}

// ----- Review -----
export interface Review {
    id: string;
    user_id: string;
    barbershop_id: string;
    barber_id?: string;
    rating: number;
    comment?: string;
    created_at: string;
    profiles?: {
        name: string;
        avatar_url?: string;
    };
}
