import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

export default function HomeScreen() {
  const fazendas = [
    { id: 1, nome: 'Fazenda São José' },
    { id: 2, nome: 'Fazenda Boa Vista' },
    { id: 3, nome: 'Fazenda Esperança' },
    { id: 4, nome: 'Fazenda Santa Clara' },
    { id: 5, nome: 'Fazenda Bela Vista' },
    { id: 6, nome: 'Fazenda Nova Esperança' },
    { id: 7, nome: 'Fazenda São Pedro' },
    { id: 8, nome: 'Fazenda do Vale' },
    { id: 9, nome: 'Fazenda Primavera' },
    { id: 10, nome: 'Fazenda Boa Água' },
    { id: 11, nome: 'Fazenda Recanto' },
    { id: 12, nome: 'Fazenda Horizonte' },
  ];

  const criarFazenda = () => {
    console.log('Criar fazenda');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* CONTA */}
      <View style={styles.header}>
        <Text style={styles.ola}>
          Olá,
        </Text>

        {/* Futuramente virá da API */}
        <Text style={styles.nomeConta}>
          Nome da conta
        </Text>
      </View>


      {/* ALERTAS */}
      <View style={styles.section}>
        <Text style={styles.tituloSecao}>
          Alertas
        </Text>

        <View style={styles.alertCard}>
          <Text style={styles.alertText}>
            Você não possui novos alertas.
          </Text>
        </View>
      </View>


      {/* FAZENDAS */}
      <View style={styles.fazendasSection}>

        {/* TÍTULO */}
        <View style={styles.fazendasHeader}>
          <Text style={styles.tituloSecao}>
            Fazendas
          </Text>

          <TouchableOpacity
            style={styles.criarButton}
            onPress={criarFazenda}
          >
            <Text style={styles.criarButtonText}>
              + Criar fazenda
            </Text>
          </TouchableOpacity>
        </View>


        {/* CAIXA DAS FAZENDAS */}
        {fazendas.length > 0 ? (
          <View style={styles.fazendasBox}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.fazendasList}
            >
              {fazendas.map((fazenda) => (
                <TouchableOpacity
                  key={fazenda.id}
                  style={styles.fazendaCard}
                >
                  <Text style={styles.fazendaNome}>
                    {fazenda.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Não tem nenhuma fazenda adicionada.
            </Text>

            <Text style={styles.emptySubtext}>
              Crie uma fazenda para começar.
            </Text>
          </View>
        )}

      </View>

    </SafeAreaView>
  );
}