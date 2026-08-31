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
import { useNavigation } from '@react-navigation/native';

import { API_URL } from '../../services/api';

export default function Register() {

  const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Dados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estado para o botão enquanto cadastra
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

  async function cadastrarUsuario() {

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {

      const url = `${API_URL}/auth/register`;

      console.log('================================');
      console.log('URL:', url);
      console.log('NOME:', nome);
      console.log('EMAIL:', email);
      console.log('================================');

      const response = await fetch(url, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha: senha,
        }),
      });

      console.log('STATUS:', response.status);
      console.log('CONTENT-TYPE:', response.headers.get('content-type'));

      const texto = await response.text();

      console.log('RESPOSTA:', texto);

      let data;

      try {
        data = JSON.parse(texto);
      } catch (error) {

        console.error(
          'A API não retornou JSON.'
        );

        Alert.alert(
          'Erro',
          `O servidor retornou uma resposta inesperada. Status: ${response.status}`
        );

        return;
      }

      if (!response.ok) {

        Alert.alert(
          'Erro',
          data.message || 'Erro ao cadastrar usuário.'
        );

        return;
      }

      Alert.alert(
        'Sucesso',
        'Usuário cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Start'),
          },
        ]
      );

    } catch (error) {

      console.error('ERRO DE CONEXÃO:', error);

      Alert.alert(
        'Erro',
        'Não foi possível conectar à API.'
      );
    }
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
            Crie sua conta!
          </Text>

          {/* Botões superiores */}
          <View style={styles.container2}>

            <TouchableOpacity
              style={[styles.button, styles.buttonDisabled]}
              onPress={() => navigation.replace('Start')}
            >
              <Text style={styles.buttonText}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              disabled={true}
            >
              <Text style={styles.buttonText3}>
                Criar conta
              </Text>
            </TouchableOpacity>

          </View>

          {/* Formulário */}
          <View style={styles.container3}>

            {/* Nome */}
            <View style={styles.inputGroup}>

              <Text style={styles.subtitulo}>
                Nome completo
              </Text>

              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite seu nome"
                autoCapitalize="words"
                autoCorrect={false}
              />

            </View>

            {/* Email */}
            <View style={styles.inputGroup}>

              <Text style={styles.subtitulo}>
                Email
              </Text>

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
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

              <TextInput
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                placeholder="Digite sua senha"
                secureTextEntry
                autoCapitalize="none"
              />

            </View>

            {/* Botão CRIAR CONTA */}
            <LinearGradient
              colors={['#249057', '#53BE70']}
              style={styles.gradiente}
            >

              <TouchableOpacity
                style={styles.button2}
                onPress={cadastrarUsuario}
                disabled={loading}
              >

                {loading ? (

                  <ActivityIndicator color="#FFFFFF" />

                ) : (

                  <Text style={styles.buttonText2}>
                    CRIAR CONTA →
                  </Text>

                )}

              </TouchableOpacity>

            </LinearGradient>

          </View>

        </View>

      </View>

    </KeyboardAvoidingView>
  );
}