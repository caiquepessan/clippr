import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';

interface MenuItemProps {
    icon: string;
    label: string;
    value?: string;
    onPress: () => void;
    color?: string;
}

function MenuItem({ icon, label, value, onPress, color }: MenuItemProps) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.menuIcon, color && { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon as any} size={20} color={color || Colors.secondary} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{label}</Text>
                {value && <Text style={styles.menuValue}>{value}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
    );
}

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { getUpcomingBookings, getPastBookings } = useBooking();

    const upcomingCount = getUpcomingBookings().length;
    const completedCount = getPastBookings().filter(b => b.status === 'completed').length;

    const handleLogout = () => {
        Alert.alert(
            'Sair',
            'Tem certeza que deseja sair da sua conta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        router.replace('/(auth)/login');
                    },
                },
            ]
        );
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
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Perfil</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <LinearGradient
                        colors={['rgba(233, 69, 96, 0.1)', 'rgba(233, 69, 96, 0.02)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={styles.avatarContainer}>
                        {user?.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={40} color={Colors.textMuted} />
                            </View>
                        )}
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'email@exemplo.com'}</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{upcomingCount}</Text>
                            <Text style={styles.statLabel}>Agendados</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{completedCount}</Text>
                            <Text style={styles.statLabel}>Concluídos</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={styles.statBadge}>
                                <Ionicons name="star" size={12} color={Colors.accent} />
                                <Text style={styles.statValueSmall}>VIP</Text>
                            </View>
                            <Text style={styles.statLabel}>Status</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Sections */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>Conta</Text>

                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="person-outline"
                            label="Editar Perfil"
                            onPress={() => { }}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItem
                            icon="call-outline"
                            label="Telefone"
                            value={user?.phone || '(00) 00000-0000'}
                            onPress={() => { }}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItem
                            icon="lock-closed-outline"
                            label="Alterar Senha"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>Preferências</Text>

                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="notifications-outline"
                            label="Notificações"
                            onPress={() => { }}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItem
                            icon="moon-outline"
                            label="Tema"
                            value="Escuro"
                            onPress={() => { }}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItem
                            icon="language-outline"
                            label="Idioma"
                            value="Português"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>Suporte</Text>

                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="help-circle-outline"
                            label="Central de Ajuda"
                            onPress={() => { }}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItem
                            icon="chatbubble-outline"
                            label="Fale Conosco"
                            onPress={() => { }}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItem
                            icon="document-text-outline"
                            label="Termos de Uso"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="log-out-outline"
                            label="Sair da Conta"
                            onPress={handleLogout}
                            color={Colors.error}
                        />
                    </View>
                </View>

                <Text style={styles.version}>Clippr v1.0.0</Text>
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
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
    },
    profileCard: {
        marginHorizontal: 20,
        padding: 24,
        borderRadius: 24,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
        marginBottom: 28,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: Colors.secondary,
    },
    avatarPlaceholder: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: Colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.surface,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        width: '100%',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: Colors.border,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
    },
    statValueSmall: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.accent,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textMuted,
        marginTop: 4,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    menuSection: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    menuSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textMuted,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    menuCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(233, 69, 96, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    menuContent: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.text,
    },
    menuValue: {
        fontSize: 13,
        color: Colors.textMuted,
        marginTop: 2,
    },
    menuDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginLeft: 70,
    },
    version: {
        textAlign: 'center',
        fontSize: 13,
        color: Colors.textMuted,
        marginTop: 8,
        marginBottom: 20,
    },
});
