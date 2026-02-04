import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

interface CustomModalProps {
    visible: boolean;
    type?: ModalType;
    title: string;
    message: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryPress?: () => void;
    onSecondaryPress?: () => void;
    onClose?: () => void;
}

const iconConfig: Record<ModalType, { name: keyof typeof Ionicons.glyphMap; colors: [string, string] }> = {
    success: { name: 'checkmark-circle', colors: ['#10B981', '#059669'] },
    error: { name: 'close-circle', colors: ['#EF4444', '#DC2626'] },
    warning: { name: 'warning', colors: ['#F59E0B', '#D97706'] },
    info: { name: 'information-circle', colors: ['#3B82F6', '#2563EB'] },
};

export function CustomModal({
    visible,
    type = 'info',
    title,
    message,
    primaryButtonText = 'OK',
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    onClose,
}: CustomModalProps) {
    const { name: iconName, colors } = iconConfig[type];

    const handlePrimaryPress = () => {
        onPrimaryPress?.();
        onClose?.();
    };

    const handleSecondaryPress = () => {
        onSecondaryPress?.();
        onClose?.();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            {/* Icon */}
                            <View style={styles.iconContainer}>
                                <LinearGradient
                                    colors={colors}
                                    style={styles.iconGradient}
                                >
                                    <Ionicons name={iconName} size={40} color="#fff" />
                                </LinearGradient>
                            </View>

                            {/* Content */}
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.message}>{message}</Text>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                {secondaryButtonText && (
                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        onPress={handleSecondaryPress}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[
                                        styles.primaryButton,
                                        !secondaryButtonText && styles.fullWidthButton,
                                    ]}
                                    onPress={handlePrimaryPress}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={type === 'error' ? ['#E94560', '#FF6B6B'] : colors}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.primaryButtonGradient}
                                    >
                                        <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 24,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 20,
    },
    iconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
    },
    fullWidthButton: {
        flex: 1,
    },
    primaryButtonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
});
