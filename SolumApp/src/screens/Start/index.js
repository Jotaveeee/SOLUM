import { Text, View, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import styles, { fontNames } from './styles';
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  const navigation = useNavigation();

  // Carregar fontes
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // As chaves DEVEM bater com as constantes em styles.js
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
    <View style={styles.container}>
      <Image source={require('../../assets/logosolum.png')} style={styles.logo} />

      <Text style={styles.titulo}>Bem Vindo de volta!</Text>

      <View style={styles.container2}>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText3}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.button}
        disabled={true}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.container3}>

        <Text style={styles.subtitulo}>Email</Text>
        <TextInput style={styles.input} />

        <Text style={styles.subtitulo}>Senha</Text>
        <TextInput style={styles.input} />

        <LinearGradient
          colors={['#249057', '#53BE70']}
          style={styles.gradiente}
        >
          <TouchableOpacity style={styles.button2}>
            <Text style={styles.buttonText2}>ENTRAR</Text>
          </TouchableOpacity>
        </LinearGradient>

      </View>

      <View style={styles.container4}>
        <Text style={styles.rodape}>Esqueceu a senha?</Text>

        <TouchableOpacity>
          <Text style={styles.rodape2}>Recuperar senha</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}