import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Setup">;

export default function SetupScreen({ navigation }: Props) {
  const [selected, setSelected] = useState("Mercado");
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState("");

  const categories = useMemo(
    () => [
      { name: "Mercado", icon: "cart" },
      { name: "Transporte", icon: "car" },
      { name: "Lazer", icon: "game-controller" },
      { name: "Alimentação", icon: "restaurant" },
      { name: "Combustível", icon: "flame" },
      { name: "Assinaturas", icon: "card" },
      { name: "Outros", icon: "ellipsis-horizontal" },
    ],
    []
  );

  const canContinue = income.trim().length > 0 && goal.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Indicador superior */}
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#cbd5e1",
              borderRadius: 2,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />

          <Text style={{ fontSize: 26, fontWeight: "700", color: "#111827" }}>
            Vamos planejar seu mês?
          </Text>

          <Text
            style={{
              color: "#6b7280",
              marginTop: 6,
              marginBottom: 24,
            }}
          >
            Defina sua renda e metas para começar.
          </Text>

          {/* Renda */}
          <Text style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>
            Renda Mensal (R$)
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#e5e7eb",
              borderRadius: 12,
              paddingHorizontal: 12,
              height: 50,
              marginBottom: 12,
            }}
          >
            <Text style={{ marginRight: 8, color: "#6b7280" }}>R$</Text>
            <TextInput
              value={income}
              onChangeText={setIncome}
              keyboardType="numeric"
              placeholder="5.000,00"
              placeholderTextColor="#9ca3af"
              style={{ flex: 1, fontSize: 15, color: "#111827" }}
            />
          </View>

          {/* Meta */}
          <Text style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>
            Meta de Economia
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#e5e7eb",
              borderRadius: 12,
              paddingHorizontal: 12,
              height: 50,
            }}
          >
            <Text style={{ marginRight: 8, color: "#6b7280" }}>R$</Text>
            <TextInput
              value={goal}
              onChangeText={setGoal}
              keyboardType="numeric"
              placeholder="Quanto quer guardar?"
              placeholderTextColor="#9ca3af"
              style={{ flex: 1, fontSize: 15, color: "#111827" }}
            />
          </View>

          {/* Seção categorias */}
          <Text
            style={{
              marginTop: 24,
              marginBottom: 14,
              fontSize: 12,
              fontWeight: "700",
              color: "#94a3b8",
            }}
          >
            O QUE VOCÊ QUER CONTROLAR?
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {categories.map((item) => {
              const isSelected = selected === item.name;

              return (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => setSelected(item.name)}
                  activeOpacity={0.85}
                  style={{
                    width: "48%",
                    backgroundColor: isSelected ? "#e0edff" : "#e5e7eb",
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: isSelected ? 1 : 0,
                    borderColor: "#2563eb",
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: isSelected ? "#2563eb" : "#d1d5db",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color={isSelected ? "#fff" : "#6b7280"}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      color: isSelected ? "#2563eb" : "#374151",
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botão */}
          <TouchableOpacity
            onPress={() => navigation.replace("HomeTabs")}
            disabled={!canContinue}
            activeOpacity={0.85}
            style={{
              backgroundColor: canContinue ? "#2563eb" : "#93c5fd",
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: "center",
              marginTop: 20,
              shadowColor: "#2563eb",
              shadowOpacity: canContinue ? 0.3 : 0,
              shadowRadius: 6,
              elevation: canContinue ? 5 : 0,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
              Começar Planejamento
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              marginTop: 10,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 11,
            }}
          >
            Você poderá alterar isso depois em Configurações.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}