import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import styles, { fontNames } from './styles';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";

export default function Register() {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          [fontNames.regular]: require('../../assets/fonts/PlusJakartaSans-Regular.ttf'),
          [fontNames.bold]: require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
        });

        setFontsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar fontes:', error);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>

        <View style={styles.content}>

          {/* Logo */}
          <Image
            source={require('../../assets/logosolum.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Título */}
          <Text style={styles.titulo}>
            Bem Vindo de volta!
          </Text>

          {/* Botões */}
          <View style={styles.container2}>

            <TouchableOpacity style={[styles.button, styles.buttonDisabled]} onPress={() => navigation.replace('Start')}>
              <Text style={styles.buttonText}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}
              disabled={true}
            >
              <Text style={styles.buttonText3}>
                Criar conta
              </Text>
            </TouchableOpacity>

          </View>

          {/* Formulário */}
          <View style={styles.container3}>

            <View style={styles.inputGroup}>
              <Text style={styles.subtitulo}>
                Nome completo
              </Text>

              <TextInput
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.subtitulo}>
                Fazenda
              </Text>

              <TextInput
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.subtitulo}>
                Email
              </Text>

              <TextInput
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.subtitulo}>
                Senha
              </Text>

              <TextInput
                style={styles.input}
                secureTextEntry
              />
            </View>

            {/* Botão ENTRAR */}
            <LinearGradient
              colors={['#249057', '#53BE70']}
              style={styles.gradiente}
            >
              <TouchableOpacity style={styles.button2}>
                <Text style={styles.buttonText2}>
                  ENTRAR →
                </Text>
              </TouchableOpacity>
            </LinearGradient>

          </View>

        </View>

      </View>
    </KeyboardAvoidingView>
  );
}