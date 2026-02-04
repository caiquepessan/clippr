import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useBarbershop } from '@/contexts/BarbershopContext';
import { useBooking } from '@/contexts/BookingContext';
import { ServiceCard } from '@/components/ServiceCard';
import { BarberCard } from '@/components/BarberCard';
import { Barbershop, Service, Barber } from '@/types';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

const DAY_NAMES: Record<string, string> = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
};

export default function BarbershopDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { getBarbershopBySlug, toggleFavorite, isFavorite, setCurrentBarbershop } = useBarbershop();

    const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'services' | 'barbers' | 'info'>('services');

    useEffect(() => {
        loadBarbershop();
    }, [slug]);

    const loadBarbershop = async () => {
        if (!slug) return;

        setIsLoading(true);
        try {
            const shop = await getBarbershopBySlug(slug);
            if (shop) {
                setBarbershop(shop);
                setCurrentBarbershop(shop);

                // Carregar serviços
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('*')
                    .eq('barbershop_id', shop.id)
                    .eq('active', true);

                if (servicesData) {
                    setServices(servicesData.map(s => ({
                        id: s.id,
                        barbershopId: s.barbershop_id,
                        name: s.name,
                        description: s.description,
                        duration: s.duration,
                        price: parseFloat(s.price),
                        icon: s.icon,
                        category: s.category,
                    })));
                }

                // Carregar barbeiros
                const { data: barbersData } = await supabase
                    .from('barbers')
                    .select('*')
                    .eq('barbershop_id', shop.id)
                    .eq('available', true);

                if (barbersData) {
                    setBarbers(barbersData.map(b => ({
                        id: b.id,
                        barbershopId: b.barbershop_id,
                        name: b.name,
                        avatar: b.avatar_url,
                        specialty: b.specialty,
                        rating: parseFloat(b.rating),
                        reviewCount: b.review_count,
                        available: b.available,
                        commissionRate: b.commission_rate,
                        isOwner: b.is_owner,
                    })));
                }
            }
        } catch (error) {
            console.error('Erro ao carregar barbearia:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWhatsApp = () => {
        if (barbershop?.whatsapp) {
            Linking.openURL(`https://wa.me/${barbershop.whatsapp}`);
        }
    };

    const handleCall = () => {
        if (barbershop?.phone) {
            Linking.openURL(`tel:${barbershop.phone}`);
        }
    };

    const handleInstagram = () => {
        if (barbershop?.instagram) {
            Linking.openURL(`https://instagram.com/${barbershop.instagram.replace('@', '')}`);
        }
    };

    const handleServicePress = (serviceId: string) => {
        router.push(`/booking/${serviceId}` as any);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.secondary} />
            </View>
        );
    }

    if (!barbershop) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color={Colors.textMuted} />
                <Text style={styles.errorText}>Barbearia não encontrada</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cover */}
                <View style={styles.coverContainer}>
                    <Image
                        source={{ uri: barbershop.coverUrl || 'https://via.placeholder.com/800x400' }}
                        style={styles.cover}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'transparent', Colors.background]}
                        style={styles.coverGradient}
                    />

                    {/* Back Button */}
                    <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* Favorite Button */}
                    <TouchableOpacity
                        style={styles.headerFavoriteButton}
                        onPress={() => toggleFavorite(barbershop.id)}
                    >
                        <Ionicons
                            name={isFavorite(barbershop.id) ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isFavorite(barbershop.id) ? Colors.secondary : '#fff'}
                        />
                    </TouchableOpacity>

                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={{ uri: barbershop.logoUrl || 'https://via.placeholder.com/100' }}
                            style={styles.logo}
                        />
                    </View>
                </View>

                {/* Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{barbershop.name}</Text>
                        {barbershop.isVerified && (
                            <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />
                        )}
                    </View>

                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color={Colors.accent} />
                        <Text style={styles.rating}>{barbershop.rating.toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>({barbershop.reviewCount} avaliações)</Text>
                    </View>

                    <Text style={styles.description}>{barbershop.description}</Text>

                    {/* Contact Buttons */}
                    <View style={styles.contactButtons}>
                        {barbershop.whatsapp && (
                            <TouchableOpacity style={styles.contactButton} onPress={handleWhatsApp}>
                                <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
                                <Text style={styles.contactButtonText}>WhatsApp</Text>
                            </TouchableOpacity>
                        )}
                        {barbershop.phone && (
                            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                                <Ionicons name="call-outline" size={22} color={Colors.secondary} />
                                <Text style={styles.contactButtonText}>Ligar</Text>
                            </TouchableOpacity>
                        )}
                        {barbershop.instagram && (
                            <TouchableOpacity style={styles.contactButton} onPress={handleInstagram}>
                                <Ionicons name="logo-instagram" size={22} color="#E1306C" />
                                <Text style={styles.contactButtonText}>Instagram</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'services' && styles.tabActive]}
                        onPress={() => setActiveTab('services')}
                    >
                        <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>
                            Serviços ({services.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'barbers' && styles.tabActive]}
                        onPress={() => setActiveTab('barbers')}
                    >
                        <Text style={[styles.tabText, activeTab === 'barbers' && styles.tabTextActive]}>
                            Profissionais ({barbers.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'info' && styles.tabActive]}
                        onPress={() => setActiveTab('info')}
                    >
                        <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
                            Info
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <View style={styles.tabContent}>
                    {activeTab === 'services' && (
                        services.length > 0 ? (
                            services.map(service => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    onPress={() => handleServicePress(service.id)}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Nenhum serviço disponível</Text>
                        )
                    )}

                    {activeTab === 'barbers' && (
                        barbers.length > 0 ? (
                            barbers.map(barber => (
                                <BarberCard
                                    key={barber.id}
                                    barber={barber}
                                    onPress={() => { }}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Nenhum profissional disponível</Text>
                        )
                    )}

                    {activeTab === 'info' && (
                        <View style={styles.infoTab}>
                            {/* Endereço */}
                            <View style={styles.infoSection}>
                                <View style={styles.infoSectionHeader}>
                                    <Ionicons name="location-outline" size={20} color={Colors.secondary} />
                                    <Text style={styles.infoSectionTitle}>Endereço</Text>
                                </View>
                                <Text style={styles.infoText}>
                                    {barbershop.address}{barbershop.addressNumber ? `, ${barbershop.addressNumber}` : ''}
                                </Text>
                                <Text style={styles.infoText}>
                                    {barbershop.neighborhood} - {barbershop.city}/{barbershop.state}
                                </Text>
                                {barbershop.zipCode && (
                                    <Text style={styles.infoTextMuted}>CEP: {barbershop.zipCode}</Text>
                                )}
                            </View>

                            {/* Horários */}
                            <View style={styles.infoSection}>
                                <View style={styles.infoSectionHeader}>
                                    <Ionicons name="time-outline" size={20} color={Colors.secondary} />
                                    <Text style={styles.infoSectionTitle}>Horários</Text>
                                </View>
                                {Object.entries(barbershop.openingHours).map(([day, hours]) => (
                                    <View key={day} style={styles.hourRow}>
                                        <Text style={styles.hourDay}>{DAY_NAMES[day]}</Text>
                                        <Text style={[styles.hourTime, hours.closed && styles.hourClosed]}>
                                            {hours.closed ? 'Fechado' : `${hours.open} - ${hours.close}`}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: Colors.text,
        marginTop: 16,
        marginBottom: 24,
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: Colors.secondary,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    coverContainer: {
        height: 280,
        position: 'relative',
    },
    cover: {
        width: '100%',
        height: '100%',
    },
    coverGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    headerBackButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerFavoriteButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        position: 'absolute',
        bottom: -40,
        left: 20,
        width: 90,
        height: 90,
        borderRadius: 22,
        backgroundColor: Colors.surface,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 18,
    },
    infoContainer: {
        padding: 20,
        paddingTop: 50,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    rating: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text,
    },
    reviewCount: {
        fontSize: 14,
        color: Colors.textMuted,
        marginLeft: 4,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: 20,
    },
    contactButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    contactButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    contactButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.text,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tab: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.secondary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textMuted,
    },
    tabTextActive: {
        color: Colors.secondary,
    },
    tabContent: {
        padding: 20,
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textMuted,
        textAlign: 'center',
        paddingVertical: 40,
    },
    infoTab: {
        gap: 24,
    },
    infoSection: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    infoSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    infoText: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 4,
    },
    infoTextMuted: {
        fontSize: 13,
        color: Colors.textMuted,
        marginTop: 4,
    },
    hourRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    hourDay: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    hourTime: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    hourClosed: {
        color: Colors.textMuted,
    },
});
