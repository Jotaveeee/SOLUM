
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function SensorDetalhes({ route, navigation }) {
  const dispositivoNome =
    route?.params?.dispositivoNome || 'Sensor de Solo';

  // Dados fictícios para testar a interface.
  // Depois, substitua pelos dados retornados pela API.
  const sensor = {
    umidade: 68,
    temperatura: 24.5,
    bateria: 87,
    ultimaAtualizacao: '09/10/2026 às 20:30',
  };

  const historico = [
    { id: '1', horario: '14:00', data: '09/10/2026', umidade: 52, temperatura: 22.4 },
    { id: '2', horario: '15:00', data: '09/10/2026', umidade: 57, temperatura: 23.1 },
    { id: '3', horario: '16:00', data: '09/10/2026', umidade: 61, temperatura: 24.2 },
    { id: '4', horario: '17:00', data: '09/10/2026', umidade: 64, temperatura: 25.1 },
    { id: '5', horario: '18:00', data: '09/10/2026', umidade: 72, temperatura: 26.3 },
    { id: '6', horario: '19:00', data: '09/10/2026', umidade: 70, temperatura: 25.4 },
    { id: '7', horario: '20:00', data: '09/10/2026', umidade: 68, temperatura: 24.5 },
  ];

  const formatarNumero = (valor, casas = 1) =>
    valor.toFixed(casas).replace('.', ',');

  const mediaUmidade = historico.length
    ? historico.reduce((soma, item) => soma + item.umidade, 0) /
      historico.length
    : 0;

  const mediaTemperatura = historico.length
    ? historico.reduce((soma, item) => soma + item.temperatura, 0) /
      historico.length
    : 0;

  const menorTemperatura = historico.length
    ? Math.min(...historico.map((item) => item.temperatura))
    : 0;

  const maiorTemperatura = historico.length
    ? Math.max(...historico.map((item) => item.temperatura))
    : 1;

  const minimoGrafico = Math.floor(menorTemperatura - 2);
  const maximoGrafico = Math.ceil(maiorTemperatura + 2);
  const intervaloTemperatura = maximoGrafico - minimoGrafico || 1;

  const historicoOrdenado = [...historico].reverse();

  const renderGrafico = (tipo) => {
    const isUmidade = tipo === 'umidade';
    const cor = isUmidade ? '#2785D8' : '#E46A45';
    const titulo = isUmidade ? 'Umidade do solo' : 'Temperatura';
    const unidade = isUmidade ? '%' : '°C';
    const media = isUmidade ? mediaUmidade : mediaTemperatura;

    const valoresEixo = isUmidade
      ? [100, 75, 50, 25, 0]
      : [0, 25, 50, 75, 100].map(
          (percentual) =>
            maximoGrafico -
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
              Histórico das leituras
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
                  : `${formatarNumero(valor, 0)}°`}
              </Text>
            ))}
          </View>

          <View style={styles.graficoPlot}>
            <View pointerEvents="none" style={styles.linhasGrade}>
              {[0, 1, 2, 3, 4].map((linha) => (
                <View key={linha} style={styles.linhaGrade} />
              ))}
            </View>

            <View style={styles.barrasContainer}>
              {historicoOrdenado.map((item) => {
                const altura = isUmidade
                  ? item.umidade
                  : ((item.temperatura - minimoGrafico) /
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
                      {item.horario}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.legendaGrafico}>
          <View style={styles.legendaItem}>
            <View
              style={[
                styles.legendaBolinha,
                { backgroundColor: cor },
              ]}
            />
            <Text style={styles.legendaTexto}>Leituras</Text>
          </View>

          <Text style={styles.mediaGrafico}>
            Média: {formatarNumero(media)}{unidade}
          </Text>
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
            <Ionicons name="arrow-back" size={23} color="#202820" />
          </TouchableOpacity>

          <Text style={styles.tituloPagina}>Detalhes do sensor</Text>

          <View style={styles.espacoTopo} />
        </View>

        {/* Identificação do sensor */}
        <View style={styles.cabecalho}>
          <View style={styles.cabecalhoLinha}>
            <View style={styles.cabecalhoIcone}>
              <Ionicons name="leaf-outline" size={25} color="#249057" />
            </View>

            <View style={styles.cabecalhoTexto}>
              <Text style={styles.titulo} numberOfLines={1}>
                {dispositivoNome}
              </Text>
              <Text style={styles.subtitulo}>Sensor de solo</Text>
            </View>

            {/* Botão estrutural, sem ação */}
            <TouchableOpacity>
            <View style={styles.botaoOutros}>
              <Text style={styles.botaoOutrosTexto}>OUTROS</Text>
            </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.ultimaAtualizacao}>
            Última atualização: {sensor.ultimaAtualizacao}
          </Text>
        </View>

        {/* Leituras atuais */}
        <Text style={styles.secaoTitulo}>Leituras atuais</Text>

        <View style={styles.leiturasLinha}>
          <View style={styles.leituraCard}>
            <View
              style={[
                styles.leituraIcone,
                { backgroundColor: '#E0F2FE' },
              ]}
            >
              <Ionicons name="water-outline" size={23} color="#2785D8" />
            </View>

            <Text style={styles.leituraLabel}>Umidade do solo</Text>
            <Text style={styles.leituraValor}>{sensor.umidade}%</Text>
            <Text style={styles.leituraDescricao}>Umidade atual</Text>
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

            <Text style={styles.leituraLabel}>Temperatura</Text>
            <Text style={styles.leituraValor}>
              {formatarNumero(sensor.temperatura)}°C
            </Text>
            <Text style={styles.leituraDescricao}>Temperatura atual</Text>
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
              <Text style={styles.bateriaTitulo}>Bateria do sensor</Text>
              <Text style={styles.bateriaValor}>{sensor.bateria}%</Text>
            </View>

            <View style={styles.bateriaTrilho}>
              <View
                style={[
                  styles.bateriaProgresso,
                  { width: `${sensor.bateria}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Médias */}
        <Text style={styles.secaoTitulo}>Médias do histórico</Text>

        <View style={styles.mediasLinha}>
          <View style={styles.mediaCard}>
            <Text style={styles.mediaLabel}>Umidade média</Text>
            <Text style={[styles.mediaValor, { color: '#2785D8' }]}>
              {formatarNumero(mediaUmidade)}%
            </Text>
            <Text style={styles.mediaDescricao}>
              {historico.length} leituras
            </Text>
          </View>

          <View style={styles.mediaCard}>
            <Text style={styles.mediaLabel}>Temperatura média</Text>
            <Text style={[styles.mediaValor, { color: '#E46A45' }]}>
              {formatarNumero(mediaTemperatura)}°C
            </Text>
            <Text style={styles.mediaDescricao}>
              {historico.length} leituras
            </Text>
          </View>
        </View>

        {/* Gráficos */}
        <Text style={styles.secaoTitulo}>Gráficos do histórico</Text>

        {renderGrafico('umidade')}
        {renderGrafico('temperatura')}

        {/* Histórico de leituras */}
        <View style={styles.historicoCabecalho}>
          <View style={styles.historicoCabecalhoTexto}>
            <Text style={styles.secaoTitulo}>Histórico de leituras</Text>
            <Text style={styles.historicoSubtitulo}>
              Leituras registradas pelo sensor
            </Text>
          </View>

          <View style={styles.historicoContador}>
            <Text style={styles.historicoContadorTexto}>
              {historico.length}
            </Text>
          </View>
        </View>

        {historico
          .slice()
          .reverse()
          .map((item) => (
            <View key={item.id} style={styles.historicoCard}>
              <View style={styles.historicoData}>
                <View style={styles.historicoIcone}>
                  <Ionicons name="time-outline" size={20} color="#249057" />
                </View>

                <View>
                  <Text style={styles.historicoHorario}>{item.horario}</Text>
                  <Text style={styles.historicoDataTexto}>{item.data}</Text>
                </View>
              </View>

              <View style={styles.historicoMedicoes}>
                <View style={styles.historicoMedicao}>
                  <Ionicons name="water-outline" size={16} color="#2785D8" />
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
                    {formatarNumero(item.temperatura)}°C
                  </Text>
                </View>
              </View>
            </View>
          ))}

        {historico.length === 0 && (
          <View style={styles.vazioCard}>
            <Ionicons
              name="analytics-outline"
              size={35}
              color="#999999"
            />
            <Text style={styles.vazioTitulo}>
              Nenhuma leitura disponível
            </Text>
            <Text style={styles.vazioTexto}>
              O histórico aparecerá aqui quando o sensor registrar leituras.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}