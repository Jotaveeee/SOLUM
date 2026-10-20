import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../../services/api';
import styles from './styles';

export default function Perfil({ navigation }) {
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [nomeEditado, setNomeEditado] = useState('');
  const [modalNomeVisivel, setModalNomeVisivel] = useState(false);
  const [salvandoNome, setSalvandoNome] = useState(false);
  const [excluindoConta, setExcluindoConta] = useState(false);
  const [fazendasCount, setFazendasCount] = useState(0);
  const [sensoresCount, setSensoresCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarResumo() {
        try {
          const [usuarioJson, token, notificacoesSalvas] = await Promise.all([
            SecureStore.getItemAsync('usuario'),
            SecureStore.getItemAsync('token'),
            SecureStore.getItemAsync('notificacoesAtivadas'),
          ]);
          const usuario = usuarioJson ? JSON.parse(usuarioJson) : {};
          if (ativo) {
            setEmail(usuario?.email || '');
            setNome(usuario?.nome || '');
            setNotificacoesAtivadas(notificacoesSalvas !== 'false');
          }
          if (!token) return;

          const headers = { Authorization: `Bearer ${token}` };
          const [fazendasResp, sensoresResp] = await Promise.all([
            fetch(`${API_URL}/fazenda/me`, { headers }),
            fetch(`${API_URL}/devices/me`, { headers }),
          ]);
          const [fazendasData, sensoresData] = await Promise.all([
            fazendasResp.json().catch(() => ({})),
            sensoresResp.json().catch(() => ({})),
          ]);
          if (!ativo) return;
          if (fazendasResp.ok) setFazendasCount((fazendasData.fazendas || []).length);
          if (sensoresResp.ok) setSensoresCount((sensoresData.dispositivos || []).length);
        } catch (error) {
          console.error('Erro ao carregar resumo do perfil:', error);
        }
      }

      carregarResumo();
      return () => { ativo = false; };
    }, [])
  );

  const alterarNotificacoes = async (ativadas) => {
    try {
      await SecureStore.setItemAsync('notificacoesAtivadas', String(ativadas));
      setNotificacoesAtivadas(ativadas);
    } catch (error) {
      console.error('Erro ao salvar preferência de notificações:', error);
      Alert.alert('Erro', 'Não foi possível salvar essa preferência.');
    }
  };

  const abrirEdicaoNome = () => {
    setNomeEditado(nome);
    setModalNomeVisivel(true);
  };

  const salvarNome = async () => {
    const novoNome = nomeEditado.trim();
    if (!novoNome) {
      Alert.alert('Nome inválido', 'Informe um nome para a conta.');
      return;
    }

    setSalvandoNome(true);
    try {
      const usuarioJson = await SecureStore.getItemAsync('usuario');
      const usuario = usuarioJson ? JSON.parse(usuarioJson) : {};
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Alert.alert('Sessão expirada', 'Entre novamente para alterar o nome da conta.');
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ nome: novoNome }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        Alert.alert('Não foi possível alterar o nome', data.message || 'Tente novamente.');
        return;
      }

      const usuarioAtualizado = data.usuario || { ...usuario, nome: novoNome };
      await SecureStore.setItemAsync('usuario', JSON.stringify(usuarioAtualizado));
      setNome(usuarioAtualizado.nome);
      setModalNomeVisivel(false);
    } catch (error) {
      console.error('Erro ao salvar nome do perfil:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. O nome não foi alterado.');
    } finally {
      setSalvandoNome(false);
    }
  };

  const handleLogout = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync('token'),
        SecureStore.deleteItemAsync('usuario'),
      ]);
      navigation.replace('Start');
    } catch (error) {
      console.error('Erro ao limpar dados da conta:', error);
      Alert.alert('Erro', 'Não foi possível limpar os dados da conta. Tente novamente.');
    }
  };

  const excluirConta = () => {
    Alert.alert(
      'Excluir conta permanentemente?',
      'Sua conta, fazendas, sensores cadastrados, leituras e alertas serão apagados. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir conta',
          style: 'destructive',
          onPress: confirmarExclusaoConta,
        },
      ]
    );
  };

  const confirmarExclusaoConta = async () => {
    setExcluindoConta(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Alert.alert('Sessão expirada', 'Entre novamente para excluir a conta.');
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        Alert.alert('Não foi possível excluir a conta', data.message || 'Tente novamente.');
        return;
      }

      try {
        await Promise.all([
          SecureStore.deleteItemAsync('token'),
          SecureStore.deleteItemAsync('usuario'),
        ]);
      } catch (error) {
        console.error('Erro ao limpar dados locais após exclusão:', error);
      }
      navigation.replace('Start');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. A conta não foi excluída.');
    } finally {
      setExcluindoConta(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerSubtitle}>CONTA</Text>
            <Text style={styles.headerTitle}>Perfil</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {nome.split(/\s+/).filter(Boolean).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase() || '??'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{nome || 'Nome não informado'}</Text>
              <TouchableOpacity
                style={[styles.tag, excluindoConta && styles.deleteButtonDisabled]}
                activeOpacity={0.8}
                onPress={excluirConta}
                disabled={excluindoConta}
                accessibilityRole="button"
              >
                <Ionicons name="trash-outline" size={15} color="#EB5757" />
                <Text style={styles.tagText}>{excluindoConta ? 'Excluindo…' : 'Excluir conta'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={abrirEdicaoNome} accessibilityLabel="Alterar nome">
            <Ionicons name="create-outline" size={22} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>FAZENDAS</Text>
            <Text style={styles.statValue}>{fazendasCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SENSORES</Text>
            <Text style={styles.statValue}>{sensoresCount}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações da conta</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <Ionicons name="mail-outline" size={16} color="#8E8E93" style={styles.icon} />
              <Text style={styles.infoLabel}>E-mail</Text>
            </View>
            <Text style={styles.infoValue} numberOfLines={1}>{email || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <Ionicons name="lock-closed-outline" size={16} color="#8E8E93" style={styles.icon} />
              <Text style={styles.infoLabel}>Senha</Text>
            </View>
            <Text style={styles.infoValue}>••••••••</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notificações no celular</Text>
              <Text style={styles.settingSubtitle}>Ative ou desative notificações do app no dispositivo</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5EA', true: '#27AE60' }}
              thumbColor="#FFFFFF"
              onValueChange={alterarNotificacoes}
              value={notificacoesAtivadas}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>↪ Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalNomeVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalNomeVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Alterar nome</Text>
            <TextInput
              style={styles.nameInput}
              value={nomeEditado}
              onChangeText={(texto) => setNomeEditado(texto.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
              placeholder="Digite seu nome"
              autoCapitalize="words"
              autoFocus
              maxLength={20}
              returnKeyType="done"
              onSubmitEditing={salvarNome}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalNomeVisivel(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={salvarNome} disabled={salvandoNome}>
                <Text style={styles.modalSaveText}>{salvandoNome ? 'Salvando…' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
