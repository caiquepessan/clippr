// =====================================================
// CLIPPR PLATFORM - Tipos TypeScript
// =====================================================

// ----- Usuário -----
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

// ----- Planos de Assinatura -----
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired';

export interface SubscriptionPlan {
    id: string;
    name: string;
    slug: string;
    description?: string;
    priceMonthly: number;
    priceYearly?: number;
    maxBarbers: number; // -1 = ilimitado
    maxServices: number; // -1 = ilimitado
    features: string[];
}

// ----- Barbearia -----
export interface OpeningHours {
    open: string | null;
    close: string | null;
    closed: boolean;
}

export interface Barbershop {
    id: string;
    ownerId?: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    coverUrl?: string;

    // Endereço
    address?: string;
    addressNumber?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;

    // Contato
    phone?: string;
    whatsapp?: string;
    email?: string;
    instagram?: string;

    // Horários
    openingHours: {
        monday: OpeningHours;
        tuesday: OpeningHours;
        wednesday: OpeningHours;
        thursday: OpeningHours;
        friday: OpeningHours;
        saturday: OpeningHours;
        sunday: OpeningHours;
    };

    // Assinatura
    subscriptionPlanId?: string;
    subscriptionStatus: SubscriptionStatus;
    trialEndsAt?: string;

    // Métricas
    rating: number;
    reviewCount: number;
    totalBookings: number;

    // Status
    isActive: boolean;
    isVerified: boolean;

    // Distância (calculada)
    distance?: number;
}

// ----- Barbeiro -----
export interface Barber {
    id: string;
    barbershopId?: string;
    userId?: string;
    name: string;
    avatar?: string;
    specialty?: string;
    rating: number;
    reviewCount: number;
    available: boolean;
    commissionRate?: number;
    isOwner?: boolean;
    phone?: string;
    email?: string;
    bio?: string;
}

// ----- Serviço -----
export type ServiceCategory = 'corte' | 'barba' | 'combo' | 'tratamento' | 'outros';

export interface Service {
    id: string;
    barbershopId?: string;
    name: string;
    description?: string;
    duration: number; // em minutos
    price: number;
    icon?: string;
    category: ServiceCategory;
}

// ----- Agendamento -----
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type PaymentMethod = 'cash' | 'pix' | 'credit_card' | 'debit_card' | null;

export interface Booking {
    id: string;
    userId: string;
    barbershopId?: string;
    barbershop?: Barbershop;
    service: Service;
    barber: Barber;
    date: string;
    time: string;
    status: BookingStatus;
    totalPrice: number;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    commissionAmount?: number;
    createdAt: string;
}

export interface BookingFormData {
    barbershopId?: string;
    serviceId: string;
    barberId: string;
    date: string;
    time: string;
}

// ----- Avaliação -----
export interface Review {
    id: string;
    userId: string;
    user?: User;
    barbershopId: string;
    barberId?: string;
    barber?: Barber;
    bookingId?: string;
    rating: number;
    comment?: string;
    reply?: string;
    repliedAt?: string;
    createdAt: string;
}

// ----- Fidelidade -----
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyPoints {
    id: string;
    userId: string;
    barbershopId: string;
    points: number;
    tier: LoyaltyTier;
    totalVisits: number;
    totalSpent: number;
    lastVisitAt?: string;
}

// ----- Favoritos -----
export interface Favorite {
    id: string;
    userId: string;
    barbershopId: string;
    barbershop?: Barbershop;
    createdAt: string;
}

// ----- Time Slots -----
export interface TimeSlot {
    time: string;
    available: boolean;
}
