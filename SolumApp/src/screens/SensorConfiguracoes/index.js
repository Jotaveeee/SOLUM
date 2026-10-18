import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

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
  const [nome, setNome] = useState(route?.params?.dispositivoNome || 'Sensor de Solo');
  const [umidadeAtencaoMinima, setUmidadeAtencaoMinima] = useState('40');
  const [umidadeAtencaoMaxima, setUmidadeAtencaoMaxima] = useState('73');
  const [umidadeCriticaMinima, setUmidadeCriticaMinima] = useState('20');
  const [umidadeCriticaMaxima, setUmidadeCriticaMaxima] = useState('80');
  const [temperaturaAtencaoMinima, setTemperaturaAtencaoMinima] = useState('20');
  const [temperaturaAtencaoMaxima, setTemperaturaAtencaoMaxima] = useState('30');
  const [temperaturaCriticaMinima, setTemperaturaCriticaMinima] = useState('15');
  const [temperaturaCriticaMaxima, setTemperaturaCriticaMaxima] = useState('40');
  const [unidade, setUnidade] = useState('C');
  const [periodoPadrao, setPeriodoPadrao] = useState('month');

  const renderAlternancia = (titulo, descricao, valor, aoMudar) => (
    <View style={styles.alternanciaLinha}>
      <View style={styles.alternanciaTexto}>
        <Text style={styles.rotulo}>{titulo}</Text>
        {!!descricao && <Text style={styles.descricao}>{descricao}</Text>}
      </View>
      <Switch
        value={valor}
        onValueChange={aoMudar}
        trackColor={{ false: '#D7D7D7', true: '#A8D9B8' }}
        thumbColor={valor ? '#249057' : '#F5F5F5'}
        accessibilityLabel={titulo}
      />
    </View>
  );

  const renderCampoLimite = (rotulo, valor, aoMudar, unidadeCampo, recomendado) => (
    <View style={styles.campoLimite}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={styles.limiteEntradaLinha}>
        <TextInput
          style={styles.limiteEntrada}
          value={valor}
          onChangeText={aoMudar}
          keyboardType="decimal-pad"
          selectTextOnFocus
          accessibilityLabel={rotulo}
        />
        <Text style={styles.unidadeCampo}>{unidadeCampo}</Text>
      </View>
      <Text style={styles.dicaRecomendacao}>Recomendado: {recomendado}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F0F0" />
      <ScrollView
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

        <Text style={styles.introducao}>
          Personalize como você identifica o sensor e acompanha as condições do cultivo.
        </Text>

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
            value={nome}
            onChangeText={setNome}
            placeholder="Ex.: Horta de tomates"
            placeholderTextColor="#A0A0A0"
            maxLength={40}
            accessibilityLabel="Nome do sensor"
          />
        </View>

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
            {renderCampoLimite('Abaixo de', umidadeAtencaoMinima, setUmidadeAtencaoMinima, '%', '40%')}
            {renderCampoLimite('Acima de', umidadeAtencaoMaxima, setUmidadeAtencaoMaxima, '%', '73%')}
          </View>
          <Text style={styles.nivelAlerta}>Crítico · fora desta faixa</Text>
          <View style={styles.limitesLinha}>
            {renderCampoLimite('Abaixo de', umidadeCriticaMinima, setUmidadeCriticaMinima, '%', '20%')}
            {renderCampoLimite('Acima de', umidadeCriticaMaxima, setUmidadeCriticaMaxima, '%', '80%')}
          </View>
        </View>

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
            {renderCampoLimite('Abaixo de', temperaturaAtencaoMinima, setTemperaturaAtencaoMinima, `°${unidade}`, `20°${unidade}`)}
            {renderCampoLimite('Acima de', temperaturaAtencaoMaxima, setTemperaturaAtencaoMaxima, `°${unidade}`, `30°${unidade}`)}
          </View>
          <Text style={styles.nivelAlerta}>Crítico · fora desta faixa</Text>
          <View style={styles.limitesLinha}>
            {renderCampoLimite('Abaixo de', temperaturaCriticaMinima, setTemperaturaCriticaMinima, `°${unidade}`, `15°${unidade}`)}
            {renderCampoLimite('Acima de', temperaturaCriticaMaxima, setTemperaturaCriticaMaxima, `°${unidade}`, `40°${unidade}`)}
          </View>
        </View>

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
            selecionado={unidade}
            aoSelecionar={setUnidade}
          />
          <View style={styles.divisor} />
          <Text style={styles.rotulo}>Período padrão</Text>
          <Text style={styles.descricao}>Período selecionado ao abrir os detalhes do sensor.</Text>
          <Opcoes
            valores={[{ valor: 'day', rotulo: 'Dia' }, { valor: 'week', rotulo: 'Semana' }, { valor: 'month', rotulo: 'Mês' }]}
            selecionado={periodoPadrao}
            aoSelecionar={setPeriodoPadrao}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
