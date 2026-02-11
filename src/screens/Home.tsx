import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const expenses = [
  { id: '1', title: 'Outback Steakhouse', category: 'Alimentação · Hoje', value: '- R$ 184,00' },
  { id: '2', title: 'Uber', category: 'Transporte · Hoje', value: '- R$ 22,50' },
  { id: '3', title: 'Amazon Prime', category: 'Assinaturas · Ontem', value: '- R$ 14,90' },
  { id: '4', title: 'Pão de Açúcar', category: 'Mercado · 2 dias atrás', value: '- R$ 412,00' },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Gastos</Text>
      <Text style={styles.subtitle}>Bem-vindo de volta, João</Text>

      <View style={styles.mainCard}>
        <Text style={styles.cardLabel}>TOTAL GASTO NO MÊS</Text>
        <Text style={styles.cardValue}>R$ 2.450,00</Text>
        <Text style={styles.cardInfo}>▼ 12% vs mês passado</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Saldo disponível</Text>
          <Text style={styles.infoValueGreen}>R$ 820,00</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Limite restante</Text>
          <Text style={styles.infoValueBlue}>R$ 1.550,00</Text>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Gastos Recentes</Text>
        <Text style={styles.link}>Ver todos ›</Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.category}</Text>
            </View>
            <Text style={styles.itemValue}>{item.value}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F6F8FB' },

  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: 20 },

  mainCard: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardLabel: { color: '#BBDEFB', fontSize: 12 },
  cardValue: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginVertical: 8 },
  cardInfo: { color: '#E3F2FD' },

  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  infoLabel: { fontSize: 12, color: '#777' },
  infoValueGreen: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  infoValueBlue: { fontSize: 18, fontWeight: 'bold', color: '#1565C0' },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  link: { color: '#1E88E5' },

  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: { fontWeight: 'bold' },
  itemSubtitle: { color: '#777', fontSize: 12 },
  itemValue: { fontWeight: 'bold' },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: '#1E88E5',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 28 },
});
