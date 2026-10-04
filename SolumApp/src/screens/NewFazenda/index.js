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
    const [loading, setLoading] = useState(false);

    async function criarFazenda() {
        const nome = nomeFazenda.trim();

        if (!nome) {
            Alert.alert('Atenção', 'Preencha o nome da fazenda.');
            return;
        }

        setLoading(true);

        try {
            const token = await SecureStore.getItemAsync('token');

            if (!token) {
                Alert.alert('Erro', 'Você precisa estar logado.');
                return;
            }

            const response = await fetch(`${API_URL}/fazenda/criar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ nome }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                Alert.alert(
                    'Erro',
                    data.message || `Não foi possível criar a fazenda (HTTP ${response.status}).`
                );
                return;
            }

            if (!data.fazenda?.id) {
                Alert.alert('Erro', 'Resposta inesperada da API.');
                return;
            }

            navigation.replace('Sensors', {
                fazendaId: data.fazenda.id,
                fazendaNome: data.fazenda.nome,
            });

        } catch (error) {
            console.error('Erro ao criar fazenda:', error);
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
                        Nova Fazenda
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
                                returnKeyType="done"
                                onSubmitEditing={criarFazenda}
                            />
                        </View>

                        <LinearGradient
                            colors={['#249057', '#53BE70']}
                            style={styles.gradiente}
                        >
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={criarFazenda}
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
                            disabled={loading}
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