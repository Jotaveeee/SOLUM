import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../services/api';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

export default function FazendasScreen({ navigation }) {
  const [fazendas, setFazendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);

  const carregarFazendas = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        setErro('Você precisa estar logado.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const resp = await fetch(`${API_URL}/fazenda/me`, { headers });
      const data = await resp.json();

      if (!resp.ok) {
        setErro(data.message || 'Erro ao buscar fazendas.');
        return;
      }

      setFazendas(data.fazendas);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Não foi possível conectar à API.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarFazendas();
    }, [])
  );

  const confirmarExclusao = async (fazenda) => {
    try {
      setExcluindoId(fazenda.id);

      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado.');
        return;
      }

      const resp = await fetch(`${API_URL}/fazenda/${fazenda.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      // se vier HTML (ex.: "Cannot DELETE"), não quebra o app
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        Alert.alert(
          'Erro',
          data.message || `Não foi possível excluir (HTTP ${resp.status}).`
        );
        return;
      }

      await carregarFazendas();
    } catch (error) {
      console.error('Erro ao excluir fazenda:', error);
      Alert.alert('Erro', 'Não foi possível conectar à API.');
    } finally {
      setExcluindoId(null);
    }
  };

  const excluirFazenda = (fazenda) => {
    Alert.alert(
      'Excluir fazenda',
      `Isso apagará a fazenda "${fazenda.nome}", seus sensores e todas as leituras. Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmarExclusao(fazenda),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('MainTabs')}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titulo}>Minhas fazendas</Text>
          <Text style={styles.subtitulo}>Acompanhe as suas fazendas!</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 40 }} />
        ) : erro ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>
            {erro}
          </Text>
        ) : fazendas.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>
            Nenhuma fazenda cadastrada ainda.
          </Text>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {fazendas.map((fazenda) => (
              <View key={fazenda.id} style={[styles.card, styles.cardRow]}>
                <TouchableOpacity
                  style={styles.cardInfo}
                  onPress={() =>
                    navigation.navigate('Sensors', {
                      fazendaId: fazenda.id,
                      fazendaNome: fazenda.nome,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.sensorNome} numberOfLines={1}>
                    {fazenda.nome}
                  </Text>
                  <Text style={styles.sensorTipo} numberOfLines={1}>
                    Criada em {new Date(fazenda.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => excluirFazenda(fazenda)}
                  disabled={excluindoId === fazenda.id}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}
                >
                  {excluindoId === fazenda.id ? (
                    <ActivityIndicator size="small" color="#D93636" />
                  ) : (
                    <Ionicons name="trash-outline" size={20} color="#D93636" />
                  )}
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.bottomSpace} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}