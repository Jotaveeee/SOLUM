import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Pressable,
} from 'react-native';

import { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';

import styles from './styles';

export default function Support() {

  const [tipoProblema, setTipoProblema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anexos, setAnexos] = useState([]);

  const [modalAnexo, setModalAnexo] = useState(false);

  const tiposProblema = [
    'Falha no sistema',
    'Problema com sensor',
    'Erro no aplicativo',
    'Outro',
  ];

  function selecionarTipo(tipo) {
    setTipoProblema(tipo);
  }

  async function escolherDaGaleria() {
    setModalAnexo(false);

    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à galeria para selecionar fotos e vídeos.'
        );
        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          allowsMultipleSelection: true,
          quality: 0.8,
        });

      if (!resultado.canceled) {
        setAnexos((anteriores) => [
          ...anteriores,
          ...resultado.assets,
        ]);
      }

    } catch (error) {
      console.error(
        'Erro ao selecionar arquivos:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível selecionar os arquivos.'
      );
    }
  }

  async function tirarFoto() {
    setModalAnexo(false);

    try {
      const permissao =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à câmera para tirar uma foto.'
        );
        return;
      }

      const resultado =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.8,
        });

      if (!resultado.canceled) {
        setAnexos((anteriores) => [
          ...anteriores,
          ...resultado.assets,
        ]);
      }

    } catch (error) {
      console.error(
        'Erro ao abrir câmera:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível abrir a câmera.'
      );
    }
  }

  async function gravarVideo() {
    setModalAnexo(false);

    try {
      const permissao =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à câmera para gravar um vídeo.'
        );
        return;
      }

      const resultado =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ['videos'],
          quality: 0.8,
        });

      if (!resultado.canceled) {
        setAnexos((anteriores) => [
          ...anteriores,
          ...resultado.assets,
        ]);
      }

    } catch (error) {
      console.error(
        'Erro ao gravar vídeo:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível gravar o vídeo.'
      );
    }
  }

  function adicionarAnexo() {
    setModalAnexo(true);
  }

  function removerAnexo(index) {
    setAnexos((anteriores) =>
      anteriores.filter(
        (_, i) => i !== index
      )
    );
  }

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

    try {

      const disponivel =
        await MailComposer.isAvailableAsync();

      if (!disponivel) {
        Alert.alert(
          'Erro',
          'Nenhum aplicativo de email está disponível neste dispositivo.'
        );
        return;
      }

      const arquivos =
        anexos.map(
          (arquivo) => arquivo.uri
        );

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
    ? `${anexos.length} arquivo(s) anexado(s).`
    : 'Nenhum anexo.'
}

Obrigado.
      `.trim();

      const resultado =
        await MailComposer.composeAsync({
          recipients: [
            'suporte@empresa.com',
          ],

          subject:
            `Nova ocorrência - ${tipoProblema}`,

          body:
            corpo,

          attachments:
            arquivos,
        });

      // Só limpa depois que o email for enviado
      if (resultado.status === 'sent') {

        setTipoProblema('');
        setDescricao('');
        setAnexos([]);

        Alert.alert(
          'Ocorrência enviada',
          'Sua ocorrência foi enviada com sucesso.'
        );
      }

    } catch (error) {

      console.error(
        'Erro ao enviar email:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível abrir o aplicativo de email.'
      );
    }
  }

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


            {/* DESCRIÇÃO */}

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
                    onPress={() =>
                      selecionarTipo(tipo)
                    }
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


              {/* LISTA DE ANEXOS */}

              {anexos.length > 0 && (

                <View style={styles.listaAnexos}>

                  {anexos.map((arquivo, index) => (

                    <View
                      key={
                        arquivo.assetId ||
                        arquivo.uri ||
                        index
                      }
                      style={styles.anexoItem}
                    >

                      <Text
                        style={styles.anexoNome}
                        numberOfLines={1}
                      >
                        {arquivo.fileName ||
                          `Arquivo ${index + 1}`}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          removerAnexo(index)
                        }
                        activeOpacity={0.7}
                      >

                        <Text
                          style={styles.anexoRemover}
                        >
                          ×
                        </Text>

                      </TouchableOpacity>

                    </View>

                  ))}

                </View>

              )}

              {anexos.length > 0 && (

                <Text style={styles.anexoQuantidade}>

                  {anexos.length === 1
                    ? '1 arquivo selecionado'
                    : `${anexos.length} arquivos selecionados`}

                </Text>

              )}

            </View>


            {/* ENVIAR */}

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


      {/* =========================
          MODAL DE MÍDIA
          ========================= */}

      <Modal
        visible={modalAnexo}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalAnexo(false)
        }
      >

        <Pressable
          style={styles.modalOverlay}
          onPress={() =>
            setModalAnexo(false)
          }
        >

          <Pressable
            style={styles.modalContainer}
            onPress={(event) =>
              event.stopPropagation()
            }
          >

            <Text style={styles.modalTitulo}>
              Adicionar mídia
            </Text>

            <Text style={styles.modalDescricao}>
              Como deseja adicionar?
            </Text>


            {/* TIRAR FOTO */}

            <TouchableOpacity
              style={styles.modalOpcao}
              onPress={tirarFoto}
              activeOpacity={0.8}
            >

              <Text style={styles.modalTexto}>
                Tirar foto
              </Text>

            </TouchableOpacity>


            {/* GRAVAR VÍDEO */}

            <TouchableOpacity
              style={styles.modalOpcao}
              onPress={gravarVideo}
              activeOpacity={0.8}
            >

              <Text style={styles.modalTexto}>
                Gravar vídeo
              </Text>

            </TouchableOpacity>


            {/* GALERIA */}

            <TouchableOpacity
              style={styles.modalOpcao}
              onPress={escolherDaGaleria}
              activeOpacity={0.8}
            >

              <Text style={styles.modalTexto}>
                Escolher da galeria
              </Text>

            </TouchableOpacity>


            {/* CANCELAR */}

            <TouchableOpacity
              style={styles.modalCancelar}
              onPress={() =>
                setModalAnexo(false)
              }
              activeOpacity={0.8}
            >

              <Text style={styles.modalCancelarTexto}>
                Cancelar
              </Text>

            </TouchableOpacity>

          </Pressable>

        </Pressable>

      </Modal>

    </KeyboardAvoidingView>
  );
}