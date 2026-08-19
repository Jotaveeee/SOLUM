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
import { useState, useEffect, useRef } from 'react';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";

export default function Recover() {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);

  const inputs = useRef([]);

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

  const handleChange = (text, index) => {
    // Remove tudo que não for número
    const number = text.replace(/[^0-9]/g, '');

    const newCode = [...code];
    newCode[index] = number;
    setCode(newCode);

    // Se digitou um número, vai para o próximo campo
    if (number && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

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

          {/* Informações do email */}
          <View style={styles.emailInfo}>
            <Text style={styles.subtitulo}>
              Código enviado para o email
            </Text>

            <Text style={styles.subtitulo}>
              'email cadastrado'
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.container3}>

            <View style={styles.inputGroup}>

              {/* Título */}
              <Text style={styles.codeTitle}>
                Verifique seu email
              </Text>

              {/* Campos do código */}
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputs.current[index] = ref)}
                    style={styles.input}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

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

            {/* Botão VOLTAR */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.replace('Start')}
            >
              <Text style={styles.backButtonText}>
                VOLTAR
              </Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </KeyboardAvoidingView>
  );
} 