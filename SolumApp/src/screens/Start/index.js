import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import styles, { fontNames } from './styles';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { API_URL } from '../../services/api';
import * as SecureStore from 'expo-secure-store';

export default function Start() {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

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

  async function fazerLogin() {

    if (!email.trim() || !senha.trim()) {

      Alert.alert(
        'Atenção',
        'Informe o e-mail e a senha.'
      );

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify({
            email: email.trim(),
            senha: senha,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        Alert.alert(
          'Erro',
          data.message || 'E-mail ou senha inválidos.'
        );

        return;
      }

      await SecureStore.setItemAsync(
        'token',
        data.token
      );

      await SecureStore.setItemAsync(
        'usuario',
        JSON.stringify(data.usuario)
      );

      navigation.replace('MainTabs');

    } catch (error) {

      console.error(
        'Erro ao fazer login:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível conectar à API.'
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

            <TouchableOpacity style={styles.button}
              disabled={true}
            >
              <Text style={styles.buttonText3}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonDisabled]} onPress={() => navigation.replace('Register')}>
              <Text style={styles.buttonText}>
                Criar conta
              </Text>
            </TouchableOpacity>

          </View>

          {/* Formulário */}
          <View style={styles.container3}>

            <View style={styles.inputGroup}>
              <Text style={styles.subtitulo}>
                Email
              </Text>

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(texto) =>
                  setEmail(texto.replace(/\s/g, ''))
                }
                placeholder="Digite seu email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.subtitulo}>
                Senha
              </Text>

              <TextInput
                style={styles.input}
                value={senha}
                onChangeText={(texto) =>
                  setSenha(texto.replace(/\s/g, ''))
                }
                placeholder="Digite sua senha"
                secureTextEntry
                autoCapitalize="none"
                maxLength={20}
              />
            </View>

            {/* Botão ENTRAR */}
            <LinearGradient
              colors={['#249057', '#53BE70']}
              style={styles.gradiente}
            >
              <TouchableOpacity
                style={styles.button2}
                onPress={fazerLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText2}>
                    ENTRAR →
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            {/* Recuperar senha */}
            <View style={styles.container4}>
              <Text style={styles.rodape}>
                Esqueceu a senha?
              </Text>

              <TouchableOpacity onPress={() => navigation.replace('Recover')}>
                <Text style={styles.rodape2}>
                  Recuperar senha
                </Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>

      </View>
    </KeyboardAvoidingView>
  );
}