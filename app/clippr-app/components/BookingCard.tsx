import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { Booking } from '@/types';

interface BookingCardProps {
    booking: Booking;
    onCancel?: () => void;
    showActions?: boolean;
}

export function BookingCard({ booking, onCancel, showActions = true }: BookingCardProps) {
    const statusConfig = {
        pending: { color: Colors.warning, text: 'Pendente', icon: 'time-outline' },
        confirmed: { color: Colors.success, text: 'Confirmado', icon: 'checkmark-circle-outline' },
        completed: { color: Colors.info, text: 'Concluído', icon: 'checkmark-done-outline' },
        cancelled: { color: Colors.error, text: 'Cancelado', icon: 'close-circle-outline' },
    };

    const status = statusConfig[booking.status];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        };
        return date.toLocaleDateString('pt-BR', options);
    };

    const handleCancel = () => {
        Alert.alert(
            'Cancelar Agendamento',
            'Tem certeza que deseja cancelar este agendamento?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim, cancelar', style: 'destructive', onPress: onCancel },
            ]
        );
    };

    const isUpcoming = booking.status === 'pending' || booking.status === 'confirmed';

    return (
        <View style={styles.container}>
            {isUpcoming && (
                <LinearGradient
                    colors={['rgba(233, 69, 96, 0.08)', 'rgba(233, 69, 96, 0.02)']}
                    style={StyleSheet.absoluteFill}
                />
            )}

            <View style={styles.header}>
                <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.secondary} />
                    <Text style={styles.date}>{formatDate(booking.date)}</Text>
                    <View style={styles.timeBadge}>
                        <Text style={styles.time}>{booking.time}</Text>
                    </View>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
                    <Ionicons name={status.icon as any} size={14} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.content}>
                <View style={styles.serviceInfo}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={booking.service.icon as any}
                            size={22}
                            color={Colors.secondary}
                        />
                    </View>
                    <View style={styles.serviceDetails}>
                        <Text style={styles.serviceName}>{booking.service.name}</Text>
                        <Text style={styles.serviceDuration}>{booking.service.duration} minutos</Text>
                    </View>
                    <Text style={styles.price}>R$ {booking.totalPrice}</Text>
                </View>

                <View style={styles.barberInfo}>
                    <Image source={{ uri: booking.barber.avatar }} style={styles.barberAvatar} />
                    <View style={styles.barberDetails}>
                        <Text style={styles.barberLabel}>Barbeiro</Text>
                        <Text style={styles.barberName}>{booking.barber.name}</Text>
                    </View>
                </View>
            </View>

            {showActions && isUpcoming && (
                <>
                    <View style={styles.divider} />
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleCancel}>
                            <Ionicons name="close-outline" size={18} color={Colors.error} />
                            <Text style={[styles.actionText, { color: Colors.error }]}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="create-outline" size={18} color={Colors.secondary} />
                            <Text style={[styles.actionText, { color: Colors.secondary }]}>Remarcar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    date: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    timeBadge: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    time: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 14,
    },
    content: {
        gap: 14,
    },
    serviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(233, 69, 96, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceDetails: {
        flex: 1,
        marginLeft: 12,
    },
    serviceName: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    serviceDuration: {
        color: Colors.textMuted,
        fontSize: 13,
        marginTop: 2,
    },
    price: {
        color: Colors.accent,
        fontSize: 18,
        fontWeight: '700',
    },
    barberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceLight,
        padding: 12,
        borderRadius: 12,
    },
    barberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Colors.secondary,
    },
    barberDetails: {
        marginLeft: 12,
    },
    barberLabel: {
        color: Colors.textMuted,
        fontSize: 11,
    },
    barberName: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
