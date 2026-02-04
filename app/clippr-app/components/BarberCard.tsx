import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { Barber } from '@/types';

interface BarberCardProps {
    barber: Barber;
    onPress: () => void;
    selected?: boolean;
    compact?: boolean;
}

export function BarberCard({
    barber,
    onPress,
    selected = false,
    compact = false,
}: BarberCardProps) {
    if (compact) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                disabled={!barber.available}
                style={[styles.compactContainer, selected && styles.compactSelected]}
            >
                <Image source={{ uri: barber.avatar }} style={styles.compactAvatar} />
                <Text style={styles.compactName} numberOfLines={1}>
                    {barber.name.split(' ')[0]}
                </Text>
                {selected && (
                    <View style={styles.compactCheck}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                    </View>
                )}
                {!barber.available && (
                    <View style={styles.unavailableOverlay}>
                        <Text style={styles.unavailableText}>Indisponível</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            disabled={!barber.available}
        >
            <View style={[styles.container, selected && styles.containerSelected]}>
                {selected && (
                    <LinearGradient
                        colors={['rgba(233, 69, 96, 0.1)', 'rgba(233, 69, 96, 0.05)']}
                        style={StyleSheet.absoluteFill}
                    />
                )}

                <Image source={{ uri: barber.avatar }} style={styles.avatar} />

                <View style={styles.content}>
                    <Text style={styles.name}>{barber.name}</Text>
                    <Text style={styles.specialty}>{barber.specialty}</Text>
                    <View style={styles.rating}>
                        <Ionicons name="star" size={14} color={Colors.accent} />
                        <Text style={styles.ratingText}>{barber.rating}</Text>
                        <Text style={styles.reviewCount}>({barber.reviewCount} avaliações)</Text>
                    </View>
                </View>

                {barber.available ? (
                    <View style={styles.availableBadge}>
                        <View style={styles.availableDot} />
                        <Text style={styles.availableText}>Disponível</Text>
                    </View>
                ) : (
                    <View style={styles.unavailableBadge}>
                        <Text style={styles.unavailableBadgeText}>Ocupado</Text>
                    </View>
                )}

                {selected && (
                    <View style={styles.checkmark}>
                        <Ionicons name="checkmark-circle" size={24} color={Colors.secondary} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    containerSelected: {
        borderColor: Colors.secondary,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: Colors.border,
    },
    content: {
        flex: 1,
        marginLeft: 14,
    },
    name: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    specialty: {
        color: Colors.textSecondary,
        fontSize: 13,
        marginBottom: 6,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        color: Colors.accent,
        fontSize: 13,
        fontWeight: '600',
    },
    reviewCount: {
        color: Colors.textMuted,
        fontSize: 12,
    },
    availableBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    availableDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.success,
    },
    availableText: {
        color: Colors.success,
        fontSize: 11,
        fontWeight: '600',
    },
    unavailableBadge: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    unavailableBadgeText: {
        color: Colors.error,
        fontSize: 11,
        fontWeight: '600',
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    // Compact styles
    compactContainer: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        width: 90,
        marginRight: 12,
    },
    compactSelected: {
        borderColor: Colors.secondary,
        backgroundColor: 'rgba(233, 69, 96, 0.1)',
    },
    compactAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 8,
    },
    compactName: {
        color: Colors.text,
        fontSize: 13,
        fontWeight: '500',
    },
    compactCheck: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    unavailableOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unavailableText: {
        color: Colors.textMuted,
        fontSize: 10,
        fontWeight: '600',
    },
});
