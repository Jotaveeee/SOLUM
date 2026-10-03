import React, { useState, useEffect } from 'react';
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
import { route } from '../../../../API/routes/devices';

export default function SensoresScreen({ navigation }) {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const { fazendaId, fazendaNome } = route.params;

  // Define o status com base na umidade do solo
  const calcularStatus = (umidade) => {
    if (umidade === null || umidade === undefined) return 'Normal';
    if (umidade < 20) return 'Alerta máximo';
    if (umidade < 40) return 'Atenção';
    return 'Normal';
  };

  const carregarDados = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        setErro('Você precisa estar logado.');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Busca os dispositivos e as leituras em paralelo
      const [respDispositivos, respLeituras] = await Promise.all([
        fetch(`${API_URL}/devices/me?fazenda=${fazendaId}`, { headers }),
        fetch(`${API_URL}/leituras/me`, { headers }),
      ]);

      const dataDispositivos = await respDispositivos.json();
      const dataLeituras = await respLeituras.json();

      if (respDispositivos.status === 404) {
        setDispositivos([]);
        setErro(null);
        return;
      }
      
      if (!respDispositivos.ok) {
        setErro(dataDispositivos.message || 'Erro ao buscar dispositivos.');
        return;
      }

      const leituras = respLeituras.ok ? dataLeituras.leituras : [];

      // Para cada dispositivo, acha a leitura mais recente dele
      const listaCompleta = dataDispositivos.dispositivos.map((dispositivo) => {
        const leituraMaisRecente = leituras.find(
          (leitura) => leitura.dispositivo === dispositivo.id
        );

        return {
          id: dispositivo.id,
          nome: dispositivo.deviceId,
          local: dispositivo.fazenda?.nome || 'Sem fazenda',
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
  }, []);

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
              {dispositivos[0]?.local || 'Minha Fazenda'}
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
            Nenhum dispositivo cadastrado ainda.
          </Text>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {dispositivos.map((dispositivo) => {
              const statusStyles = getStatusStyles(dispositivo.status);

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

                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => abrirDetalhes(dispositivo)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.detailsButtonText}>Ver detalhes</Text>
                    <Text style={styles.arrow}>→</Text>
                  </TouchableOpacity>
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