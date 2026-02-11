import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddExpense() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adicionar Gasto</Text>

      {/* Nome */}
      <Text style={styles.label}>NOME DO GASTO</Text>
      <TextInput
        placeholder="Ex: Supermercado"
        placeholderTextColor="#A0A4A8"
        style={styles.input}
      />

      {/* Valor */}
      <Text style={styles.label}>VALOR</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.currency}>R$</Text>
        <TextInput
          placeholder="0,00"
          placeholderTextColor="#C0C4C8"
          keyboardType="numeric"
          style={styles.valueInput}
        />
      </View>

      {/* Categoria */}
      <Text style={styles.label}>CATEGORIA</Text>
      <TouchableOpacity style={styles.input}>
        <Text style={styles.selectText}>Selecione uma categoria</Text>
        <Ionicons name="chevron-down" size={18} color="#A0A4A8" />
      </TouchableOpacity>

      {/* Data */}
      <Text style={styles.label}>DATA</Text>
      <TouchableOpacity style={styles.input}>
        <Text style={styles.selectText}>27/10/2023</Text>
        <Ionicons name="calendar-outline" size={18} color="#A0A4A8" />
      </TouchableOpacity>

      {/* Sugestões */}
      <Text style={styles.label}>SUGESTÕES RÁPIDAS</Text>
      <View style={styles.suggestionsRow}>
        <TouchableOpacity style={styles.suggestionActive}>
          <Text style={styles.suggestionActiveText}>Uber</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestion}>
          <Text style={styles.suggestionText}>Ifood</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestion}>
          <Text style={styles.suggestionText}>Farmácia</Text>
        </TouchableOpacity>
      </View>

      {/* Botão */}
      <TouchableOpacity style={styles.saveButton}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.saveText}>Salvar Gasto</Text>
      </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A7F85',
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    backgroundColor: '#ECEFF3',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  valueContainer: {
    backgroundColor: '#ECEFF3',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  currency: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginRight: 10,
  },

  valueInput: {
    fontSize: 22,
    flex: 1,
  },

  selectText: {
    color: '#A0A4A8',
  },

  suggestionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  suggestion: {
    backgroundColor: '#E3E6EB',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },

  suggestionText: {
    color: '#555',
  },

  suggestionActive: {
    backgroundColor: '#D0E6FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },

  suggestionActiveText: {
    color: '#1E88E5',
    fontWeight: '600',
  },

  saveButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#1E88E5',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
