import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFinance, CategoryName } from "../context/FinanceContext";

type CategoryMeta = {
  name: CategoryName;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

function parseBRLToNumber(input: string): number {
  const cleaned = input
    .replace(/\s/g, "")
    .replace(/[R$]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatBRL(value: number) {
  const safe = Number(value) || 0;

  try {
    return safe.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  } catch {
    return `R$ ${safe.toFixed(2)}`.replace(".", ",");
  }
}

export default function AddExpenseScreen() {
  const navigation = useNavigation<any>();
  const { addExpense, plan, getCategoryLimit, categoryHasLimit } = useFinance();

  const allCategories = useMemo<CategoryMeta[]>(
    () => [
      { name: "Mercado", icon: "cart", color: "#2563eb" },
      { name: "Transporte", icon: "car", color: "#0ea5e9" },
      { name: "Lazer", icon: "game-controller", color: "#7c3aed" },
      { name: "Alimentação", icon: "restaurant", color: "#f97316" },
      { name: "Casa", icon: "home", color: "#16a34a" },
      { name: "Combustível", icon: "flame", color: "#ef4444" },
      { name: "Assinaturas", icon: "card", color: "#64748b" },
      { name: "Outros", icon: "ellipsis-horizontal", color: "#334155" },
    ],
    []
  );

  const categories = useMemo<CategoryMeta[]>(() => {
    const selected = plan?.selectedCategories ?? [];
    if (selected.length > 0) {
      const selectedSet = new Set(selected);
      return allCategories.filter((item) => selectedSet.has(item.name));
    }
    return allCategories;
  }, [allCategories, plan?.selectedCategories]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<CategoryName>(
    categories[0]?.name ?? "Mercado"
  );
  const [saving, setSaving] = useState(false);

  const todayLabel = useMemo(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }, []);

  const selectedCategory =
    categories.find((item) => item.name === category) ?? allCategories[0];

  const selectedCategoryLimit = getCategoryLimit(category);
  const selectedCategoryHasLimit = categoryHasLimit(category);

  const canSave =
    title.trim().length > 0 && amount.trim().length > 0 && !saving;

  const goToCategoriesScreen = () => {
    try {
      const parentNavigation = navigation.getParent?.();

      if (parentNavigation?.navigate) {
        parentNavigation.navigate("Categories");
        return;
      }
    } catch {}

    try {
      navigation.navigate("Categories");
      return;
    } catch {}

    try {
      navigation.navigate("HomeTabs", { screen: "Categories" });
      return;
    } catch {}

    Alert.alert(
      "Não foi possível abrir Categorias",
      "Verifique se a rota da aba Categorias está configurada na navegação."
    );
  };

  const saveExpenseDirectly = async () => {
    const valueNumber = parseBRLToNumber(amount);

    if (!valueNumber || valueNumber <= 0) {
      Alert.alert("Valor inválido", "Digite um valor maior que zero.");
      return;
    }

    try {
      setSaving(true);

      await addExpense({
        title: title.trim(),
        category,
        value: valueNumber,
        note: note.trim(),
      });

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.message ?? "Não foi possível salvar o gasto."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    const valueNumber = parseBRLToNumber(amount);

    if (!valueNumber || valueNumber <= 0) {
      Alert.alert("Valor inválido", "Digite um valor maior que zero.");
      return;
    }

    if (!selectedCategoryHasLimit) {
      Alert.alert(
        "Categoria sem orçamento definido",
        `A categoria ${category} ainda não tem um limite mensal configurado. Você pode definir o orçamento agora ou continuar mesmo assim.`,
        [
          {
            text: "Definir orçamento",
            onPress: goToCategoriesScreen,
          },
          {
            text: "Continuar mesmo assim",
            onPress: saveExpenseDirectly,
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]
      );
      return;
    }

    await saveExpenseDirectly();
  };

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
              <Text
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
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

          {!selectedCategoryHasLimit && (
            <View
              style={{
                marginTop: 14,
                backgroundColor: "#fff7ed",
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: "#fed7aa",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  backgroundColor: "#ffedd5",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Ionicons name="warning-outline" size={18} color="#c2410c" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: "#9a3412", fontWeight: "900", fontSize: 13 }}>
                  Essa categoria ainda não tem orçamento definido
                </Text>

                <Text style={{ color: "#9a3412", fontSize: 12, marginTop: 4 }}>
                  Você pode salvar o gasto mesmo assim, mas a porcentagem da categoria
                  só fará sentido depois que o limite mensal for definido.
                </Text>

                <TouchableOpacity
                  onPress={goToCategoriesScreen}
                  activeOpacity={0.85}
                  style={{
                    marginTop: 10,
                    alignSelf: "flex-start",
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    height: 34,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#fdba74",
                    flexDirection: "row",
                  }}
                >
                  <Ionicons name="create-outline" size={14} color="#c2410c" />
                  <Text
                    style={{
                      color: "#c2410c",
                      fontWeight: "800",
                      marginLeft: 6,
                      fontSize: 12,
                    }}
                  >
                    Definir orçamento agora
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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

            <Text style={{ marginTop: 14, color: "#64748b", fontSize: 12, fontWeight: "700" }}>
              Categoria
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 10,
              }}
            >
              {categories.map((item, index) => {
                const isActive = item.name === category;
                const bg = isActive ? `${item.color}1A` : "#f1f5f9";
                const border = isActive ? item.color : "transparent";

                return (
                  <TouchableOpacity
                    key={item.name}
                    activeOpacity={0.85}
                    onPress={() => setCategory(item.name)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 12,
                      height: 40,
                      borderRadius: 999,
                      backgroundColor: bg,
                      borderWidth: 1,
                      borderColor: border,
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isActive ? item.color : "#e2e8f0",
                        marginRight: 8,
                      }}
                    >
                      <Ionicons
                        name={item.icon}
                        size={14}
                        color={isActive ? "#fff" : "#475569"}
                      />
                    </View>

                    <Text
                      style={{
                        color: isActive ? item.color : "#334155",
                        fontSize: 12,
                        fontWeight: isActive ? "900" : "700",
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedCategoryHasLimit && (
              <View
                style={{
                  marginTop: 4,
                  backgroundColor: "#eff6ff",
                  borderRadius: 14,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#dbeafe",
                }}
              >
                <Text style={{ color: "#1d4ed8", fontSize: 12, fontWeight: "800" }}>
                  Limite mensal da categoria
                </Text>
                <Text
                  style={{
                    color: "#0f172a",
                    fontSize: 16,
                    fontWeight: "900",
                    marginTop: 4,
                  }}
                >
                  {formatBRL(selectedCategoryLimit)}
                </Text>
              </View>
            )}

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
                  name={selectedCategory.icon}
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

          <TouchableOpacity
            disabled={!canSave || saving}
            activeOpacity={0.9}
            onPress={handleSave}
            style={{
              marginTop: 14,
              backgroundColor: canSave && !saving ? "#1976ff" : "#93c5fd",
              height: 56,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#1976ff",
              shadowOpacity: canSave && !saving ? 0.22 : 0,
              shadowRadius: 16,
              elevation: canSave && !saving ? 10 : 0,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "900" }}>
              {saving ? "Salvando..." : "Salvar gasto"}
            </Text>
          </TouchableOpacity>

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