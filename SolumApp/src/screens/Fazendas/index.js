import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../services/api';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

export default function FazendasScreen({ navigation }) {
  const [fazendas, setFazendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarFazendas = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        setErro('Você precisa estar logado.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const respFazendas = await fetch(`${API_URL}/fazenda/me`, { headers });

      const dataFazendas = await respFazendas.json();

      if (respFazendas.status === 404) {
        setFazendas([]);
        setErro(null);
        return;
      }
      
      if (!respFazendas.ok) {
        setErro(dataFazendas.message || 'Erro ao buscar fazendas.');
        return;
      }

      setFazendas(dataFazendas.fazendas);
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
          <Text style={styles.subtitulo}>
            Acompanhe as suas fazendas!
          </Text>
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
            {fazendas.map((fazenda) => {
              return (
                <View key={fazenda.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.sensorTitleContainer}>
                      <Text style={styles.sensorNome} numberOfLines={1}>
                        {fazenda.nome}
                      </Text>
                      <Text style={styles.sensorTipo} numberOfLines={1}>
                        Criada em {new Date(fazenda.createdAt).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}

            <View style={styles.bottomSpace} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}