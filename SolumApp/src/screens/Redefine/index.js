import {
    Text,
    View,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';

import styles from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import PasswordInput from '../../components/PasswordInput';

export default function Redefine() {
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
                        Redefina sua senha!
                    </Text>

                    {/* Formulário */}
                    <View style={styles.container3}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.subtitulo}>
                                Nova senha
                            </Text>

                            <PasswordInput
                                inputStyle={styles.input}
                                placeholder="Digite a nova senha"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.subtitulo}>
                                Digite novamente
                            </Text>

                            <PasswordInput
                                inputStyle={styles.input}
                                placeholder="Digite novamente"
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

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
