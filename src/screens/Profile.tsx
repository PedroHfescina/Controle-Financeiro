import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function User() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Perfil</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Avatar */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.editAvatar}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Ricardo Silva</Text>
        <Text style={styles.email}>ricardo.silva@email.com</Text>
      </View>

      {/* Conta */}
      <Text style={styles.sectionTitle}>CONTA</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="person-outline" size={22} color="#4A90E2" />
          <Text style={styles.optionText}>Editar Nome</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="cash-outline" size={22} color="#4A90E2" />
          <View style={{ flex: 1 }}>
            <Text style={styles.optionText}>Preferências de Moeda</Text>
            <Text style={styles.optionSub}>Real Brasileiro (BRL)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Preferências */}
      <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="settings-outline" size={22} color="#4A90E2" />
          <Text style={styles.optionText}>Configurações do App</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2F80ED',
    padding: 8,
    borderRadius: 20,
  },

  name: {
    fontSize: 20,
    fontWeight: '600',
  },

  email: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    gap: 15,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
  },

  optionSub: {
    fontSize: 13,
    color: '#777',
  },
});
