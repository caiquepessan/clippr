import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking, Service, Barber, BookingFormData } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface BookingContextType {
    bookings: Booking[];
    currentBooking: BookingFormData | null;
    services: Service[];
    barbers: Barber[];
    isLoading: boolean;
    setCurrentBooking: (data: BookingFormData | null) => void;
    createBooking: (data: BookingFormData) => Promise<Booking>;
    cancelBooking: (bookingId: string) => Promise<boolean>;
    getUpcomingBookings: () => Booking[];
    getPastBookings: () => Booking[];
    refreshData: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [currentBooking, setCurrentBooking] = useState<BookingFormData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Carregar dados do Supabase
    const loadData = async () => {
        setIsLoading(true);
        try {
            // Carregar serviços
            const { data: servicesData, error: servicesError } = await supabase
                .from('services')
                .select('*')
                .eq('active', true)
                .order('category');

            if (servicesError) {
                console.error('Erro ao carregar serviços:', servicesError);
            } else if (servicesData) {
                setServices(servicesData.map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.description,
                    duration: s.duration,
                    price: parseFloat(s.price),
                    icon: s.icon,
                    category: s.category,
                })));
            }

            // Carregar barbeiros
            const { data: barbersData, error: barbersError } = await supabase
                .from('barbers')
                .select('*')
                .order('name');

            if (barbersError) {
                console.error('Erro ao carregar barbeiros:', barbersError);
            } else if (barbersData) {
                setBarbers(barbersData.map(b => ({
                    id: b.id,
                    name: b.name,
                    avatar: b.avatar_url,
                    specialty: b.specialty,
                    rating: parseFloat(b.rating),
                    reviewCount: b.review_count,
                    available: b.available,
                })));
            }

            // Carregar agendamentos do usuário
            if (user) {
                const { data: bookingsData, error: bookingsError } = await supabase
                    .from('bookings')
                    .select(`
            *,
            service:services(*),
            barber:barbers(*)
          `)
                    .eq('user_id', user.id)
                    .order('date', { ascending: false });

                if (bookingsError) {
                    console.error('Erro ao carregar agendamentos:', bookingsError);
                } else if (bookingsData) {
                    setBookings(bookingsData.map(b => ({
                        id: b.id,
                        userId: b.user_id,
                        service: {
                            id: b.service.id,
                            name: b.service.name,
                            description: b.service.description,
                            duration: b.service.duration,
                            price: parseFloat(b.service.price),
                            icon: b.service.icon,
                            category: b.service.category,
                        },
                        barber: {
                            id: b.barber.id,
                            name: b.barber.name,
                            avatar: b.barber.avatar_url,
                            specialty: b.barber.specialty,
                            rating: parseFloat(b.barber.rating),
                            reviewCount: b.barber.review_count,
                            available: b.barber.available,
                        },
                        date: b.date,
                        time: b.time.slice(0, 5), // Remove seconds
                        status: b.status,
                        totalPrice: parseFloat(b.total_price),
                        createdAt: b.created_at,
                    })));
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const refreshData = async () => {
        await loadData();
    };

    const createBooking = async (data: BookingFormData): Promise<Booking> => {
        const service = services.find(s => s.id === data.serviceId)!;
        const barber = barbers.find(b => b.id === data.barberId)!;

        const { data: newBooking, error } = await supabase
            .from('bookings')
            .insert({
                user_id: user!.id,
                service_id: data.serviceId,
                barber_id: data.barberId,
                date: data.date,
                time: data.time,
                status: 'confirmed',
                total_price: service.price,
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar agendamento:', error);
            throw error;
        }

        const booking: Booking = {
            id: newBooking.id,
            userId: user!.id,
            service,
            barber,
            date: data.date,
            time: data.time,
            status: 'confirmed',
            totalPrice: service.price,
            createdAt: newBooking.created_at,
        };

        setBookings(prev => [booking, ...prev]);
        setCurrentBooking(null);
        return booking;
    };

    const cancelBooking = async (bookingId: string): Promise<boolean> => {
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);

        if (error) {
            console.error('Erro ao cancelar agendamento:', error);
            return false;
        }

        setBookings(prev =>
            prev.map(b =>
                b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
            )
        );
        return true;
    };

    const getUpcomingBookings = (): Booking[] => {
        const today = new Date().toISOString().split('T')[0];
        return bookings.filter(
            b => b.date >= today && b.status !== 'cancelled' && b.status !== 'completed'
        );
    };

    const getPastBookings = (): Booking[] => {
        const today = new Date().toISOString().split('T')[0];
        return bookings.filter(
            b => b.date < today || b.status === 'completed' || b.status === 'cancelled'
        );
    };

    return (
        <BookingContext.Provider
            value={{
                bookings,
                currentBooking,
                services,
                barbers,
                isLoading,
                setCurrentBooking,
                createBooking,
                cancelBooking,
                getUpcomingBookings,
                getPastBookings,
                refreshData,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking deve ser usado dentro de BookingProvider');
    }
    return context;
}
