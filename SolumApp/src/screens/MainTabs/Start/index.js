import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";

import styles from './styles';

export default function Start() {
  const navigation = useNavigation();
  const fazendas = [
  ];


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
            onPress={() => navigation.replace('NewFazenda')}
          >
            <Text style={styles.criarButtonText}>
              Criar fazenda
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