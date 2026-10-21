import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';

import styles, { fontNames } from './styles';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../services/api';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import PasswordInput from '../../components/PasswordInput';

export default function Start() {
  const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [tecladoAberto, setTecladoAberto] = useState(false);

  // Carregar fontes
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
        // Usa as fontes padrão do sistema se as fontes personalizadas falharem.
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  // Detectar abertura e fechamento do teclado
  useEffect(() => {
    const eventoMostrar = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTecladoAberto(true);
      }
    );

    const eventoEsconder = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTecladoAberto(false);
      }
    );

    return () => {
      eventoMostrar.remove();
      eventoEsconder.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  // Fazer login
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
      {/* Botão de suporte: oculto enquanto o teclado estiver aberto */}
      {!tecladoAberto && (
        <TouchableOpacity
          style={styles.botaoSuporte}
          onPress={() => navigation.navigate('SupportS')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="help-circle-outline"
            size={26}
            color="#249057"
          />
        </TouchableOpacity>
      )}

      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
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

          {/* Botões Entrar e Criar conta */}
          <View style={styles.container2}>
            <TouchableOpacity
              style={styles.button}
              disabled={true}
            >
              <Text style={styles.buttonText3}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonDisabled]}
              onPress={() => navigation.replace('Register')}
            >
              <Text style={styles.buttonText}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <View style={styles.container3}>

            {/* E-mail */}
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
                placeholderTextColor="#4A4A4A"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.subtitulo}>
                Senha
              </Text>

              <PasswordInput
                inputStyle={styles.input}
                value={senha}
                onChangeText={(texto) =>
                  setSenha(texto.replace(/\s/g, ''))
                }
                placeholder="Digite sua senha"
                maxLength={20}
              />
            </View>

            {/* Botão Entrar */}
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
                    ENTRAR
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            {/* Recuperar senha */}
            <View style={styles.container4}>
              <Text style={styles.rodape}>
                Esqueceu a senha?
              </Text>

              <TouchableOpacity
                onPress={() => navigation.replace('EmailRecover')}
              >
                <Text style={styles.rodape2}>
                  Recuperar senha
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
