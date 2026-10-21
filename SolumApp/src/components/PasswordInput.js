import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordInput({
  inputStyle,
  containerStyle,
  ...inputProps
}) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...inputProps}
        placeholderTextColor={inputProps.placeholderTextColor ?? '#4A4A4A'}
        style={[inputStyle, styles.input]}
        secureTextEntry={!senhaVisivel}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={styles.botaoOlho}
        onPress={() => setSenhaVisivel((visivel) => !visivel)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
        accessibilityState={{ selected: senhaVisivel }}
      >
        <Ionicons
          name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
          size={21}
          color="#6B7280"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 90,
    backgroundColor: '#e2e2e2',
  },
  input: {
    flex: 1,
    height: '100%',
    width: undefined,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingLeft: 20,
    paddingRight: 8,
    fontSize: 14,
  },
  botaoOlho: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
