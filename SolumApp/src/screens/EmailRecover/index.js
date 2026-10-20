import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';

import styles from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";

export default function EmailRecover() {
    const navigation = useNavigation();

    return (
        <KeyboardAvoidingView
            style={styles.keyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
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
                        Digite o Email da sua conta!
                    </Text>

                    {/* Formulário */}
                    <View style={styles.container3}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.subtitulo}>
                                Email
                            </Text>

                            <TextInput
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Botão CONFIRMAR */}
                        <LinearGradient
                            colors={['#249057', '#53BE70']}
                            style={styles.gradiente}
                        >
                            <TouchableOpacity style={styles.button2} onPress={() => navigation.replace('Recover')}>
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

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
