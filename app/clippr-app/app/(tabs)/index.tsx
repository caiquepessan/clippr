import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useBarbershop } from '@/contexts/BarbershopContext';
import { BarbershopCard } from '@/components/BarbershopCard';
import { BookingCard } from '@/components/BookingCard';

export default function HomeScreen() {
  const { user } = useAuth();
  const { getUpcomingBookings, cancelBooking } = useBooking();
  const { barbershops, isLoading, searchBarbershops, toggleFavorite, isFavorite } = useBarbershop();

  const upcomingBookings = getUpcomingBookings();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await searchBarbershops();
    setRefreshing(false);
  };

  useEffect(() => {
    searchBarbershops();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleBarbershopPress = (slug: string) => {
    router.push(`/barbershop/${slug}` as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[Colors.background, Colors.primary]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.secondary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Visitante'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Next Booking */}
        {upcomingBookings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Próximo Agendamento</Text>
            </View>
            <BookingCard
              booking={upcomingBookings[0]}
              onCancel={() => cancelBooking(upcomingBookings[0].id)}
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <LinearGradient
              colors={['#E94560', '#FF6B6B']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="search-outline" size={28} color="#fff" />
              <Text style={styles.quickActionText}>Explorar</Text>
              <Text style={styles.quickActionSubtext}>Barbearias</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/bookings')}
          >
            <View style={styles.quickActionSecondary}>
              <Ionicons name="calendar-outline" size={28} color={Colors.secondary} />
              <Text style={styles.quickActionTextSecondary}>Agendamentos</Text>
              <Text style={styles.quickActionSubtextSecondary}>Ver todos</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Nearby Barbershops */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Barbearias Próximas</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {isLoading && barbershops.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.secondary} />
              <Text style={styles.loadingText}>Buscando barbearias...</Text>
            </View>
          ) : barbershops.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Nenhuma barbearia encontrada</Text>
            </View>
          ) : (
            barbershops.slice(0, 3).map(barbershop => (
              <BarbershopCard
                key={barbershop.id}
                barbershop={barbershop}
                onPress={() => handleBarbershopPress(barbershop.slug)}
                onFavoritePress={() => toggleFavorite(barbershop.id)}
                isFavorite={isFavorite(barbershop.id)}
                compact
              />
            ))
          )}
        </View>

        {/* Promo Banner */}
        <TouchableOpacity style={styles.promoBanner} activeOpacity={0.9}>
          <LinearGradient
            colors={['rgba(233, 69, 96, 0.9)', 'rgba(255, 107, 107, 0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.promoGradient}
          >
            <View style={styles.promoContent}>
              <Ionicons name="gift-outline" size={32} color="#fff" />
              <View style={styles.promoText}>
                <Text style={styles.promoTitle}>Primeira vez?</Text>
                <Text style={styles.promoSubtitle}>Ganhe 20% off no primeiro corte!</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.featuredTitle}>Por que escolher o Clippr?</Text>

          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="calendar-outline" size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.featureTitle}>Agendamento Fácil</Text>
              <Text style={styles.featureDesc}>Agende em segundos</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="star-outline" size={24} color={Colors.accent} />
              </View>
              <Text style={styles.featureTitle}>Avaliações Reais</Text>
              <Text style={styles.featureDesc}>Escolha os melhores</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="trophy-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.featureTitle}>Programa de Pontos</Text>
              <Text style={styles.featureDesc}>Ganhe recompensas</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="location-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.featureTitle}>Perto de Você</Text>
              <Text style={styles.featureDesc}>Encontre facilmente</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  headerLeft: {},
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'flex-start',
    minHeight: 120,
  },
  quickActionSecondary: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 120,
  },
  quickActionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  quickActionSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  quickActionTextSecondary: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
  },
  quickActionSubtextSecondary: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 12,
  },
  promoBanner: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 28,
  },
  promoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  promoText: {},
  promoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  promoSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
