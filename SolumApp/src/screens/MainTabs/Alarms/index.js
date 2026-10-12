
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import styles, { colors } from './styles';

const alarmes = [
  {
    id: '1',
    titulo: 'Umidade do solo baixa',
    descricao: 'O nível de umidade está abaixo do recomendado.',
    fazenda: 'Fazenda 01',
    horario: 'Hoje, 14:32',
    tipo: 'warning',
    icone: 'water-outline',
  },
  {
    id: '2',
    titulo: 'Temperatura elevada',
    descricao: 'A temperatura do solo está acima do limite ideal.',
    fazenda: 'Fazenda 02',
    horario: 'Hoje, 11:45',
    tipo: 'critical',
    icone: 'thermometer-outline',
  },
];

const configuracaoAlarme = {
  warning: {
    label: 'Atenção',
    cor: '#B7791F',
    fundo: '#FFF4D6',
  },
  critical: {
    label: 'Crítico',
    cor: '#D64545',
    fundo: '#FDE8E8',
  },
  normal: {
    label: 'Resolvido',
    cor: '#249057',
    fundo: '#E5F5EB',
  },
};

export default function Alarmes() {

  const navigation = useNavigation();

  const quantidadeAtencao = alarmes.filter(
    (alarme) => alarme.tipo === 'warning'
  ).length;

  const quantidadeCriticos = alarmes.filter(
    (alarme) => alarme.tipo === 'critical'
  ).length;

  const quantidadeResolvidos = alarmes.filter(
    (alarme) => alarme.tipo === 'normal'
  ).length;

  function abrirHistorico() {
    // Navegar para a tela de histórico de alarmes
  }

  function abrirDetalhes() {
    // Navegar para a tela de detalhes do alarme
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo */}
        <View style={styles.resumoCard}>
          <View style={styles.resumoTopo}>
            <View style={styles.resumoIcone}>
              <Ionicons
                name="notifications-outline"
                size={25}
                color={colors.primary}
              />
            </View>

            <View style={styles.resumoTexto}>
              <Text style={styles.resumoTitulo}>
                Alarmes pendentes
              </Text>

              <Text style={styles.resumoDescricao}>
                Avisos recentes que não foram resolvidos
              </Text>
            </View>
          </View>

          <View style={styles.resumoDivisor} />

          <View style={styles.resumoIndicadores}>
            <View style={styles.indicador}>
              <View
                style={[
                  styles.indicadorPonto,
                  { backgroundColor: '#D69E2E' },
                ]}
              />

              <Text style={styles.indicadorValor}>
                {quantidadeAtencao}
              </Text>

              <Text style={styles.indicadorLabel}>
                Atenção
              </Text>
            </View>

            <View style={styles.indicadorSeparador} />

            <View style={styles.indicador}>
              <View
                style={[
                  styles.indicadorPonto,
                  { backgroundColor: '#D64545' },
                ]}
              />

              <Text style={styles.indicadorValor}>
                {quantidadeCriticos}
              </Text>

              <Text style={styles.indicadorLabel}>
                Críticos
              </Text>
            </View>
          </View>
        </View>

        {/* Lista de alarmes */}
        <View style={styles.secao}>
          <View style={styles.secaoCabecalho}>
            <Text style={styles.tituloSecao}>
              Últimos registros
            </Text>

            <Text style={styles.contador}>
              {alarmes.length} registros
            </Text>
          </View>

          {alarmes.length > 0 ? (
            alarmes.map((alarme) => {
              const config = configuracaoAlarme[alarme.tipo];

              return (
                <TouchableOpacity
                  key={alarme.id}
                  style={styles.alarmeCard}
                  activeOpacity={0.75}
                  onPress={() =>
                    navigation.navigate('SensorDetalhes')
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Ver detalhes do alarme: ${alarme.titulo}`}
                >
                  <View
                    style={[
                      styles.alarmeIcone,
                      { backgroundColor: config.fundo },
                    ]}
                  >
                    <Ionicons
                      name={alarme.icone}
                      size={23}
                      color={config.cor}
                    />
                  </View>

                  <View style={styles.alarmeConteudo}>
                    <Text style={styles.alarmeTitulo}>
                      {alarme.titulo}
                    </Text>

                    <Text style={styles.alarmeDescricao}>
                      {alarme.descricao}
                    </Text>

                    <View style={styles.alarmeInformacoes}>
                      <View style={styles.alarmeInformacao}>
                        <Ionicons
                          name="leaf-outline"
                          size={14}
                          color={colors.textSecondary}
                        />

                        <Text style={styles.alarmeInformacaoTexto}>
                          {alarme.fazenda}
                        </Text>
                      </View>

                      <View style={styles.alarmeInformacao}>
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color={colors.textSecondary}
                        />

                        <Text style={styles.alarmeInformacaoTexto}>
                          {alarme.horario}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: config.fundo },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTexto,
                          { color: config.cor },
                        ]}
                      >
                        {config.label}
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textSecondary}
                    style={styles.alarmeSeta}
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.estadoVazio}>
              <Ionicons
                name="notifications-off-outline"
                size={38}
                color={colors.textSecondary}
              />

              <Text style={styles.estadoVazioTitulo}>
                Nenhum alarme registrado
              </Text>

              <Text style={styles.estadoVazioDescricao}>
                Quando houver novos avisos, eles aparecerão aqui.
              </Text>
            </View>
          )}
        </View>

        {/* Acesso ao histórico */}
        <TouchableOpacity
          style={styles.historicoCard}
          activeOpacity={0.75}
          onPress={abrirHistorico}
          accessibilityRole="button"
          accessibilityLabel="Abrir histórico de alarmes"
        >
          <View style={styles.historicoIcone}>
            <Ionicons
              name="time-outline"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.historicoTexto}>
            <Text style={styles.historicoTitulo}>
              Histórico de Alarmes
            </Text>

            <Text style={styles.historicoDescricao}>
              Consulte os alarmes resolvidos
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
