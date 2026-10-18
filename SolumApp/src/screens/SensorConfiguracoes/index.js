import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../services/api';
import styles from './styles';

const VALORES_PADRAO = {
  umidade: { atencaoMinima: 40, atencaoMaxima: 73, criticaMinima: 20, criticaMaxima: 80 },
  temperatura: { atencaoMinima: 20, atencaoMaxima: 30, criticaMinima: 15, criticaMaxima: 40 },
  unidade: 'C',
  periodoPadrao: 'month',
};

// Opções em formato reutilizável para unidade e período padrão.
const Opcoes = ({ valores, selecionado, aoSelecionar }) => (
  <View style={styles.opcoesLinha}>
    {valores.map((item) => (
      <TouchableOpacity
        key={item.valor}
        style={[styles.opcao, selecionado === item.valor && styles.opcaoAtiva]}
        onPress={() => aoSelecionar(item.valor)}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityState={{ selected: selecionado === item.valor }}
      >
        <Text style={[styles.opcaoTexto, selecionado === item.valor && styles.opcaoTextoAtivo]}>
          {item.rotulo}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function SensorConfiguracoes({ route, navigation }) {
  const scrollViewRef = useRef(null);
  const dispositivoId = route?.params?.dispositivoId;
  const [configuracoes, setConfiguracoes] = useState({
    ...VALORES_PADRAO,
    nome: route?.params?.dispositivoNome || 'Sensor de Solo',
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  // Busca as preferências salvas para este protótipo ao abrir a tela.
  useEffect(() => {
    let ativo = true;
    const carregarConfiguracoes = async () => {
      try {
        if (!dispositivoId) throw new Error('Não foi possível identificar este protótipo.');
        const token = await SecureStore.getItemAsync('token');
        if (!token) throw new Error('Você precisa estar logado.');
        const resposta = await fetch(`${API_URL}/devices/${dispositivoId}/configuracoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok) throw new Error(dados.message || 'Não foi possível carregar as configurações.');
        if (ativo) {
          setConfiguracoes({
            ...VALORES_PADRAO,
            ...dados.configuracoes,
            umidade: { ...VALORES_PADRAO.umidade, ...dados.configuracoes?.umidade },
            temperatura: { ...VALORES_PADRAO.temperatura, ...dados.configuracoes?.temperatura },
            nome: dados.configuracoes?.nome || route?.params?.dispositivoNome || 'Sensor de Solo',
          });
          setErro('');
        }
      } catch (error) {
        if (ativo) setErro(error.message || 'Não foi possível carregar as configurações.');
      } finally {
        if (ativo) setCarregando(false);
      }
    };
    carregarConfiguracoes();
    return () => { ativo = false; };
  }, [dispositivoId, route?.params?.dispositivoNome]);

  const atualizarCampo = (grupo, campo, valor) => {
    setConfiguracoes((atual) => grupo
      ? { ...atual, [grupo]: { ...atual[grupo], [campo]: valor } }
      : { ...atual, [campo]: valor });
  };

  const numeroDoCampo = (valor) => Number(String(valor).replace(',', '.'));

  // A API mantém os limites de temperatura em Celsius; a tela converte só a apresentação quando necessário.
  const temperaturaParaTela = (valor) => configuracoes.unidade === 'F'
    ? Math.round((Number(valor) * 9) / 5 + 32)
    : valor;
  const temperaturaParaApi = (valor) => configuracoes.unidade === 'F'
    ? ((numeroDoCampo(valor) - 32) * 5) / 9
    : numeroDoCampo(valor);

  const renderCampoLimite = (rotulo, valor, aoMudar, unidadeCampo, recomendado) => (
    <View style={styles.campoLimite}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={styles.limiteEntradaLinha}>
        <TextInput
          style={styles.limiteEntrada}
          value={String(valor)}
          onChangeText={aoMudar}
          keyboardType="decimal-pad"
          selectTextOnFocus
          accessibilityLabel={rotulo}
        />
        <Text style={styles.unidadeCampo}>{unidadeCampo}</Text>
      </View>
      <Text style={styles.dicaRecomendacao}>Referência: {recomendado}</Text>
    </View>
  );

  // Salva todas as preferências na configuração associada ao dispositivo atual.
  const salvarConfiguracoes = async () => {
    if (salvando) return;
    setSalvando(true);
    setErro('');
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('Você precisa estar logado.');
      const temperatura = Object.fromEntries(
        Object.entries(configuracoes.temperatura).map(([campo, valor]) => [campo, numeroDoCampo(valor)]),
      );
      const corpo = {
        ...configuracoes,
        nome: configuracoes.nome.trim(),
        umidade: Object.fromEntries(Object.entries(configuracoes.umidade).map(([campo, valor]) => [campo, numeroDoCampo(valor)])),
        temperatura,
      };
      const resposta = await fetch(`${API_URL}/devices/${dispositivoId}/configuracoes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(corpo),
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados.message || 'Não foi possível salvar as configurações.');
      setConfiguracoes({
        ...dados.configuracoes,
        temperatura: { ...dados.configuracoes.temperatura },
        umidade: { ...dados.configuracoes.umidade },
      });
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      Alert.alert('Configurações salvas', 'As preferências deste protótipo foram atualizadas.');
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar as configurações.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F0F0" />
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topoPagina}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Voltar para os detalhes do sensor"
          >
            <Ionicons name="arrow-back" size={23} color="#202820" />
          </TouchableOpacity>
          <Text style={styles.tituloPagina}>Configurações</Text>
          <View style={styles.espacoTopo} />
        </View>

        {carregando ? (
          <View style={styles.estadoCarregamento}>
            <ActivityIndicator color="#249057" />
            <Text style={styles.mensagemEstado}>Carregando configurações…</Text>
          </View>
        ) : (
          <>
            <Text style={styles.introducao}>
              Personalize como você identifica o sensor e acompanha as condições do cultivo.
            </Text>

            {erro ? <Text style={styles.mensagemErro}>{erro}</Text> : null}

            {/* Identificação editável do protótipo. */}
            <View style={styles.card}>
              <View style={styles.tituloSecaoLinha}>
                <View style={[styles.iconeSecao, { backgroundColor: '#E4F3E9' }]}>
                  <Ionicons name="leaf-outline" size={19} color="#249057" />
                </View>
                <Text style={styles.tituloSecao}>Identificação</Text>
              </View>
              <Text style={styles.rotulo}>Nome do sensor</Text>
              <TextInput
                style={styles.entradaTexto}
                value={configuracoes.nome}
                onChangeText={(valor) => atualizarCampo(null, 'nome', valor)}
                placeholder="Ex.: Horta de tomates"
                placeholderTextColor="#A0A0A0"
                maxLength={40}
                accessibilityLabel="Nome do sensor"
              />
            </View>

            {/* Limites de atenção e criticidade da umidade do solo. */}
            <View style={styles.card}>
              <View style={styles.tituloSecaoLinha}>
                <View style={[styles.iconeSecao, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="water-outline" size={19} color="#2785D8" />
                </View>
                <View style={styles.tituloSecaoTexto}>
                  <Text style={styles.tituloSecao}>Alertas de umidade</Text>
                  <Text style={styles.descricao}>Escolha os valores que ativam cada nível de alerta.</Text>
                </View>
              </View>
              <Text style={styles.nivelAlerta}>Atenção · fora desta faixa</Text>
              <View style={styles.limitesLinha}>
                {renderCampoLimite('Abaixo de', configuracoes.umidade.atencaoMinima, (v) => atualizarCampo('umidade', 'atencaoMinima', v), '%', '40%')}
                {renderCampoLimite('Acima de', configuracoes.umidade.atencaoMaxima, (v) => atualizarCampo('umidade', 'atencaoMaxima', v), '%', '73%')}
              </View>
              <Text style={styles.nivelAlerta}>Crítico · fora desta faixa</Text>
              <View style={styles.limitesLinha}>
                {renderCampoLimite('Abaixo de', configuracoes.umidade.criticaMinima, (v) => atualizarCampo('umidade', 'criticaMinima', v), '%', '20%')}
                {renderCampoLimite('Acima de', configuracoes.umidade.criticaMaxima, (v) => atualizarCampo('umidade', 'criticaMaxima', v), '%', '80%')}
              </View>
            </View>

            {/* Limites de atenção e criticidade da temperatura. */}
            <View style={styles.card}>
              <View style={styles.tituloSecaoLinha}>
                <View style={[styles.iconeSecao, { backgroundColor: '#FDE8DF' }]}>
                  <Ionicons name="thermometer-outline" size={19} color="#E46A45" />
                </View>
                <View style={styles.tituloSecaoTexto}>
                  <Text style={styles.tituloSecao}>Alertas de temperatura</Text>
                  <Text style={styles.descricao}>Escolha os valores que ativam cada nível de alerta.</Text>
                </View>
              </View>
              <Text style={styles.nivelAlerta}>Atenção · fora desta faixa</Text>
              <View style={styles.limitesLinha}>
                {renderCampoLimite('Abaixo de', temperaturaParaTela(configuracoes.temperatura.atencaoMinima), (v) => atualizarCampo('temperatura', 'atencaoMinima', temperaturaParaApi(v)), `°${configuracoes.unidade}`, `${temperaturaParaTela(20)}°${configuracoes.unidade}`)}
                {renderCampoLimite('Acima de', temperaturaParaTela(configuracoes.temperatura.atencaoMaxima), (v) => atualizarCampo('temperatura', 'atencaoMaxima', temperaturaParaApi(v)), `°${configuracoes.unidade}`, `${temperaturaParaTela(30)}°${configuracoes.unidade}`)}
              </View>
              <Text style={styles.nivelAlerta}>Crítico · fora desta faixa</Text>
              <View style={styles.limitesLinha}>
                {renderCampoLimite('Abaixo de', temperaturaParaTela(configuracoes.temperatura.criticaMinima), (v) => atualizarCampo('temperatura', 'criticaMinima', temperaturaParaApi(v)), `°${configuracoes.unidade}`, `${temperaturaParaTela(15)}°${configuracoes.unidade}`)}
                {renderCampoLimite('Acima de', temperaturaParaTela(configuracoes.temperatura.criticaMaxima), (v) => atualizarCampo('temperatura', 'criticaMaxima', temperaturaParaApi(v)), `°${configuracoes.unidade}`, `${temperaturaParaTela(40)}°${configuracoes.unidade}`)}
              </View>
            </View>

            {/* Unidade e intervalo que serão usados ao abrir os detalhes do protótipo. */}
            <View style={styles.card}>
              <View style={styles.tituloSecaoLinha}>
                <View style={[styles.iconeSecao, { backgroundColor: '#F1EAFE' }]}>
                  <Ionicons name="options-outline" size={19} color="#7652B5" />
                </View>
                <View style={styles.tituloSecaoTexto}>
                  <Text style={styles.tituloSecao}>Preferências de visualização</Text>
                  <Text style={styles.descricao}>Ajuste como os dados aparecem nos detalhes.</Text>
                </View>
              </View>
              <Text style={styles.rotulo}>Unidade de temperatura</Text>
              <Opcoes
                valores={[{ valor: 'C', rotulo: 'Celsius (°C)' }, { valor: 'F', rotulo: 'Fahrenheit (°F)' }]}
                selecionado={configuracoes.unidade}
                aoSelecionar={(valor) => atualizarCampo(null, 'unidade', valor)}
              />
              <View style={styles.divisor} />
              <Text style={styles.rotulo}>Período padrão</Text>
              <Text style={styles.descricao}>Período selecionado ao abrir os detalhes do sensor.</Text>
              <Opcoes
                valores={[{ valor: 'day', rotulo: 'Dia' }, { valor: 'week', rotulo: 'Semana' }, { valor: 'month', rotulo: 'Mês' }]}
                selecionado={configuracoes.periodoPadrao}
                aoSelecionar={(valor) => atualizarCampo(null, 'periodoPadrao', valor)}
              />
            </View>

            <TouchableOpacity
              style={[styles.botaoSalvar, salvando && styles.botaoSalvarDesativado]}
              onPress={salvarConfiguracoes}
              disabled={salvando}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              {salvando
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={styles.botaoSalvarTexto}>Salvar configurações</Text>}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
