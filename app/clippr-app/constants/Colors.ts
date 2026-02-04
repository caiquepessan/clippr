// Clippr - Paleta de cores premium para barbearia
const tintColorLight = '#E94560';
const tintColorDark = '#E94560';

export const Colors = {
  // Cores principais
  primary: '#1A1A2E',
  secondary: '#E94560',
  accent: '#FFD700',

  // Fundos
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceLight: '#252542',

  // Texto
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#6B6B80',

  // Estados
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Gradientes (para uso em LinearGradient)
  gradientPrimary: ['#1A1A2E', '#0F0F1A'],
  gradientAccent: ['#E94560', '#FF6B6B'],
  gradientGold: ['#FFD700', '#FFA500'],

  // Bordas
  border: '#2A2A4A',
  borderLight: '#3A3A5A',

  // Temas para compatibilidade com o template
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#0F0F1A',
    tint: tintColorDark,
    tabIconDefault: '#6B6B80',
    tabIconSelected: tintColorDark,
  },
};

export default Colors;
