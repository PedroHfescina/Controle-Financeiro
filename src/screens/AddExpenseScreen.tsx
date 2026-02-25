import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type CategoryKey =
  | "Mercado"
  | "Transporte"
  | "Lazer"
  | "Alimentação"
  | "Casa"
  | "Combustível"
  | "Assinaturas"
  | "Outros";

export default function AddExpenseScreen() {
  const navigation = useNavigation();

  const categories = useMemo(
    () =>
      [
        { name: "Mercado", icon: "cart", color: "#2563eb" },
        { name: "Transporte", icon: "car", color: "#0ea5e9" },
        { name: "Lazer", icon: "game-controller", color: "#7c3aed" },
        { name: "Alimentação", icon: "restaurant", color: "#f97316" },
        { name: "Casa", icon: "home", color: "#16a34a" },
        { name: "Combustível", icon: "flame", color: "#ef4444" },
        { name: "Assinaturas", icon: "card", color: "#64748b" },
        { name: "Outros", icon: "ellipsis-horizontal", color: "#334155" },
      ] as const,
    []
  );

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<CategoryKey>("Mercado");

  const todayLabel = useMemo(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }, []);

  const selectedCategory = categories.find((c) => c.name === category)!;

  const canSave = title.trim().length > 0 && amount.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 28 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 2,
                marginRight: 12,
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#111827" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "#111827", fontSize: 18, fontWeight: "900" }}>
                Novo gasto
              </Text>
              <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                Preencha os dados para registrar
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text style={{ color: "#64748b", fontSize: 11, fontWeight: "700" }}>
                {todayLabel}
              </Text>
            </View>
          </View>

          {/* Amount card */}
          <View
            style={{
              marginTop: 14,
              backgroundColor: "#1976ff",
              borderRadius: 18,
              padding: 16,
              shadowColor: "#1976ff",
              shadowOpacity: 0.18,
              shadowRadius: 14,
              elevation: 6,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 0.6,
              }}
            >
              VALOR DO GASTO
            </Text>

            <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 8 }}>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, fontWeight: "900" }}>
                R$
              </Text>

              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0,00"
                placeholderTextColor="rgba(255,255,255,0.7)"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  marginLeft: 10,
                  color: "#fff",
                  fontSize: 34,
                  fontWeight: "900",
                  paddingVertical: 0,
                }}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.85)",
                  marginRight: 8,
                }}
              />
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>
                Categoria: <Text style={{ fontWeight: "900" }}>{category}</Text>
              </Text>
            </View>
          </View>

          {/* Form card */}
          <View
            style={{
              marginTop: 14,
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 14,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <Text style={{ color: "#111827", fontSize: 13, fontWeight: "900" }}>
              Detalhes
            </Text>

            {/* Title */}
            <Text style={{ marginTop: 12, color: "#64748b", fontSize: 12, fontWeight: "700" }}>
              Descrição
            </Text>

            <View
              style={{
                marginTop: 8,
                backgroundColor: "#f1f5f9",
                borderRadius: 14,
                paddingHorizontal: 12,
                height: 50,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="create-outline" size={18} color="#64748b" />
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Supermercado, Uber, iFood..."
                placeholderTextColor="#94a3b8"
                style={{
                  flex: 1,
                  marginLeft: 10,
                  color: "#111827",
                  fontSize: 14,
                }}
              />
            </View>

            {/* Categories */}
            <Text style={{ marginTop: 14, color: "#64748b", fontSize: 12, fontWeight: "700" }}>
              Categoria
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
              {categories.map((c) => {
                const isActive = c.name === category;
                const bg = isActive ? `${c.color}1A` : "#f1f5f9";
                const border = isActive ? c.color : "transparent";

                return (
                  <TouchableOpacity
                    key={c.name}
                    activeOpacity={0.85}
                    onPress={() => setCategory(c.name as CategoryKey)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 12,
                      height: 40,
                      borderRadius: 999,
                      backgroundColor: bg,
                      borderWidth: 1,
                      borderColor: border,
                    }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isActive ? c.color : "#e2e8f0",
                        marginRight: 8,
                      }}
                    >
                      <Ionicons
                        name={c.icon as any}
                        size={14}
                        color={isActive ? "#fff" : "#475569"}
                      />
                    </View>

                    <Text
                      style={{
                        color: isActive ? c.color : "#334155",
                        fontSize: 12,
                        fontWeight: isActive ? "900" : "700",
                      }}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Note */}
            <Text style={{ marginTop: 14, color: "#64748b", fontSize: 12, fontWeight: "700" }}>
              Observação (opcional)
            </Text>

            <View
              style={{
                marginTop: 8,
                backgroundColor: "#f1f5f9",
                borderRadius: 14,
                paddingHorizontal: 12,
                paddingVertical: 10,
                minHeight: 92,
              }}
            >
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Ex: pago no cartão, parcelado, etc."
                placeholderTextColor="#94a3b8"
                multiline
                style={{
                  color: "#111827",
                  fontSize: 14,
                }}
              />
            </View>

            {/* Mini summary */}
            <View
              style={{
                marginTop: 14,
                backgroundColor: "#f8fafc",
                borderRadius: 14,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  backgroundColor: `${selectedCategory.color}1A`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name={selectedCategory.icon as any}
                  size={18}
                  color={selectedCategory.color}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: "#111827", fontWeight: "900", fontSize: 13 }}>
                  {title.trim().length ? title : "Sem descrição"}
                </Text>
                <Text style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
                  {category} • {todayLabel}
                </Text>
              </View>

              <Text style={{ color: "#ef4444", fontWeight: "900", fontSize: 13 }}>
                - R$ {amount.trim().length ? amount : "0,00"}
              </Text>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            disabled={!canSave}
            activeOpacity={0.9}
            onPress={() => {
              // aqui depois você salva no storage/context
              navigation.goBack();
            }}
            style={{
              marginTop: 14,
              backgroundColor: canSave ? "#1976ff" : "#93c5fd",
              height: 56,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#1976ff",
              shadowOpacity: canSave ? 0.22 : 0,
              shadowRadius: 16,
              elevation: canSave ? 10 : 0,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "900" }}>
              Salvar gasto
            </Text>
          </TouchableOpacity>

          {/* Secondary */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.9}
            style={{
              marginTop: 10,
              height: 52,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Text style={{ color: "#111827", fontSize: 14, fontWeight: "800" }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}