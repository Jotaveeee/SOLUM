import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../services/api';

export default function SensorDetalhes({ route, navigation }) {
  const dispositivoId = route?.params?.dispositivoId;
  const [dispositivoNome, setDispositivoNome] = useState(route?.params?.dispositivoNome || 'Sensor de Solo');
  const [historico, setHistorico] = useState([]);
  const [periodo, setPeriodo] = useState('month');
  const [configuracoes, setConfiguracoes] = useState({
    unidade: 'C',
    umidade: { atencaoMinima: 40, atencaoMaxima: 73, criticaMinima: 20, criticaMaxima: 80 },
    temperatura: { atencaoMinima: 20, atencaoMaxima: 30, criticaMinima: 15, criticaMaxima: 40 },
  });
  const [resumo, setResumo] = useState(null);
  const [pontosGrafico, setPontosGrafico] = useState([]);
  const [totalLeituras, setTotalLeituras] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState(null);

  const obterIntervalo = (periodoSelecionado) => {
    const fim = new Date();
    const inicio = new Date(fim);
    if (periodoSelecionado === 'day') {
      inicio.setHours(0, 0, 0, 0);
    } else if (periodoSelecionado === 'week') {
      inicio.setHours(0, 0, 0, 0);
      inicio.setDate(inicio.getDate() - 6);
    } else {
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
    }
    return { inicio, fim };
  };

  const formatarLeitura = (leitura) => {
    const data = new Date(leitura.createdAt);
    return {
      id: leitura._id || leitura.createdAt,
      timestamp: data.getTime(),
      horario: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      data: data.toLocaleDateString('pt-BR'),
      umidade: Number(leitura.umidadeSolo),
      temperatura: Number(leitura.temperatura),
      bateria: Number(leitura.bateria),
    };
  };

  const intervaloPeriodo = useMemo(() => obterIntervalo(periodo), [periodo]);
  const formatarDataCurta = (data) => data.toLocaleDateString('pt-BR');
  const textoPeriodo = periodo === 'day'
    ? `Hoje · ${formatarDataCurta(intervaloPeriodo.inicio)}`
    : periodo === 'week'
      ? `Últimos 7 dias · ${formatarDataCurta(intervaloPeriodo.inicio)} a ${formatarDataCurta(intervaloPeriodo.fim)}`
      : `Este mês · 01/${String(intervaloPeriodo.inicio.getMonth() + 1).padStart(2, '0')}/${intervaloPeriodo.inicio.getFullYear()} a ${formatarDataCurta(intervaloPeriodo.fim)}`;
  const descricaoPeriodo = periodo === 'day'
    ? 'Mostrando todas as leituras de hoje.'
    : periodo === 'week'
      ? 'Médias diárias dos 6 dias anteriores e de hoje.'
      : 'Médias diárias desde o primeiro dia deste mês.';
  const parametrosPeriodo = `inicio=${encodeURIComponent(intervaloPeriodo.inicio.toISOString())}&fim=${encodeURIComponent(intervaloPeriodo.fim.toISOString())}`;

  // Recarrega preferências ao voltar às telas de detalhes, sem sobrescrever filtros escolhidos durante a navegação.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      const carregarConfiguracoes = async () => {
        try {
          if (!dispositivoId) return;
          const token = await SecureStore.getItemAsync('token');
          if (!token) return;
          const resposta = await fetch(`${API_URL}/devices/${dispositivoId}/configuracoes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const dados = await resposta.json().catch(() => ({}));
          if (!resposta.ok) return;
          if (ativo) {
            const salvas = dados.configuracoes || {};
            setConfiguracoes((atuais) => ({
              ...atuais,
              ...salvas,
              umidade: { ...atuais.umidade, ...salvas.umidade },
              temperatura: { ...atuais.temperatura, ...salvas.temperatura },
            }));
            setDispositivoNome(salvas.nome || route?.params?.dispositivoNome || 'Sensor de Solo');
            setPeriodo(salvas.periodoPadrao || 'month');
          }
        } catch (error) {
          // A tela de detalhes continua disponível mesmo se não for possível carregar as preferências.
        }
      };
      carregarConfiguracoes();
      return () => { ativo = false; };
    }, [dispositivoId, route?.params?.dispositivoNome]),
  );

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      const carregarLeituras = async () => {
        setCarregando(true);
        setHistorico([]);
        setResumo(null);
        setPontosGrafico([]);
        setTotalLeituras(0);
        try {
          const token = await SecureStore.getItemAsync('token');
          if (!token) throw new Error('Você precisa estar logado.');
          if (!dispositivoId) throw new Error('Sensor não informado.');

          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
          const queryResumo = `${parametrosPeriodo}&periodo=${periodo}&timezone=${encodeURIComponent(timezone)}`;
          const headers = { Authorization: `Bearer ${token}` };
          const [respostaResumo, respostaHistorico] = await Promise.all([
            fetch(`${API_URL}/leituras/dispositivo/${dispositivoId}/resumo?${queryResumo}`, { headers }),
            fetch(`${API_URL}/leituras/dispositivo/${dispositivoId}/historico?offset=0&limit=10&${parametrosPeriodo}`, { headers }),
          ]);
          const dadosResumo = await respostaResumo.json().catch(() => ({}));
          const dadosHistorico = await respostaHistorico.json().catch(() => ({}));
          if (!respostaResumo.ok) throw new Error(dadosResumo.message || 'Não foi possível carregar o resumo do sensor.');
          if (!respostaHistorico.ok) throw new Error(dadosHistorico.message || 'Não foi possível buscar o histórico.');

          const resumoComUltimaLeitura = {
            ...dadosResumo,
            ultimaLeitura: dadosResumo.ultimaLeitura ? formatarLeitura(dadosResumo.ultimaLeitura) : null,
          };
          const pontos = (dadosResumo.pontosGrafico || []).map((ponto) => {
            const data = new Date(ponto.timestamp);
            return {
              id: data.toISOString(),
              timestamp: data.getTime(),
              horario: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              data: data.toLocaleDateString('pt-BR'),
              umidade: Number(ponto.umidade),
              temperatura: Number(ponto.temperatura),
            };
          });

          if (ativo) {
            setResumo(resumoComUltimaLeitura);
            setPontosGrafico(pontos);
            setHistorico((dadosHistorico.leituras || []).map(formatarLeitura));
            setTotalLeituras(dadosHistorico.total || 0);
            setErro(null);
          }
        } catch (error) {
          if (ativo) setErro(error.message || 'Não foi possível carregar o sensor.');
        } finally {
          if (ativo) setCarregando(false);
        }
      };

      carregarLeituras();
      return () => { ativo = false; };
    }, [dispositivoId, periodo, parametrosPeriodo, route?.params?.dispositivoNome]),
  );

  const carregarMaisLeituras = async () => {
    if (carregandoMais || historico.length >= totalLeituras) return;
    setCarregandoMais(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('Você precisa estar logado.');
      const resposta = await fetch(
        `${API_URL}/leituras/dispositivo/${dispositivoId}/historico?offset=${historico.length}&limit=10&${parametrosPeriodo}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados.message || 'Não foi possível carregar mais leituras.');
      setHistorico((atual) => [...atual, ...(dados.leituras || []).map(formatarLeitura)]);
      setErro(null);
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar mais leituras.');
    } finally {
      setCarregandoMais(false);
    }
  };

  const leituraAtual = resumo?.ultimaLeitura;
  const sensor = {
    umidade: leituraAtual?.umidade,
    temperatura: leituraAtual?.temperatura,
    bateria: leituraAtual?.bateria,
    ultimaAtualizacao: leituraAtual
      ? `${leituraAtual.data} às ${leituraAtual.horario}`
      : 'Sem leituras',
  };

  const formatarNumero = (valor, casas = 1) =>
    Number.isFinite(Number(valor)) && valor !== null && valor !== undefined
      ? Number(valor).toFixed(casas).replace('.', ',')
      : '--';

  const temperaturaParaExibicao = (valor) => configuracoes.unidade === 'F'
    ? (Number(valor) * 9) / 5 + 32
    : Number(valor);
  const unidadeTemperatura = configuracoes.unidade === 'F' ? '°F' : '°C';

  const alertasIndicadores = [];
  const limitesUmidade = configuracoes.umidade;
  const umidadeCriticaBaixa = Number.isFinite(sensor.umidade) && sensor.umidade < limitesUmidade.criticaMinima;
  const umidadeCriticaAlta = Number.isFinite(sensor.umidade) && sensor.umidade > limitesUmidade.criticaMaxima;
  const umidadeAtencaoBaixa = Number.isFinite(sensor.umidade) && sensor.umidade < limitesUmidade.atencaoMinima;
  const umidadeAtencaoAlta = Number.isFinite(sensor.umidade) && sensor.umidade > limitesUmidade.atencaoMaxima;
  const umidadeCritica = umidadeCriticaBaixa || umidadeCriticaAlta;
  const umidadeAtencao = !umidadeCritica && (umidadeAtencaoBaixa || umidadeAtencaoAlta);
  if (umidadeCritica || umidadeAtencao) {
    alertasIndicadores.push({
      tipo: umidadeCritica ? 'critical' : 'warning',
      texto: umidadeCritica
        ? `Umidade do solo crítica ${umidadeCriticaBaixa ? 'baixa' : 'alta'} · ${sensor.umidade}%`
        : umidadeAtencaoBaixa
          ? `Umidade do solo baixa · ${sensor.umidade}%`
          : `Umidade do solo alta · ${sensor.umidade}%`,
    });
  }
  const limitesTemperatura = configuracoes.temperatura;
  const temperaturaCriticaBaixa = Number.isFinite(sensor.temperatura) && sensor.temperatura < limitesTemperatura.criticaMinima;
  const temperaturaCriticaAlta = Number.isFinite(sensor.temperatura) && sensor.temperatura > limitesTemperatura.criticaMaxima;
  const temperaturaAtencaoBaixa = Number.isFinite(sensor.temperatura) && sensor.temperatura < limitesTemperatura.atencaoMinima;
  const temperaturaAtencaoAlta = Number.isFinite(sensor.temperatura) && sensor.temperatura > limitesTemperatura.atencaoMaxima;
  const temperaturaCritica = temperaturaCriticaBaixa || temperaturaCriticaAlta;
  if (temperaturaCritica || temperaturaAtencaoBaixa || temperaturaAtencaoAlta) {
    const valorTemperatura = temperaturaParaExibicao(sensor.temperatura);
    alertasIndicadores.push({
      tipo: temperaturaCritica ? 'critical' : 'warning',
      texto: temperaturaCritica
        ? `Temperatura crítica ${temperaturaCriticaBaixa ? 'baixa' : 'alta'} · ${formatarNumero(valorTemperatura)}${unidadeTemperatura}`
        : temperaturaAtencaoBaixa
          ? `Temperatura baixa · ${formatarNumero(valorTemperatura)}${unidadeTemperatura}`
          : `Temperatura elevada · ${formatarNumero(valorTemperatura)}${unidadeTemperatura}`,
    });
  }
  const alertaCritico = alertasIndicadores.some((alerta) => alerta.tipo === 'critical');

  const mediaUmidade = Number(resumo?.resumo?.mediaUmidade ?? 0);
  const mediaTemperatura = Number(resumo?.resumo?.mediaTemperatura ?? 0);
  const menorTemperatura = Number(resumo?.resumo?.menorTemperatura ?? 0);
  const maiorTemperatura = Number(resumo?.resumo?.maiorTemperatura ?? 1);
  const temLeiturasPeriodo = Number(resumo?.resumo?.total || 0) > 0;

  const minimoGrafico = Math.floor(menorTemperatura - 2);
  const maximoGrafico = Math.ceil(maiorTemperatura + 2);
  const minimoGraficoExibicao = temperaturaParaExibicao(minimoGrafico);
  const maximoGraficoExibicao = temperaturaParaExibicao(maximoGrafico);
  const intervaloTemperatura = maximoGraficoExibicao - minimoGraficoExibicao || 1;

  const renderGrafico = (tipo) => {
    const isUmidade = tipo === 'umidade';
    const cor = isUmidade ? '#2785D8' : '#E46A45';
    const titulo = isUmidade ? 'Umidade do solo' : 'Temperatura';
    const unidade = isUmidade ? '%' : unidadeTemperatura;
    const media = isUmidade ? mediaUmidade : temperaturaParaExibicao(mediaTemperatura);
    const mostrarMedia = periodo !== 'day';

    const valoresEixo = isUmidade
      ? [100, 75, 50, 25, 0]
      : [0, 25, 50, 75, 100].map(
          (percentual) =>
            maximoGraficoExibicao -
            (intervaloTemperatura * percentual) / 100,
        );

    return (
      <View key={tipo} style={styles.graficoCard}>
        <View style={styles.graficoTituloContainer}>
          <View
            style={[
              styles.graficoIcone,
              { backgroundColor: isUmidade ? '#E0F2FE' : '#FDE8DF' },
            ]}
          >
            <Ionicons
              name={isUmidade ? 'water-outline' : 'thermometer-outline'}
              size={21}
              color={cor}
            />
          </View>

          <View style={styles.graficoTituloTexto}>
            <Text style={styles.graficoTitulo}>{titulo}</Text>
            <Text style={styles.graficoSubtitulo}>
              {periodo === 'day' ? 'Todas as leituras · por horário' : 'Médias das leituras · por dia'}
            </Text>
          </View>
        </View>

        <View style={styles.grafico}>
          <View style={styles.eixoY}>
            {valoresEixo.map((valor, index) => (
              <Text
                key={`${tipo}-eixo-${index}`}
                style={styles.eixoTexto}
              >
                {isUmidade
                  ? `${valor}%`
                  : `${formatarNumero(valor, 0)}${unidadeTemperatura}`}
              </Text>
            ))}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            style={styles.graficoPlot}
            contentContainerStyle={[
              styles.graficoScrollConteudo,
              { width: Math.max(250, pontosGrafico.length * 44) },
            ]}
          >
            <View pointerEvents="none" style={styles.linhasGrade}>
              {[0, 1, 2, 3, 4].map((linha) => (
                <View key={linha} style={styles.linhaGrade} />
              ))}
            </View>

            {periodo === 'day' ? (
              <View style={styles.linhaGraficoContainer}>
                {pontosGrafico.map((item, index) => {
                  const valor = isUmidade
                    ? item.umidade
                    : ((temperaturaParaExibicao(item.temperatura) - minimoGraficoExibicao) / intervaloTemperatura) * 100;
                  const y = 160 - Math.max(3, Math.min(100, valor)) * 1.6;
                  const x = index * 44 + 22;
                  const proximo = pontosGrafico[index + 1];
                  let segmento = null;
                  if (proximo) {
                    const valorProximo = isUmidade
                      ? proximo.umidade
                      : ((temperaturaParaExibicao(proximo.temperatura) - minimoGraficoExibicao) / intervaloTemperatura) * 100;
                    const yProximo = 160 - Math.max(3, Math.min(100, valorProximo)) * 1.6;
                    const dx = 44;
                    const dy = yProximo - y;
                    const comprimento = Math.sqrt(dx * dx + dy * dy);
                    const angulo = `${Math.atan2(dy, dx)}rad`;
                    segmento = (
                      <View
                        key={`${item.id}-segmento`}
                        style={[styles.segmentoLinha, {
                          width: comprimento,
                          left: (x + (index + 1) * 44 + 22) / 2 - comprimento / 2,
                          top: (y + yProximo) / 2 - 1,
                          backgroundColor: cor,
                          transform: [{ rotate: angulo }],
                        }]}
                      />
                    );
                  }
                  return (
                    <React.Fragment key={item.id}>
                      {segmento}
                      <View style={[styles.pontoLinha, {
                        left: x - 4,
                        top: y - 4,
                        backgroundColor: cor,
                      }]} />
                      <Text style={[styles.barraHorario, styles.rotuloLinha]}>
                        {item.horario}
                      </Text>
                    </React.Fragment>
                  );
                })}
              </View>
            ) : (
            <View style={styles.barrasContainer}>
              {pontosGrafico.map((item) => {
                const altura = isUmidade
                  ? item.umidade
                  : ((temperaturaParaExibicao(item.temperatura) - minimoGraficoExibicao) /
                      intervaloTemperatura) *
                    100;

                return (
                  <View key={item.id} style={styles.barraColuna}>
                    <View style={styles.barraEspaco}>
                      <View
                        style={[
                          styles.barra,
                          {
                            height: `${Math.max(
                              3,
                              Math.min(100, altura),
                            )}%`,
                            backgroundColor: cor,
                          },
                        ]}
                      />
                    </View>

                    <Text style={styles.barraHorario}>
                      {item.data.slice(0, 5)}
                    </Text>
                  </View>
                );
              })}
            </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.legendaGrafico}>
          <View style={styles.legendaItem}>
            <View
              style={[
                styles.legendaBolinha,
                { backgroundColor: cor },
              ]}
            />
            <Text style={styles.legendaTexto}>{periodo === 'day' ? 'Leituras individuais' : 'Média por dia'}</Text>
          </View>

          {mostrarMedia && <Text style={styles.mediaGrafico}>
            Média do período: {temLeiturasPeriodo ? `${formatarNumero(media)}${unidade}` : '--'}
          </Text>}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F0F0F0"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho com botão de voltar */}
        <View style={styles.topoPagina}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#202820"
            />
          </TouchableOpacity>

          <Text style={styles.tituloPagina}>
            Detalhes dos sensores
          </Text>

          <View style={styles.espacoTopo} />
        </View>

        {/* Identificação do sensor */}
        <View style={styles.cabecalho}>
          <View style={styles.cabecalhoLinha}>
            <View style={styles.cabecalhoIcone}>
              <Ionicons
                name="leaf-outline"
                size={26}
                color="#249057"
              />
            </View>

            <View style={styles.cabecalhoTexto}>
              <Text style={styles.titulo} numberOfLines={1}>
                {dispositivoNome}
              </Text>

              <Text style={styles.subtitulo}>
                SoloSync
              </Text>
            </View>

            <TouchableOpacity
              style={styles.botaoConfiguracoes}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Configurações do sensor"
              onPress={() => navigation.navigate('SensorConfiguracoes', {
                dispositivoId,
                dispositivoNome,
              })}
            >
              <Ionicons name="settings-outline" size={20} color="#249057" />
            </TouchableOpacity>
          </View>

          <Text style={styles.ultimaAtualizacao}>
            Última atualização: {sensor.ultimaAtualizacao}
          </Text>
        </View>

        {/* ALERTAS */}
        <View style={styles.section}>
          <Text style={styles.tituloSecao}>
            Alertas
          </Text>

          <View style={styles.alertCard}>
            <View style={styles.alertIcone}>
              <Ionicons
                name={carregando ? 'sync-outline' : alertasIndicadores.length ? 'warning-outline' : 'checkmark-circle-outline'}
                size={23}
                color={alertaCritico ? '#D64545' : alertasIndicadores.length ? '#B7791F' : '#249057'}
              />
            </View>

            <Text style={styles.alertText}>
              {carregando
                ? 'Carregando leituras do sensor…'
                : erro
                  ? erro
                  : !leituraAtual
                    ? 'Este sensor ainda não possui leituras.'
                    : alertasIndicadores.length
                      ? alertasIndicadores.map((alerta) => alerta.texto).join(' · ')
                      : 'Nenhum alerta ativo para este sensor.'}
            </Text>
          </View>
        </View>

        {/* Leituras atuais */}
        <Text style={styles.secaoTitulo}>
          Leituras atuais
        </Text>

        <View style={styles.leiturasLinha}>
          <View style={styles.leituraCard}>
            <View
              style={[
                styles.leituraIcone,
                { backgroundColor: '#E0F2FE' },
              ]}
            >
              <Ionicons
                name="water-outline"
                size={23}
                color="#2785D8"
              />
            </View>

            <Text style={styles.leituraLabel}>
              Umidade do solo
            </Text>

            <Text style={styles.leituraValor}>
              {sensor.umidade ?? '--'}{sensor.umidade == null ? '' : '%'}
            </Text>

            <Text style={styles.leituraDescricao}>
              Umidade atual
            </Text>
          </View>

          <View style={styles.leituraCard}>
            <View
              style={[
                styles.leituraIcone,
                { backgroundColor: '#FDE8DF' },
              ]}
            >
              <Ionicons
                name="thermometer-outline"
                size={23}
                color="#E46A45"
              />
            </View>

            <Text style={styles.leituraLabel}>
              Temperatura
            </Text>

            <Text style={styles.leituraValor}>
              {sensor.temperatura == null ? '--' : `${formatarNumero(temperaturaParaExibicao(sensor.temperatura))}${unidadeTemperatura}`}
            </Text>

            <Text style={styles.leituraDescricao}>
              Temperatura atual
            </Text>
          </View>
        </View>

        {/* Bateria */}
        <View style={styles.bateriaCard}>
          <View style={styles.bateriaIcone}>
            <Ionicons
              name="battery-half-outline"
              size={23}
              color="#249057"
            />
          </View>

          <View style={styles.bateriaConteudo}>
            <View style={styles.bateriaTextoLinha}>
              <Text style={styles.bateriaTitulo}>
                Bateria do sensor
              </Text>

              <Text style={styles.bateriaValor}>
                {sensor.bateria == null ? '--' : `${sensor.bateria}%`}
              </Text>
            </View>

            <View style={styles.bateriaTrilho}>
              <View
                style={[
                  styles.bateriaProgresso,
                  { width: `${sensor.bateria ?? 0}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Médias */}
        <View style={styles.mediasCabecalho}>
          <Text style={styles.mediasTitulo}>Histórico do sensor</Text>
          <View style={styles.filtrosPeriodo}>
            {[
              { id: 'day', label: 'Dia' },
              { id: 'week', label: 'Semana' },
              { id: 'month', label: 'Mês' },
            ].map((opcao) => (
              <TouchableOpacity
                key={opcao.id}
                style={[
                  styles.filtroPeriodo,
                  periodo === opcao.id && styles.filtroPeriodoAtivo,
                ]}
                onPress={() => {
                  setPeriodo(opcao.id);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: periodo === opcao.id }}
              >
                <Text
                  style={[
                    styles.filtroPeriodoTexto,
                    periodo === opcao.id && styles.filtroPeriodoTextoAtivo,
                  ]}
                >
                  {opcao.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoPeriodo}>
          <Ionicons name="calendar-outline" size={18} color="#249057" />
          <View style={styles.infoPeriodoTexto}>
            <Text style={styles.infoPeriodoTitulo}>{textoPeriodo}</Text>
            <Text style={styles.infoPeriodoDescricao}>{descricaoPeriodo}</Text>
          </View>
        </View>

        <View style={styles.mediasLinha}>
          <View style={styles.mediaCard}>
            <Text style={styles.mediaLabel}>
              Umidade média
            </Text>

            <Text
              style={[
                styles.mediaValor,
                { color: '#2785D8' },
              ]}
            >
              {temLeiturasPeriodo ? `${formatarNumero(mediaUmidade)}%` : '--'}
            </Text>

            <Text style={styles.mediaDescricao}>
              {resumo?.resumo?.total || 0} leituras no período
            </Text>
          </View>

          <View style={styles.mediaCard}>
            <Text style={styles.mediaLabel}>
              Temperatura média
            </Text>

            <Text
              style={[
                styles.mediaValor,
                { color: '#E46A45' },
              ]}
            >
              {temLeiturasPeriodo ? `${formatarNumero(temperaturaParaExibicao(mediaTemperatura))}${unidadeTemperatura}` : '--'}
            </Text>

            <Text style={styles.mediaDescricao}>
              {resumo?.resumo?.total || 0} leituras no período
            </Text>
          </View>
        </View>

        {/* Gráficos */}
        {temLeiturasPeriodo ? (
          <>
            <Text style={styles.secaoTitulo}>Gráficos do histórico</Text>
            {renderGrafico('umidade')}
            {renderGrafico('temperatura')}
          </>
        ) : (
          <View style={styles.vazioCard}>
            <Ionicons name="analytics-outline" size={35} color="#999999" />
            <Text style={styles.vazioTitulo}>Sem leituras neste período</Text>
            <Text style={styles.vazioTexto}>
              Escolha outro período para consultar médias e gráficos.
            </Text>
          </View>
        )}

        {/* Histórico de leituras */}
        <View style={styles.historicoCabecalho}>
          <View style={styles.historicoCabecalhoTexto}>
            <Text style={styles.secaoTitulo}>
              Histórico de leituras
            </Text>

            <Text style={styles.historicoSubtitulo}>
              Leituras mais recentes primeiro
            </Text>
          </View>

          <View style={styles.historicoContador}>
            <Text style={styles.historicoContadorTexto}>
              {historico.length}/{totalLeituras}
            </Text>
          </View>
        </View>

        {historico.map((item) => (
            <View
              key={item.id}
              style={styles.historicoCard}
            >
              <View style={styles.historicoData}>
                <View style={styles.historicoIcone}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#249057"
                  />
                </View>

                <View>
                  <Text style={styles.historicoHorario}>
                    {item.horario}
                  </Text>

                  <Text style={styles.historicoDataTexto}>
                    {item.data}
                  </Text>
                </View>
              </View>

              <View style={styles.historicoMedicoes}>
                <View style={styles.historicoMedicao}>
                  <Ionicons
                    name="water-outline"
                    size={16}
                    color="#2785D8"
                  />

                  <Text style={styles.historicoMedicaoTexto}>
                    {item.umidade}%
                  </Text>
                </View>

                <View style={styles.historicoMedicao}>
                  <Ionicons
                    name="thermometer-outline"
                    size={16}
                    color="#E46A45"
                  />

                  <Text style={styles.historicoMedicaoTexto}>
                    {formatarNumero(temperaturaParaExibicao(item.temperatura))}{unidadeTemperatura}
                  </Text>
                </View>
              </View>
            </View>
          ))}

        {historico.length < totalLeituras && (
          <TouchableOpacity
            style={styles.botaoCarregarMais}
            onPress={carregarMaisLeituras}
            disabled={carregandoMais}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Carregar mais leituras do histórico"
          >
            {carregandoMais ? <ActivityIndicator size="small" color="#249057" /> : <Text style={styles.textoCarregarMais}>Carregar mais</Text>}
            {!carregandoMais && <Ionicons name="chevron-down" size={18} color="#249057" />}
          </TouchableOpacity>
        )}

        {!carregando && historico.length === 0 && (
          <View style={styles.vazioCard}>
            <Ionicons
              name="analytics-outline"
              size={35}
              color="#999999"
            />

            <Text style={styles.vazioTitulo}>
              {totalLeituras ? 'Sem leituras neste período' : 'Nenhuma leitura disponível'}
            </Text>

            <Text style={styles.vazioTexto}>
              {erro || (totalLeituras
                ? 'Escolha outro período para consultar leituras.'
                : 'O histórico aparecerá aqui quando o sensor registrar leituras.')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
