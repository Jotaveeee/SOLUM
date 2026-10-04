import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import { API_URL } from '../../../services/api';
import styles from './styles';

export default function Start() {
  const navigation = useNavigation();

  const [fazendas, setFazendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [nomeConta, setNomeConta] = useState('');

  const carregarDados = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        setErro('Você precisa estar logado.');
        return;
      }

      // nome da conta (gravado no login)
      const usuarioJson = await SecureStore.getItemAsync('usuario');
      if (usuarioJson) {
        try {
          const usuario = JSON.parse(usuarioJson);
          setNomeConta(usuario?.nome || '');
        } catch {
          setNomeConta('');
        }
      }

      const resp = await fetch(`${API_URL}/fazenda/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        setErro(data.message || `Erro ao buscar fazendas (HTTP ${resp.status}).`);
        return;
      }

      setFazendas(data.fazendas || []);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar fazendas:', error);
      setErro('Não foi possível conectar à API.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const renderCaixa = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (erro) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{erro}</Text>
          <Text style={styles.emptySubtext}>Tente novamente mais tarde.</Text>
        </View>
      );
    }

    if (fazendas.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Não tem nenhuma fazenda adicionada.
          </Text>
          <Text style={styles.emptySubtext}>
            Crie uma fazenda para começar.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.fazendasBox}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.fazendasList}
        >
          {fazendas.map((fazenda) => (
            <TouchableOpacity
              key={fazenda.id}
              style={styles.fazendaCard}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Sensors', {
                  fazendaId: fazenda.id,
                  fazendaNome: fazenda.nome,
                })
              }
            >
              <Text style={styles.fazendaNome} numberOfLines={1}>
                {fazenda.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* CONTA */}
      <View style={styles.header}>
        <Text style={styles.ola}>Olá,</Text>

        <Text style={styles.nomeConta} numberOfLines={1}>
          {nomeConta || 'Bem-vindo'}
        </Text>
      </View>

      {/* ALERTAS */}
      <View style={styles.section}>
        <Text style={styles.tituloSecao}>Alertas</Text>

        <View style={styles.alertCard}>
          <Text style={styles.alertText}>
            Você não possui novos alertas.
          </Text>
        </View>
      </View>

      {/* FAZENDAS */}
      <View style={styles.fazendasSection}>

        <View style={styles.fazendasHeader}>
          <Text style={styles.tituloSecao}>Fazendas</Text>

          <TouchableOpacity
            style={styles.criarButton}
            onPress={() => navigation.replace('NewFazenda')}
          >
            <Text style={styles.criarButtonText}>Criar fazenda</Text>
          </TouchableOpacity>
        </View>

        {renderCaixa()}

      </View>

    </SafeAreaView>
  );
}