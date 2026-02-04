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
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useBooking } from '@/contexts/BookingContext';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceCategory } from '@/types';

const categories: { key: ServiceCategory | 'todos'; label: string; icon: string }[] = [
    { key: 'todos', label: 'Todos', icon: 'grid-outline' },
    { key: 'corte', label: 'Cortes', icon: 'cut-outline' },
    { key: 'barba', label: 'Barba', icon: 'man-outline' },
    { key: 'combo', label: 'Combos', icon: 'star-outline' },
    { key: 'tratamento', label: 'Tratamentos', icon: 'water-outline' },
];

export default function ServicesScreen() {
    const { services } = useBooking();
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'todos'>('todos');

    const filteredServices = selectedCategory === 'todos'
        ? services
        : services.filter(s => s.category === selectedCategory);

    const handleServicePress = (serviceId: string) => {
        router.push(`/booking/${serviceId}`);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <LinearGradient
                colors={[Colors.background, Colors.primary]}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <Text style={styles.title}>Serviços</Text>
                <Text style={styles.subtitle}>Escolha o serviço desejado</Text>
            </View>

            {/* Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
            >
                {categories.map(category => (
                    <TouchableOpacity
                        key={category.key}
                        onPress={() => setSelectedCategory(category.key)}
                        style={[
                            styles.categoryChip,
                            selectedCategory === category.key && styles.categoryChipActive,
                        ]}
                    >
                        <Ionicons
                            name={category.icon as any}
                            size={18}
                            color={selectedCategory === category.key ? '#fff' : Colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === category.key && styles.categoryTextActive,
                            ]}
                        >
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Services List */}
            <ScrollView
                style={styles.servicesList}
                contentContainerStyle={styles.servicesContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.resultsCount}>
                    {filteredServices.length} serviço{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}
                </Text>

                {filteredServices.map(service => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onPress={() => handleServicePress(service.id)}
                    />
                ))}
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
    categoriesContainer: {
        maxHeight: 50,
        marginBottom: 16,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 6,
        marginRight: 10,
    },
    categoryChipActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
    categoryTextActive: {
        color: '#fff',
    },
    servicesList: {
        flex: 1,
    },
    servicesContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    resultsCount: {
        fontSize: 13,
        color: Colors.textMuted,
        marginBottom: 16,
    },
});
