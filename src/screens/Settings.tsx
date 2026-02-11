import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function Settings() {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* GERAL */}
      <Text style={styles.sectionTitle}>GERAL</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.row}>
          <View style={styles.iconBox}>
            <Feather name="settings" size={18} color="#1E88E5" />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Tema do Aplicativo</Text>
            <Text style={styles.rowSubtitle}>Automático</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#B0B5BA" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View style={styles.iconBox}>
            <Ionicons name="notifications-outline" size={18} color="#1E88E5" />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Notificações</Text>
            <Text style={styles.rowSubtitle}>Ativado</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#B0B5BA" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View style={styles.iconBox}>
            <Ionicons name="information-circle-outline" size={18} color="#1E88E5" />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Informações sobre o App</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#B0B5BA" />
        </TouchableOpacity>
      </View>

      {/* PRIVACIDADE */}
      <Text style={[styles.sectionTitle, { color: '#E53935' }]}>
        PRIVACIDADE E DADOS
      </Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: '#FFE5E5' }]}>
            <MaterialIcons name="delete-outline" size={18} color="#E53935" />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: '#E53935' }]}>
              Limpar Todos os Gastos
            </Text>
            <Text style={styles.rowSubtitle}>
              Esta ação não pode ser desfeita
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#B0B5BA" />
        </TouchableOpacity>
      </View>

      {/* SUPORTE */}
      <View style={styles.supportCard}>
        <Ionicons name="headset-outline" size={30} color="#1E88E5" />
        <Text style={styles.supportTitle}>Precisa de ajuda?</Text>
        <Text style={styles.supportText}>
          Nossa equipe está pronta para ajudar você com suas finanças.
        </Text>

        <TouchableOpacity style={styles.supportButton}>
          <Text style={styles.supportButtonText}>Contatar Suporte</Text>
        </TouchableOpacity>
      </View>

      {/* Versão */}
      <Text style={styles.version}>VERSÃO 2.4.0</Text>
      <Text style={styles.footer}>
        © 2023 Finance App. Todos os direitos reservados.
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F8FB',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  backText: {
    color: '#1E88E5',
    fontSize: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A8F95',
    marginBottom: 10,
    marginTop: 15,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 5,
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },

  iconBox: {
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
    marginRight: 12,
  },

  rowText: {
    flex: 1,
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  rowSubtitle: {
    fontSize: 12,
    color: '#8A8F95',
    marginTop: 2,
  },

  supportCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },

  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  supportText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#6B6F75',
    marginVertical: 10,
  },

  supportButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  supportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9AA0A6',
    marginTop: 25,
  },

  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: '#C0C4C8',
    marginTop: 5,
  },
});
