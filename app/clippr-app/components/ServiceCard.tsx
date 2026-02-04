import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { Service } from '@/types';

interface ServiceCardProps {
    service: Service;
    onPress: () => void;
    selected?: boolean;
}

export function ServiceCard({ service, onPress, selected = false }: ServiceCardProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={[styles.container, selected && styles.containerSelected]}>
                {selected && (
                    <LinearGradient
                        colors={['rgba(233, 69, 96, 0.1)', 'rgba(233, 69, 96, 0.05)']}
                        style={StyleSheet.absoluteFill}
                    />
                )}

                <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
                    <Ionicons
                        name={service.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={selected ? '#fff' : Colors.secondary}
                    />
                </View>

                <View style={styles.content}>
                    <Text style={styles.name}>{service.name}</Text>
                    <Text style={styles.description} numberOfLines={1}>
                        {service.description}
                    </Text>
                    <View style={styles.meta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                            <Text style={styles.metaText}>{service.duration} min</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.currency}>R$</Text>
                    <Text style={styles.price}>{service.price}</Text>
                </View>

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
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(233, 69, 96, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainerSelected: {
        backgroundColor: Colors.secondary,
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
    description: {
        color: Colors.textMuted,
        fontSize: 13,
        marginBottom: 6,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        color: Colors.textMuted,
        fontSize: 12,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginLeft: 8,
    },
    currency: {
        color: Colors.accent,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    price: {
        color: Colors.accent,
        fontSize: 22,
        fontWeight: '700',
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});
