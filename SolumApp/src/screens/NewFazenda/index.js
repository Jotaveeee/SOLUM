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
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../services/api';

export default function NewFazenda() {
    const navigation = useNavigation();

    const [nomeFazenda, setNomeFazenda] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [loading, setLoading] = useState(false);

    async function criarFazendaEDispositivo() {

        if (!nomeFazenda.trim() || !deviceId.trim()) {
            Alert.alert('Atenção', 'Preencha o nome da fazenda e o ID do sensor.');
            return;
        }

        setLoading(true);

        try {
            const token = await SecureStore.getItemAsync('token');

            if (!token) {
                Alert.alert('Erro', 'Você precisa estar logado.');
                return;
            }

            const response = await fetch(`${API_URL}/devices/criar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    deviceId: deviceId.trim(),
                    fazendaNome: nomeFazenda.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Erro', data.message || 'Não foi possível criar o dispositivo.');
                return;
            }

            // Mostra a apiKey pro usuário copiar e colocar no código do ESP32
            Alert.alert(
                'Dispositivo criado!',
                `Guarde essa chave, ela só aparece uma vez:\n\n${data.apiKey}`,
                [
                    {
                        text: 'OK, copiei',
                        onPress: () => navigation.replace('Sensors'),
                    },
                ]
            );

        } catch (error) {
            console.error('Erro ao criar dispositivo:', error);
            Alert.alert('Erro', 'Não foi possível conectar à API.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>

                <View style={styles.content}>

                    <Image
                        source={require('../../assets/logosolum.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.titulo}>
                        Crie sua Fazenda
                    </Text>

                    <View style={styles.container3}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.subtitulo}>
                                Nome da fazenda
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={nomeFazenda}
                                onChangeText={setNomeFazenda}
                                autoCapitalize="words"
                                placeholder="Ex: Fazenda Boa Esperança"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.subtitulo}>
                                Adicione um sensor
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={deviceId}
                                onChangeText={setDeviceId}
                                autoCapitalize="none"
                                placeholder="Ex: esp32-001"
                            />
                        </View>

                        <LinearGradient
                            colors={['#249057', '#53BE70']}
                            style={styles.gradiente}
                        >
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={criarFazendaEDispositivo}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.buttonText2}>
                                        CONFIRMAR
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </LinearGradient>

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