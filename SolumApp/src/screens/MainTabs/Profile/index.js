import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../../services/api';
import styles from './styles';

export default function Perfil({ navigation }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [criticalEnabled, setCriticalEnabled] = useState(true);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [nomeEditado, setNomeEditado] = useState('');
  const [modalNomeVisivel, setModalNomeVisivel] = useState(false);
  const [salvandoNome, setSalvandoNome] = useState(false);
  const [fazendasCount, setFazendasCount] = useState(0);
  const [sensoresCount, setSensoresCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarResumo() {
        try {
          const [usuarioJson, token] = await Promise.all([
            SecureStore.getItemAsync('usuario'),
            SecureStore.getItemAsync('token'),
          ]);
          const usuario = usuarioJson ? JSON.parse(usuarioJson) : {};
          if (ativo) {
            setEmail(usuario?.email || '');
            setNome(usuario?.nome || '');
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

  const handleLogout = () => {
    navigation.navigate('Register');
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
              <Text style={styles.profileFarm}>Fazenda Santa Clara</Text>
              <TouchableOpacity style={styles.tag} activeOpacity={0.8}>
                <Ionicons name="trash-outline" size={15} color="#EB5757" />
                <Text style={styles.tagText}>Excluir conta</Text>
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
              <Text style={styles.settingTitle}>Notificações push</Text>
              <Text style={styles.settingSubtitle}>Receba avisos no celular</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5EA', true: '#27AE60' }}
              thumbColor="#FFFFFF"
              onValueChange={setPushEnabled}
              value={pushEnabled}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Somente alertas críticos</Text>
              <Text style={styles.settingSubtitle}>Silencia avisos informativos</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5EA', true: '#27AE60' }}
              thumbColor="#FFFFFF"
              onValueChange={setCriticalEnabled}
              value={criticalEnabled}
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
              onChangeText={setNomeEditado}
              placeholder="Digite seu nome"
              autoCapitalize="words"
              autoFocus
              maxLength={80}
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

      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Início</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>📡</Text>
          <Text style={styles.navText}>Sensores</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navText}>Alertas</Text>
        </View>
        <View style={styles.navItemActive}>
          <Text style={styles.navIconActive}>👤</Text>
          <Text style={styles.navTextActive}>Perfil</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
