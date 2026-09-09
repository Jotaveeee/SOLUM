import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';

import { useState } from 'react';
import styles from './styles';
export default function Support() {

  const [tipoProblema, setTipoProblema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anexos, setAnexos] = useState([]);
  
  /*
   * TIPOS DE PROBLEMA
   */

  const tiposProblema = [
    'Falha no sistema',
    'Problema com sensor',
    'Erro no aplicativo',
    'Problema no cadastro',
    'Outro',
  ];


  /*
   * SELECIONAR TIPO
   */

  function selecionarTipo(tipo) {
    setTipoProblema(tipo);
  }


  /*
   * ADICIONAR FOTO / VÍDEO
   */

  function adicionarAnexo() {

    Alert.alert(
      'Adicionar mídia',
      'Aqui será aberta a câmera ou a galeria para selecionar fotos e vídeos.'
    );

  }


  /*
   * ENVIAR EMAIL
   */

  async function enviarEmail() {

    if (!descricao.trim()) {

      Alert.alert(
        'Atenção',
        'Descreva o problema.'
      );

      return;
    }


    if (!tipoProblema) {

      Alert.alert(
        'Atenção',
        'Selecione o tipo de problema.'
      );

      return;
    }


    const emailEmpresa = 'suporte@empresa.com';


    const assunto =
      `Nova ocorrência - ${tipoProblema}`;


    const corpo = `
Olá, equipe de suporte.

Gostaria de relatar uma ocorrência.

TIPO DE PROBLEMA:
${tipoProblema}

DESCRIÇÃO DO PROBLEMA:
${descricao}

ANEXOS:
${
  anexos.length > 0
    ? `${anexos.length} arquivo(s) selecionado(s).`
    : 'Nenhum anexo.'
}

Obrigado.
    `.trim();


    const url =
      `mailto:${emailEmpresa}` +
      `?subject=${encodeURIComponent(assunto)}` +
      `&body=${encodeURIComponent(corpo)}`;


    try {

      const podeAbrir =
        await Linking.canOpenURL(url);


      if (!podeAbrir) {

        Alert.alert(
          'Erro',
          'Não foi possível abrir o aplicativo de email.'
        );

        return;
      }


      await Linking.openURL(url);


    } catch (error) {

      console.error(
        'Erro ao abrir email:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível abrir o aplicativo de email.'
      );

    }

  }


  /*
   * TELA
   */

  return (

    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.container}>

          <View style={styles.content}>


            {/* TÍTULO */}

            <Text style={styles.titulo}>
              Nova Ocorrência
            </Text>

            <Text style={styles.descricaoTitulo}>
              Relate falhas e anomalias
            </Text>


            {/* DESCRIÇÃO DO PROBLEMA */}

            <View style={styles.inputGroup}>

              <Text style={styles.subtitulo}>
                Descrição do Problema
              </Text>

              <TextInput
                style={styles.inputDescricaoGrande}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva o problema com mais detalhes..."
                placeholderTextColor="#777"
                multiline
                textAlignVertical="top"
              />

            </View>


            {/* TIPO DE PROBLEMA */}

            <View style={styles.inputGroup}>

              <Text style={styles.subtitulo}>
                Tipo de Problema
              </Text>


              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tipoContainer}
              >

                {tiposProblema.map((tipo) => (

                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.tipoButton,
                      tipoProblema === tipo &&
                      styles.tipoButtonSelecionado,
                    ]}
                    onPress={() => selecionarTipo(tipo)}
                    activeOpacity={0.8}
                  >

                    <Text
                      style={[
                        styles.tipoText,
                        tipoProblema === tipo &&
                        styles.tipoTextSelecionado,
                      ]}
                    >
                      {tipo}
                    </Text>

                  </TouchableOpacity>

                ))}

              </ScrollView>

            </View>


            {/* ANEXOS */}

            <View style={styles.inputGroup}>

              <Text style={styles.subtitulo}>
                Envie fotos e vídeos
              </Text>


              <TouchableOpacity
                style={styles.anexoButton}
                onPress={adicionarAnexo}
                activeOpacity={0.8}
              >

                <Text style={styles.anexoIcon}>
                  +
                </Text>

                <Text style={styles.anexoText}>
                  Adicionar fotos ou vídeos
                </Text>

              </TouchableOpacity>


              {anexos.length > 0 && (

                <Text style={styles.anexoQuantidade}>
                  {anexos.length} arquivo(s) selecionado(s)
                </Text>

              )}

            </View>


            {/* ENVIAR PELO EMAIL */}

            <View style={styles.inputGroup}>

              <Text style={styles.subtitulo}>
                Enviar pelo email
              </Text>


              <TouchableOpacity
                style={styles.enviarButton}
                onPress={enviarEmail}
                activeOpacity={0.8}
              >

                <Text style={styles.enviarButtonText}>
                  Enviar ocorrência
                </Text>

              </TouchableOpacity>

            </View>


          </View>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>

  );
}