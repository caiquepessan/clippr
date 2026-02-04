import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TimeSlot as TimeSlotType } from '@/types';

interface TimeSlotProps {
    slot: TimeSlotType;
    onPress: () => void;
    selected?: boolean;
}

export function TimeSlot({ slot, onPress, selected = false }: TimeSlotProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={!slot.available}
            style={[
                styles.container,
                selected && styles.selected,
                !slot.available && styles.unavailable,
            ]}
        >
            <Text
                style={[
                    styles.time,
                    selected && styles.timeSelected,
                    !slot.available && styles.timeUnavailable,
                ]}
            >
                {slot.time}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        minWidth: 75,
        alignItems: 'center',
        margin: 4,
    },
    selected: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    unavailable: {
        backgroundColor: Colors.surfaceLight,
        opacity: 0.5,
    },
    time: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    timeSelected: {
        color: '#fff',
    },
    timeUnavailable: {
        color: Colors.textMuted,
        textDecorationLine: 'line-through',
    },
});
