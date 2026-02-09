import { View, Text, StyleSheet } from 'react-native';

export default function AddExpense() {
  return (
    <View style={styles.container}>
      <Text>➕ Tela de Adicionar Gasto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
