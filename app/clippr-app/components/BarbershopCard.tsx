import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Barbershop } from '@/types';

const { width } = Dimensions.get('window');

interface BarbershopCardProps {
    barbershop: Barbershop;
    onPress?: () => void;
    onFavoritePress?: () => void;
    isFavorite?: boolean;
    compact?: boolean;
}

export function BarbershopCard({
    barbershop,
    onPress,
    onFavoritePress,
    isFavorite = false,
    compact = false,
}: BarbershopCardProps) {
    if (compact) {
        return (
            <TouchableOpacity
                style={styles.compactContainer}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Image
                    source={{ uri: barbershop.logoUrl || 'https://via.placeholder.com/60' }}
                    style={styles.compactLogo}
                />
                <View style={styles.compactInfo}>
                    <View style={styles.compactHeader}>
                        <Text style={styles.compactName} numberOfLines={1}>
                            {barbershop.name}
                        </Text>
                        {barbershop.isVerified && (
                            <Ionicons name="checkmark-circle" size={14} color={Colors.accent} />
                        )}
                    </View>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color={Colors.accent} />
                        <Text style={styles.rating}>{barbershop.rating.toFixed(1)}</Text>
                        <Text style={styles.reviews}>({barbershop.reviewCount})</Text>
                    </View>
                    <Text style={styles.compactLocation} numberOfLines={1}>
                        {barbershop.neighborhood}, {barbershop.city}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={onFavoritePress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isFavorite ? Colors.secondary : Colors.textMuted}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Cover Image */}
            <View style={styles.coverContainer}>
                <Image
                    source={{ uri: barbershop.coverUrl || 'https://via.placeholder.com/400x200' }}
                    style={styles.cover}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.coverGradient}
                />

                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteBadge}
                    onPress={onFavoritePress}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isFavorite ? Colors.secondary : '#fff'}
                    />
                </TouchableOpacity>

                {/* Verified Badge */}
                {barbershop.isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#fff" />
                        <Text style={styles.verifiedText}>Verificado</Text>
                    </View>
                )}

                {/* Logo */}
                <View style={styles.logoWrapper}>
                    <Image
                        source={{ uri: barbershop.logoUrl || 'https://via.placeholder.com/70' }}
                        style={styles.logo}
                    />
                </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>
                        {barbershop.name}
                    </Text>
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={14} color={Colors.accent} />
                        <Text style={styles.ratingText}>{barbershop.rating.toFixed(1)}</Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {barbershop.description}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                        <Text style={styles.location} numberOfLines={1}>
                            {barbershop.neighborhood}, {barbershop.city}
                        </Text>
                    </View>
                    <Text style={styles.reviewCount}>
                        {barbershop.reviewCount} avaliações
                    </Text>
                </View>

                {/* Tags */}
                <View style={styles.tags}>
                    {barbershop.subscriptionStatus === 'trial' && (
                        <View style={[styles.tag, styles.trialTag]}>
                            <Text style={styles.tagText}>Novo</Text>
                        </View>
                    )}
                    {barbershop.distance && (
                        <View style={styles.tag}>
                            <Ionicons name="navigate-outline" size={12} color={Colors.textSecondary} />
                            <Text style={styles.tagText}>{barbershop.distance.toFixed(1)} km</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 16,
    },
    coverContainer: {
        height: 140,
        position: 'relative',
    },
    cover: {
        width: '100%',
        height: '100%',
    },
    coverGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    favoriteBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.accent,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    verifiedText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#000',
    },
    logoWrapper: {
        position: 'absolute',
        bottom: -30,
        left: 16,
        width: 70,
        height: 70,
        borderRadius: 18,
        backgroundColor: Colors.surface,
        padding: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    info: {
        padding: 16,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    name: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.accent,
    },
    description: {
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 18,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    location: {
        fontSize: 12,
        color: Colors.textMuted,
        flex: 1,
    },
    reviewCount: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    tags: {
        flexDirection: 'row',
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.background,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    trialTag: {
        backgroundColor: 'rgba(233, 69, 96, 0.15)',
    },
    tagText: {
        fontSize: 11,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    // Compact styles
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 12,
    },
    compactLogo: {
        width: 56,
        height: 56,
        borderRadius: 14,
        marginRight: 12,
    },
    compactInfo: {
        flex: 1,
    },
    compactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    compactName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 2,
    },
    rating: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text,
    },
    reviews: {
        fontSize: 11,
        color: Colors.textMuted,
        marginLeft: 2,
    },
    compactLocation: {
        fontSize: 12,
        color: Colors.textMuted,
        marginTop: 2,
    },
    favoriteButton: {
        padding: 8,
    },
});
