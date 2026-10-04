import React, { useState, useEffect } from 'react';
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

export default function SensoresScreen({ navigation, route }) {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);

  const fazendaId = route.params?.fazendaId;
  const fazendaNome = route.params?.fazendaNome;

  const calcularStatus = (umidade) => {
    if (umidade === null || umidade === undefined) return 'Normal';
    if (umidade < 20) return 'Alerta máximo';
    if (umidade < 40) return 'Atenção';
    return 'Normal';
  };

  const carregarDados = async () => {
    try {
      if (!fazendaId) {
        setErro('Fazenda não informada.');
        return;
      }

      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        setErro('Você precisa estar logado.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [respDispositivos, respLeituras] = await Promise.all([
        fetch(`${API_URL}/devices/me?fazenda=${fazendaId}`, { headers }),
        fetch(`${API_URL}/leituras/me`, { headers }),
      ]);

      const dataDispositivos = await respDispositivos.json().catch(() => ({}));
      const dataLeituras = await respLeituras.json().catch(() => ({}));

      if (!respDispositivos.ok) {
        setErro(dataDispositivos.message || 'Erro ao buscar dispositivos.');
        return;
      }

      const leituras = respLeituras.ok ? dataLeituras.leituras || [] : [];

      const listaCompleta = (dataDispositivos.dispositivos || []).map((dispositivo) => {
        const leituraMaisRecente = leituras.find(
          (leitura) => leitura.dispositivo === dispositivo.id
        );

        return {
          id: dispositivo.id,
          nome: dispositivo.deviceId,
          local: dispositivo.fazenda?.nome || fazendaNome || 'Sem fazenda',
          umidade: leituraMaisRecente ? `${leituraMaisRecente.umidadeSolo}%` : '--',
          temperatura: leituraMaisRecente ? `${leituraMaisRecente.temperatura}°C` : '--',
          status: calcularStatus(leituraMaisRecente?.umidadeSolo),
        };
      });

      setDispositivos(listaCompleta);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Não foi possível conectar à API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 5000);
    return () => clearInterval(interval);
  }, [fazendaId]);

  const confirmarExclusao = async (dispositivo) => {
    try {
      setExcluindoId(dispositivo.id);

      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado.');
        return;
      }

      const resp = await fetch(`${API_URL}/devices/${dispositivo.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        Alert.alert(
          'Erro',
          data.message || `Não foi possível excluir (HTTP ${resp.status}).`
        );
        return;
      }

      await carregarDados();
    } catch (error) {
      console.error('Erro ao excluir sensor:', error);
      Alert.alert('Erro', 'Não foi possível conectar à API.');
    } finally {
      setExcluindoId(null);
    }
  };

  const excluirSensor = (dispositivo) => {
    Alert.alert(
      'Excluir sensor',
      `Isso apagará o sensor "${dispositivo.nome}" e todas as leituras dele. Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmarExclusao(dispositivo),
        },
      ]
    );
  };

  const abrirDetalhes = (dispositivo) => {
    console.log('Detalhes do dispositivo:', dispositivo);
    // navigation.navigate('DetalhesPrototipo', { dispositivo });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Alerta máximo':
        return {
          status: styles.statusAlertaMaximo,
          statusText: styles.statusTextAlertaMaximo,
          bolinha: styles.bolinhaAlertaMaximo,
        };
      case 'Atenção':
        return {
          status: styles.statusAtencao,
          statusText: styles.statusTextAtencao,
          bolinha: styles.bolinhaAtencao,
        };
      default:
        return {
          status: styles.statusNormal,
          statusText: styles.statusTextNormal,
          bolinha: styles.bolinhaNormal,
        };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Fazendas')}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.fazendaNome} numberOfLines={1}>
              {fazendaNome || 'Minha Fazenda'}
            </Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titulo}>Protótipos</Text>
          <Text style={styles.subtitulo}>
            Acompanhe os dados dos sensores instalados na fazenda
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 40 }} />
        ) : erro ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>
            {erro}
          </Text>
        ) : dispositivos.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>
            Nenhum sensor nesta fazenda ainda.
          </Text>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {dispositivos.map((dispositivo) => {
              const statusStyles = getStatusStyles(dispositivo.status);
              const excluindo = excluindoId === dispositivo.id;

              return (
                <View key={dispositivo.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.sensorIcon, statusStyles.bolinha]}>
                      <Text style={styles.sensorIconText}>●</Text>
                    </View>

                    <View style={styles.sensorTitleContainer}>
                      <Text style={styles.sensorNome} numberOfLines={1}>
                        {dispositivo.nome}
                      </Text>
                      <Text style={styles.sensorTipo} numberOfLines={1}>
                        {dispositivo.local}
                      </Text>
                    </View>

                    <View style={[styles.status, statusStyles.status]}>
                      <Text style={[styles.statusText, statusStyles.statusText]}>
                        {dispositivo.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sensorDataContainer}>
                    <View style={styles.dataItem}>
                      <Text style={styles.dataLabel}>Umidade atual</Text>
                      <Text style={styles.dataValue}>{dispositivo.umidade}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.dataItem}>
                      <Text style={styles.dataLabel}>Temperatura atual</Text>
                      <Text style={styles.dataValue}>{dispositivo.temperatura}</Text>
                    </View>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => abrirDetalhes(dispositivo)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.detailsButtonText}>Ver detalhes</Text>
                      <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => excluirSensor(dispositivo)}
                      disabled={excluindo}
                      activeOpacity={0.7}
                    >
                      {excluindo ? (
                        <ActivityIndicator size="small" color="#D93636" />
                      ) : (
                        <Ionicons name="trash-outline" size={20} color="#D93636" />
                      )}
                    </TouchableOpacity>
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