import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CustomModal } from '@/components/ui/CustomModal';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Modal states
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { register, isLoading } = useAuth();

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email inválido';
        }

        if (!phone) {
            newErrors.phone = 'Telefone é obrigatório';
        }

        if (!password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Senhas não coincidem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        const result = await register(name, email, password, phone);
        if (result.success) {
            setSuccessModalVisible(true);
        } else {
            setErrorMessage(result.error || 'Falha ao criar conta');
            setErrorModalVisible(true);
        }
    };

    const handleSuccessClose = () => {
        setSuccessModalVisible(false);
        router.replace('/(tabs)');
    };

    const formatPhone = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        let formatted = cleaned;

        if (cleaned.length > 0) {
            formatted = '(' + cleaned;
        }
        if (cleaned.length > 2) {
            formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2);
        }
        if (cleaned.length > 7) {
            formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 7) + '-' + cleaned.slice(7, 11);
        }

        setPhone(formatted);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <LinearGradient
                colors={[Colors.background, Colors.primary]}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color={Colors.text} />
                        </TouchableOpacity>

                        <View style={styles.logoContainer}>
                            <LinearGradient
                                colors={['#E94560', '#FF6B6B']}
                                style={styles.logoGradient}
                            >
                                <Ionicons name="cut" size={28} color="#fff" />
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Text style={styles.title}>Criar conta</Text>
                        <Text style={styles.subtitle}>
                            Preencha seus dados para começar
                        </Text>

                        <Input
                            label="Nome completo"
                            icon="person-outline"
                            placeholder="Seu nome"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            error={errors.name}
                        />

                        <Input
                            label="Email"
                            icon="mail-outline"
                            placeholder="seu@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                        />

                        <Input
                            label="Telefone"
                            icon="call-outline"
                            placeholder="(00) 00000-0000"
                            value={phone}
                            onChangeText={formatPhone}
                            keyboardType="phone-pad"
                            maxLength={15}
                            error={errors.phone}
                        />

                        <Input
                            label="Senha"
                            icon="lock-closed-outline"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={errors.password}
                        />

                        <Input
                            label="Confirmar senha"
                            icon="lock-closed-outline"
                            placeholder="Digite a senha novamente"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            error={errors.confirmPassword}
                        />

                        <Button
                            title="Criar conta"
                            onPress={handleRegister}
                            loading={isLoading}
                            size="large"
                            style={styles.registerButton}
                        />

                        <Text style={styles.terms}>
                            Ao criar uma conta, você concorda com nossos{' '}
                            <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
                            <Text style={styles.termsLink}>Política de Privacidade</Text>
                        </Text>
                    </View>

                    {/* Login Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Já tem uma conta?</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.loginLink}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <CustomModal
                visible={successModalVisible}
                type="success"
                title="Conta criada!"
                message="Sua conta foi criada com sucesso. Bem-vindo ao Clippr!"
                primaryButtonText="Começar"
                onClose={handleSuccessClose}
                onPrimaryPress={handleSuccessClose}
            />

            {/* Error Modal */}
            <CustomModal
                visible={errorModalVisible}
                type="error"
                title="Erro no Cadastro"
                message={errorMessage}
                primaryButtonText="Tentar novamente"
                onClose={() => setErrorModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        marginRight: 44,
    },
    logoGradient: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        flex: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        marginBottom: 28,
    },
    registerButton: {
        marginTop: 8,
        marginBottom: 20,
    },
    terms: {
        fontSize: 13,
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 20,
    },
    termsLink: {
        color: Colors.secondary,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 24,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: 15,
    },
    loginLink: {
        color: Colors.secondary,
        fontSize: 15,
        fontWeight: '600',
    },
});
