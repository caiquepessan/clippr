import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useBooking } from '@/contexts/BookingContext';
import { BookingCard } from '@/components/BookingCard';

type FilterType = 'upcoming' | 'past';

export default function BookingsScreen() {
    const { getUpcomingBookings, getPastBookings, cancelBooking } = useBooking();
    const [filter, setFilter] = useState<FilterType>('upcoming');

    const upcomingBookings = getUpcomingBookings();
    const pastBookings = getPastBookings();

    const bookingsToShow = filter === 'upcoming' ? upcomingBookings : pastBookings;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <LinearGradient
                colors={[Colors.background, Colors.primary]}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <Text style={styles.title}>Meus Agendamentos</Text>
                <Text style={styles.subtitle}>Gerencie seus horários</Text>
            </View>

            {/* Filters */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    onPress={() => setFilter('upcoming')}
                    style={[styles.filterButton, filter === 'upcoming' && styles.filterButtonActive]}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={filter === 'upcoming' ? '#fff' : Colors.textSecondary}
                    />
                    <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
                        Próximos
                    </Text>
                    {upcomingBookings.length > 0 && (
                        <View style={[styles.badge, filter === 'upcoming' && styles.badgeActive]}>
                            <Text style={styles.badgeText}>{upcomingBookings.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setFilter('past')}
                    style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
                >
                    <Ionicons
                        name="time-outline"
                        size={18}
                        color={filter === 'past' ? '#fff' : Colors.textSecondary}
                    />
                    <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
                        Histórico
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Bookings List */}
            <ScrollView
                style={styles.bookingsList}
                contentContainerStyle={styles.bookingsContent}
                showsVerticalScrollIndicator={false}
            >
                {bookingsToShow.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name={filter === 'upcoming' ? 'calendar-outline' : 'time-outline'}
                                size={48}
                                color={Colors.textMuted}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>
                            {filter === 'upcoming' ? 'Nenhum agendamento futuro' : 'Nenhum histórico'}
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {filter === 'upcoming'
                                ? 'Agende seu próximo horário agora!'
                                : 'Seus agendamentos concluídos aparecerão aqui'}
                        </Text>
                    </View>
                ) : (
                    bookingsToShow.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onCancel={() => cancelBooking(booking.id)}
                            showActions={filter === 'upcoming'}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 8,
    },
    filterButtonActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    filterText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    filterTextActive: {
        color: '#fff',
    },
    badge: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    badgeActive: {
        backgroundColor: '#fff',
    },
    badgeText: {
        color: Colors.secondary,
        fontSize: 12,
        fontWeight: '700',
    },
    bookingsList: {
        flex: 1,
    },
    bookingsContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: Colors.textMuted,
        textAlign: 'center',
        maxWidth: 280,
    },
});
