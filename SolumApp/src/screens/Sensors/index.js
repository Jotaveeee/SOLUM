import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';

export default function SensoresScreen({ navigation }) {
  const prototipos = [
    {
      id: 1,
      nome: 'Protótipo 01',
      local: 'Talhão 01',
      status: 'Normal',
      umidade: '68%',
      temperatura: '27°C',
    },
    {
      id: 2,
      nome: 'Protótipo 02',
      local: 'Talhão 02',
      status: 'Normal',
      umidade: '74%',
      temperatura: '25°C',
    },
    {
      id: 3,
      nome: 'Protótipo 03',
      local: 'Talhão 03',
      status: 'Atenção',
      umidade: '32%',
      temperatura: '31°C',
    },
    {
      id: 4,
      nome: 'Protótipo 04',
      local: 'Talhão 04',
      status: 'Alerta máximo',
      umidade: '18%',
      temperatura: '36°C',
    },
  ];

  const abrirDetalhes = (prototipo) => {
    console.log('Detalhes do protótipo:', prototipo);

    // Exemplo:
    // navigation.navigate('DetalhesPrototipo', { prototipo });
  };

  /*
   * Define as cores de acordo com o status
   */
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

        {/* CABEÇALHO */}
        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text
              style={styles.fazendaNome}
              numberOfLines={1}
            >
              Fazenda Boa Esperança
            </Text>
          </View>

        </View>

        {/* TÍTULO */}
        <View style={styles.titleContainer}>
          <Text style={styles.titulo}>
            Protótipos
          </Text>

          <Text style={styles.subtitulo}>
            Acompanhe os dados dos sensores instalados na fazenda
          </Text>
        </View>

        {/* LISTA */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {prototipos.map((prototipo) => {
            const statusStyles = getStatusStyles(prototipo.status);

            return (
              <View
                key={prototipo.id}
                style={styles.card}
              >

                {/* CABEÇALHO DO CARD */}
                <View style={styles.cardHeader}>

                  {/* BOLINHA DE STATUS */}
                  <View
                    style={[
                      styles.sensorIcon,
                      statusStyles.bolinha,
                    ]}
                  >
                    <Text style={styles.sensorIconText}>
                      ●
                    </Text>
                  </View>

                  {/* NOME DO PROTÓTIPO */}
                  <View style={styles.sensorTitleContainer}>
                    <Text
                      style={styles.sensorNome}
                      numberOfLines={1}
                    >
                      {prototipo.nome}
                    </Text>

                    <Text
                      style={styles.sensorTipo}
                      numberOfLines={1}
                    >
                      {prototipo.local}
                    </Text>
                  </View>

                  {/* STATUS */}
                  <View
                    style={[
                      styles.status,
                      statusStyles.status,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        statusStyles.statusText,
                      ]}
                    >
                      {prototipo.status}
                    </Text>
                  </View>

                </View>

                {/* DADOS DOS SENSORES */}
                <View style={styles.sensorDataContainer}>

                  {/* UMIDADE */}
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>
                      Umidade atual
                    </Text>

                    <Text style={styles.dataValue}>
                      {prototipo.umidade}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  {/* TEMPERATURA */}
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>
                      Temperatura atual
                    </Text>

                    <Text style={styles.dataValue}>
                      {prototipo.temperatura}
                    </Text>
                  </View>

                </View>

                {/* BOTÃO */}
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => abrirDetalhes(prototipo)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.detailsButtonText}>
                    Ver detalhes
                  </Text>

                  <Text style={styles.arrow}>
                    →
                  </Text>
                </TouchableOpacity>

              </View>
            );
          })}

          <View style={styles.bottomSpace} />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}