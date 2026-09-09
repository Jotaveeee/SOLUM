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

import styles from './styles';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { API_URL } from '../../services/api';

export default function Register() {

  const navigation = useNavigation();

  // Dados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estado para o botão enquanto cadastra
  const [loading, setLoading] = useState(false);

  async function cadastrarUsuario() {

    if (!nome.trim() || !email.trim() || !senha.trim()) {

      Alert.alert(
        'Atenção',
        'Preencha todos os campos.'
      );

      return;
    }

    if (senha.length < 8) {

      Alert.alert(
        'Senha inválida',
        'A senha deve ter no mínimo 8 caracteres.'
      );

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
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
        }
      );

      const data = await response.json();

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
            onPress: () => navigation.replace('MainTabs'),
          },
        ]
      );

    } catch (error) {

      console.error(
        'Erro ao cadastrar usuário:',
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
                Nome
              </Text>

              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={(texto) =>
                  setNome(texto.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))
                }
                placeholder="Digite seu nome"
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={20}
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
                onChangeText={(texto) => setEmail(texto.replace(/\s/g, ''))}
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
                onChangeText={(texto) => setSenha(texto.replace(/\s/g, ''))}
                placeholder="Digite sua senha"
                secureTextEntry
                autoCapitalize="none"
                maxLength={20}
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