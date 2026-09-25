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

import styles from './styles';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";

export default function NewFazenda() {
    const navigation = useNavigation();

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
                        Crie sua Fazenda
                    </Text>

                    {/* Formulário */}
                    <View style={styles.container3}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.subtitulo}>
                                Nome da fazenda
                            </Text>

                            <TextInput
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.subtitulo}>
                                Adicione um sensor
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
                            <TouchableOpacity style={styles.button2} onPress={() => navigation.replace('Sensors')}>
                                <Text style={styles.buttonText2}>
                                    CONFIRMAR
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        {/* Botão VOLTAR */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.replace('MainTabs')}
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