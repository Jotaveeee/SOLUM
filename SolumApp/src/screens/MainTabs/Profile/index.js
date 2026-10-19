import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import styles from './styles';

export default function Perfil({ navigation }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [criticalEnabled, setCriticalEnabled] = useState(true);

  const handleLogout = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerSubtitle}>CONTA</Text>
            <Text style={styles.headerTitle}>Perfil</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>IG</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Iago Guimarães</Text>
              <Text style={styles.profileFarm}>Fazenda Santa Clara</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Solum Pro</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SENSORES</Text>
            <Text style={styles.statValue}>5</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>HECTARES</Text>
            <Text style={styles.statValue}>480</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações da conta</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <Text style={styles.icon}>✉️</Text>
              <Text style={styles.infoLabel}>E-mail</Text>
            </View>
            <Text style={styles.infoValue}>iagogcampos09@gmail.com</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <Text style={styles.icon}>📍</Text>
              <Text style={styles.infoLabel}>Local</Text>
            </View>
            <Text style={styles.infoValue}>Campinas, SP</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notificações push</Text>
              <Text style={styles.settingSubtitle}>Receba avisos no celular</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5EA', true: '#27AE60' }}
              thumbColor="#FFFFFF"
              onValueChange={setPushEnabled}
              value={pushEnabled}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Somente alertas críticos</Text>
              <Text style={styles.settingSubtitle}>Silencia avisos informativos</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E5EA', true: '#27AE60' }}
              thumbColor="#FFFFFF"
              onValueChange={setCriticalEnabled}
              value={criticalEnabled}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionText}>Gerenciar sensores</Text>
          <Text style={styles.actionIcon}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>↪ Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Início</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>📡</Text>
          <Text style={styles.navText}>Sensores</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navText}>Alertas</Text>
        </View>
        <View style={styles.navItemActive}>
          <Text style={styles.navIconActive}>👤</Text>
          <Text style={styles.navTextActive}>Perfil</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}