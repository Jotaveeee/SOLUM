import { StyleSheet, Platform } from 'react-native';

export const fontNames = {
  regular: 'PlusJakarta-Regular',
  bold: 'PlusJakarta-Bold',
};

export const styles = StyleSheet.create({
  tabBar: {
    // Transforma a barra em um menu flutuante moderno
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    
    // Altura ideal para acomodar ícone e texto confortavelmente
    height: 68,
    borderRadius: 16,
    backgroundColor: '#ffffff', // Fundo branco destaca mais a barra flutuante
    
    // Alinhamento interno
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8, // Ajuste para notch do iPhone
    
    // Remove bordas padrões
    borderTopWidth: 0,
    
    // Sombra suave para Android
    elevation: 8,
    
    // Sombra suave para iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  tabBarLabel: {
    fontFamily: fontNames.bold,
    fontSize: 12, // Tamanho ideal padrão de mercado para labels
    fontWeight: '600',
    marginTop: 4,
  },

  tabBarIconStyle: {
    marginBottom: -2,
  }
});

// Cores sugeridas para combinar com o novo design limpo
export const colors = {
  active: '#249057',   // Roxo/Índigo moderno para a aba selecionada
  inactive: '#9CA3AF', // Cinza neutro para abas secundárias
};