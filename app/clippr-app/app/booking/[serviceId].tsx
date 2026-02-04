import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useBooking } from '@/contexts/BookingContext';
import { BarberCard } from '@/components/BarberCard';
import { TimeSlot } from '@/components/TimeSlot';
import { Button } from '@/components/ui/Button';
import { timeSlots } from '@/constants/mockData';

export default function BookingScreen() {
    const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
    const { services, barbers, setCurrentBooking } = useBooking();

    const service = services.find(s => s.id === serviceId);
    const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Generate next 14 days
    const availableDates = useMemo(() => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    }, []);

    const formatDay = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const handleContinue = () => {
        if (!selectedBarberId || !selectedTime) return;

        setCurrentBooking({
            serviceId: serviceId!,
            barberId: selectedBarberId,
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
        });

        router.push('/booking/confirm');
    };

    const canContinue = selectedBarberId && selectedTime;

    if (!service) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Serviço não encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <LinearGradient
                colors={[Colors.background, Colors.primary]}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Agendar</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Selected Service */}
                <View style={styles.serviceCard}>
                    <View style={styles.serviceIconContainer}>
                        <Ionicons
                            name={service.icon as keyof typeof Ionicons.glyphMap}
                            size={24}
                            color={Colors.secondary}
                        />
                    </View>
                    <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceMeta}>
                            {service.duration} min • R$ {service.price}
                        </Text>
                    </View>
                </View>

                {/* Select Barber */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Escolha o Barbeiro</Text>
                    <FlatList
                        horizontal
                        data={barbers}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <BarberCard
                                barber={item}
                                compact
                                selected={selectedBarberId === item.id}
                                onPress={() => item.available && setSelectedBarberId(item.id)}
                            />
                        )}
                    />
                </View>

                {/* Select Date */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Escolha a Data</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.datesContainer}
                    >
                        {availableDates.map((date, index) => {
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setSelectedDate(date)}
                                    style={[styles.dateItem, isSelected && styles.dateItemSelected]}
                                >
                                    <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                                        {isToday(date) ? 'Hoje' : formatDay(date)}
                                    </Text>
                                    <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                                        {date.getDate()}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Select Time */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Escolha o Horário</Text>
                    <View style={styles.timeSlotsContainer}>
                        {timeSlots.map((slot, index) => (
                            <TimeSlot
                                key={index}
                                slot={slot}
                                selected={selectedTime === slot.time}
                                onPress={() => slot.available && setSelectedTime(slot.time)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryLabel}>Total</Text>
                    <Text style={styles.summaryPrice}>R$ {service.price}</Text>
                </View>
                <Button
                    title="Continuar"
                    onPress={handleContinue}
                    disabled={!canContinue}
                    size="large"
                    style={styles.continueButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    serviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    serviceIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(233, 69, 96, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceInfo: {
        marginLeft: 14,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    serviceMeta: {
        fontSize: 14,
        color: Colors.textMuted,
        marginTop: 2,
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    datesContainer: {
        gap: 10,
    },
    dateItem: {
        width: 65,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: 10,
    },
    dateItemSelected: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    dateDay: {
        fontSize: 12,
        color: Colors.textMuted,
        textTransform: 'capitalize',
        marginBottom: 4,
    },
    dateDaySelected: {
        color: 'rgba(255,255,255,0.8)',
    },
    dateNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
    },
    dateNumberSelected: {
        color: '#fff',
    },
    timeSlotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 34,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    summaryContainer: {
        marginRight: 20,
    },
    summaryLabel: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    summaryPrice: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.accent,
    },
    continueButton: {
        flex: 1,
    },
    errorText: {
        color: Colors.text,
        textAlign: 'center',
        marginTop: 100,
    },
});
