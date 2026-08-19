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

export default function Redefine() {
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
                        Redefina sua senha!
                    </Text>

                    {/* Formulário */}
                    <View style={styles.container3}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.subtitulo}>
                                Nova senha
                            </Text>

                            <TextInput
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.subtitulo}>
                                Digite novamente
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
                            <TouchableOpacity style={styles.button2} onPress={() => navigation.replace('Start')}>
                                <Text style={styles.buttonText2}>
                                    CONFIRMAR
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