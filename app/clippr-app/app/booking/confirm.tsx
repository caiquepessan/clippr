import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/Button';

export default function ConfirmScreen() {
    const { currentBooking, services, barbers, createBooking } = useBooking();
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    if (!currentBooking) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Nenhum agendamento em andamento</Text>
            </View>
        );
    }

    const service = services.find(s => s.id === currentBooking.serviceId);
    const barber = barbers.find(b => b.id === currentBooking.barberId);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await createBooking(currentBooking);
            setIsConfirmed(true);
        } catch (error) {
            console.error('Erro ao confirmar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoHome = () => {
        router.replace('/(tabs)');
    };

    if (isConfirmed) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />

                <LinearGradient
                    colors={[Colors.background, Colors.primary]}
                    style={StyleSheet.absoluteFill}
                />

                <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                        <LinearGradient
                            colors={['#4CAF50', '#66BB6A']}
                            style={styles.successGradient}
                        >
                            <Ionicons name="checkmark" size={60} color="#fff" />
                        </LinearGradient>
                    </View>

                    <Text style={styles.successTitle}>Agendamento Confirmado!</Text>
                    <Text style={styles.successSubtitle}>
                        Seu horário foi reservado com sucesso. Enviamos um lembrete para seu email.
                    </Text>

                    <View style={styles.successDetails}>
                        <View style={styles.successDetailRow}>
                            <Ionicons name="calendar-outline" size={20} color={Colors.secondary} />
                            <Text style={styles.successDetailText}>
                                {formatDate(currentBooking.date)}
                            </Text>
                        </View>
                        <View style={styles.successDetailRow}>
                            <Ionicons name="time-outline" size={20} color={Colors.secondary} />
                            <Text style={styles.successDetailText}>{currentBooking.time}</Text>
                        </View>
                    </View>

                    <Button
                        title="Voltar ao Início"
                        onPress={handleGoHome}
                        size="large"
                        style={styles.homeButton}
                    />
                </View>
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
                <Text style={styles.headerTitle}>Confirmar Agendamento</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <LinearGradient
                        colors={['rgba(233, 69, 96, 0.1)', 'rgba(233, 69, 96, 0.02)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <Text style={styles.summaryTitle}>Resumo do Agendamento</Text>

                    {/* Service */}
                    <View style={styles.summarySection}>
                        <Text style={styles.summaryLabel}>Serviço</Text>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryIconContainer}>
                                <Ionicons
                                    name={service?.icon as any}
                                    size={22}
                                    color={Colors.secondary}
                                />
                            </View>
                            <View style={styles.summaryInfo}>
                                <Text style={styles.summaryName}>{service?.name}</Text>
                                <Text style={styles.summaryMeta}>{service?.duration} minutos</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Barber */}
                    <View style={styles.summarySection}>
                        <Text style={styles.summaryLabel}>Profissional</Text>
                        <View style={styles.summaryRow}>
                            <Image
                                source={{ uri: barber?.avatar }}
                                style={styles.barberAvatar}
                            />
                            <View style={styles.summaryInfo}>
                                <Text style={styles.summaryName}>{barber?.name}</Text>
                                <Text style={styles.summaryMeta}>{barber?.specialty}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Date & Time */}
                    <View style={styles.summarySection}>
                        <Text style={styles.summaryLabel}>Data e Horário</Text>
                        <View style={styles.dateTimeContainer}>
                            <View style={styles.dateTimeItem}>
                                <Ionicons name="calendar" size={20} color={Colors.secondary} />
                                <Text style={styles.dateTimeText}>
                                    {formatDate(currentBooking.date)}
                                </Text>
                            </View>
                            <View style={styles.dateTimeItem}>
                                <Ionicons name="time" size={20} color={Colors.secondary} />
                                <Text style={styles.dateTimeText}>{currentBooking.time}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Price Card */}
                <View style={styles.priceCard}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>{service?.name}</Text>
                        <Text style={styles.priceValue}>R$ {service?.price}</Text>
                    </View>
                    <View style={styles.priceDivider} />
                    <View style={styles.priceRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>R$ {service?.price}</Text>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.paymentCard}>
                    <View style={styles.paymentHeader}>
                        <Text style={styles.paymentTitle}>Forma de Pagamento</Text>
                        <TouchableOpacity>
                            <Text style={styles.changeText}>Alterar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.paymentMethod}>
                        <View style={styles.paymentIcon}>
                            <Ionicons name="cash-outline" size={22} color={Colors.success} />
                        </View>
                        <Text style={styles.paymentText}>Pagar no local</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    title="Confirmar Agendamento"
                    onPress={handleConfirm}
                    loading={isLoading}
                    size="large"
                    style={styles.confirmButton}
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
    summaryCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 20,
    },
    summarySection: {
        marginVertical: 12,
    },
    summaryLabel: {
        fontSize: 12,
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(233, 69, 96, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    barberAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: Colors.secondary,
    },
    summaryInfo: {
        marginLeft: 14,
    },
    summaryName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    summaryMeta: {
        fontSize: 13,
        color: Colors.textMuted,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 4,
    },
    dateTimeContainer: {
        gap: 12,
    },
    dateTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dateTimeText: {
        fontSize: 15,
        color: Colors.text,
        textTransform: 'capitalize',
    },
    priceCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 15,
        color: Colors.textSecondary,
    },
    priceValue: {
        fontSize: 15,
        color: Colors.text,
    },
    priceDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 14,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.accent,
    },
    paymentCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    paymentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    changeText: {
        fontSize: 14,
        color: Colors.secondary,
        fontWeight: '500',
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentText: {
        fontSize: 15,
        color: Colors.text,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 34,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    confirmButton: {
        width: '100%',
    },
    errorText: {
        color: Colors.text,
        textAlign: 'center',
        marginTop: 100,
    },
    // Success screen
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    successIcon: {
        marginBottom: 32,
    },
    successGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    successDetails: {
        backgroundColor: Colors.surface,
        padding: 20,
        borderRadius: 16,
        width: '100%',
        gap: 12,
        marginBottom: 32,
    },
    successDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    successDetailText: {
        fontSize: 15,
        color: Colors.text,
        textTransform: 'capitalize',
    },
    homeButton: {
        width: '100%',
    },
});
