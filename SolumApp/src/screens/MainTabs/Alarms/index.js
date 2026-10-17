import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

import { API_URL } from '../../../services/api';
import styles, { colors } from './styles';

const formatarHorario = (data) => {
  if (!data) return 'Horário indisponível';

  const instante = new Date(data);
  if (Number.isNaN(instante.getTime())) return 'Horário indisponível';

  return instante.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const configuracaoAlarme = {
  warning: { label: 'Atenção', cor: '#B7791F', fundo: '#FFF4D6' },
  critical: { label: 'Crítico', cor: '#D64545', fundo: '#FDE8E8' },
};

export default function Alarmes() {
  const navigation = useNavigation();
  const [alarmes, setAlarmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [resolvendoId, setResolvendoId] = useState(null);

  const carregarAlarmes = useCallback(async (mostrarCarregamento = false) => {
    if (mostrarCarregamento) setLoading(true);

    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('Você precisa estar logado.');

      const resposta = await fetch(`${API_URL}/alertas/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(dados.message || 'Não foi possível buscar os alertas.');
      }

      setAlarmes(dados.alertas || []);
      setErro(null);
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar os alertas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarAlarmes(true);
      const intervalo = setInterval(() => carregarAlarmes(), 30000);
      return () => clearInterval(intervalo);
    }, [carregarAlarmes]),
  );

  const resolverAlerta = async (alarme) => {
    if (resolvendoId) return;
    setResolvendoId(alarme.id);

    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('Você precisa estar logado.');

      const resposta = await fetch(`${API_URL}/alertas/resolver`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dispositivoId: alarme.dispositivoId,
          fingerprint: alarme.fingerprint,
        }),
      });
      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(dados.message || 'Não foi possível resolver o alerta.');
      }

      setAlarmes((atuais) => atuais.filter((item) => item.id !== alarme.id));
      setErro(null);
    } catch (error) {
      Alert.alert('Erro ao resolver alerta', error.message || 'Tente novamente.');
    } finally {
      setResolvendoId(null);
    }
  };

  const quantidadeAtencao = alarmes.filter((alarme) => alarme.tipo === 'warning').length;
  const quantidadeCriticos = alarmes.filter((alarme) => alarme.tipo === 'critical').length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resumoCard}>
          <View style={styles.resumoTopo}>
            <View style={styles.resumoIcone}>
              <Ionicons name="notifications-outline" size={25} color={colors.primary} />
            </View>
            <View style={styles.resumoTexto}>
              <Text style={styles.resumoTitulo}>Alertas ativos</Text>
              <Text style={styles.resumoDescricao}>
                Umidade e temperatura da leitura mais recente
              </Text>
            </View>
          </View>
          <View style={styles.resumoDivisor} />
          <View style={styles.resumoIndicadores}>
            <View style={styles.indicador}>
              <View style={[styles.indicadorPonto, { backgroundColor: '#D69E2E' }]} />
              <Text style={styles.indicadorValor}>{quantidadeAtencao}</Text>
              <Text style={styles.indicadorLabel}>Atenção</Text>
            </View>
            <View style={styles.indicadorSeparador} />
            <View style={styles.indicador}>
              <View style={[styles.indicadorPonto, { backgroundColor: '#D64545' }]} />
              <Text style={styles.indicadorValor}>{quantidadeCriticos}</Text>
              <Text style={styles.indicadorLabel}>Críticos</Text>
            </View>
          </View>
        </View>

        <View style={styles.secao}>
          <View style={styles.secaoCabecalho}>
            <Text style={styles.tituloSecao}>Alertas dos sensores</Text>
            <Text style={styles.contador}>{alarmes.length} alertas</Text>
          </View>

          {loading ? (
            <View style={styles.estadoVazio}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.estadoVazioDescricao}>Buscando alertas dos sensores…</Text>
            </View>
          ) : erro ? (
            <View style={styles.estadoVazio}>
              <Text style={styles.estadoVazioTitulo}>Não foi possível carregar os alertas</Text>
              <Text style={styles.estadoVazioDescricao}>{erro}</Text>
              <TouchableOpacity
                style={styles.botaoTentarNovamente}
                onPress={() => carregarAlarmes(true)}
                accessibilityRole="button"
              >
                <Text style={styles.botaoTentarNovamenteTexto}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : alarmes.length > 0 ? (
            alarmes.map((alarme) => {
              const config = configuracaoAlarme[alarme.tipo];
              const resolvendo = resolvendoId === alarme.id;

              return (
                <View key={alarme.id} style={styles.alarmeCard}>
                  <TouchableOpacity
                    style={styles.alarmePrincipal}
                    activeOpacity={0.75}
                    onPress={() => navigation.navigate('SensorDetalhes', {
                      dispositivoId: alarme.dispositivoId,
                      dispositivoNome: alarme.dispositivoNome,
                    })}
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir sensor ${alarme.dispositivoNome}: ${alarme.titulo}`}
                  >
                    <View style={[styles.alarmeIcone, { backgroundColor: config.fundo }]}>
                      <Ionicons name={alarme.icone} size={23} color={config.cor} />
                    </View>
                    <View style={styles.alarmeConteudo}>
                      <Text style={styles.alarmeTitulo}>{alarme.titulo}</Text>
                      <Text style={styles.alarmeDescricao}>{alarme.descricao}</Text>
                      <View style={styles.alarmeInformacoes}>
                        <View style={styles.alarmeInformacao}>
                          <Ionicons name="leaf-outline" size={14} color={colors.textSecondary} />
                          <Text style={styles.alarmeInformacaoTexto}>{alarme.fazendaNome}</Text>
                        </View>
                        <View style={styles.alarmeInformacao}>
                          <Ionicons name="hardware-chip-outline" size={14} color={colors.textSecondary} />
                          <Text style={styles.alarmeInformacaoTexto}>{alarme.dispositivoNome}</Text>
                        </View>
                        <View style={styles.alarmeInformacao}>
                          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                          <Text style={styles.alarmeInformacaoTexto}>{formatarHorario(alarme.horario)}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: config.fundo }]}>
                        <Text style={[styles.statusTexto, { color: config.cor }]}>{config.label}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} style={styles.alarmeSeta} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoResolver}
                    activeOpacity={0.7}
                    onPress={() => resolverAlerta(alarme)}
                    disabled={Boolean(resolvendoId)}
                    accessibilityRole="button"
                    accessibilityLabel={`Marcar alerta como visto e resolvido: ${alarme.titulo}`}
                  >
                    {resolvendo ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={styles.textoResolver}>Resolver</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={styles.estadoVazio}>
              <Ionicons name="checkmark-circle-outline" size={38} color={colors.primary} />
              <Text style={styles.estadoVazioTitulo}>Nenhum alerta ativo</Text>
              <Text style={styles.estadoVazioDescricao}>
                Alertas de umidade abaixo de 40% ou temperatura a partir de 35 °C aparecerão aqui.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
