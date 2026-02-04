import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { BarbershopCard } from '@/components/BarbershopCard';
import { useBarbershop } from '@/contexts/BarbershopContext';

const CITIES = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'];

export default function ExploreScreen() {
    const { barbershops, isLoading, searchBarbershops, toggleFavorite, isFavorite } = useBarbershop();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const handleSearch = () => {
        searchBarbershops(searchQuery || undefined, selectedCity || undefined);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await searchBarbershops(searchQuery || undefined, selectedCity || undefined);
        setRefreshing(false);
    };

    useEffect(() => {
        handleSearch();
    }, [selectedCity]);

    const handleBarbershopPress = (slug: string) => {
        router.push(`/barbershop/${slug}` as any);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <LinearGradient
                colors={[Colors.primary, Colors.background]}
                style={styles.header}
            >
                <Text style={styles.title}>Explorar</Text>
                <Text style={styles.subtitle}>Encontre a barbearia perfeita</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar barbearias..."
                            placeholderTextColor={Colors.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => { setSearchQuery(''); handleSearch(); }}>
                                <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={handleSearch}>
                        <Ionicons name="options-outline" size={22} color={Colors.text} />
                    </TouchableOpacity>
                </View>

                {/* City Filter */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.citiesContainer}
                >
                    <TouchableOpacity
                        style={[styles.cityChip, !selectedCity && styles.cityChipActive]}
                        onPress={() => setSelectedCity(null)}
                    >
                        <Text style={[styles.cityChipText, !selectedCity && styles.cityChipTextActive]}>
                            Todas
                        </Text>
                    </TouchableOpacity>
                    {CITIES.map(city => (
                        <TouchableOpacity
                            key={city}
                            style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
                            onPress={() => setSelectedCity(city)}
                        >
                            <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>
                                {city}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </LinearGradient>

            {/* Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={Colors.secondary}
                    />
                }
            >
                {isLoading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.secondary} />
                        <Text style={styles.loadingText}>Buscando barbearias...</Text>
                    </View>
                ) : barbershops.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="business-outline" size={64} color={Colors.textMuted} />
                        <Text style={styles.emptyTitle}>Nenhuma barbearia encontrada</Text>
                        <Text style={styles.emptyText}>
                            Tente buscar com outros termos ou em outra cidade
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.resultsCount}>
                            {barbershops.length} {barbershops.length === 1 ? 'barbearia encontrada' : 'barbearias encontradas'}
                        </Text>
                        {barbershops.map(barbershop => (
                            <BarbershopCard
                                key={barbershop.id}
                                barbershop={barbershop}
                                onPress={() => handleBarbershopPress(barbershop.slug)}
                                onFavoritePress={() => toggleFavorite(barbershop.id)}
                                isFavorite={isFavorite(barbershop.id)}
                            />
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.text,
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    citiesContainer: {
        gap: 8,
    },
    cityChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cityChipActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    cityChipText: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
    cityChipTextActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    resultsCount: {
        fontSize: 13,
        color: Colors.textMuted,
        marginBottom: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
});
