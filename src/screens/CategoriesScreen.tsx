import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFinance, CategoryName, CategorySummary } from "../context/FinanceContext";

function formatBRL(value: number) {
  const safe = Number(value) || 0;

  try {
    return safe.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  } catch {
    const fixed = safe.toFixed(2).replace(".", ",");
    const parts = fixed.split(",");
    const int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `R$ ${int},${parts[1]}`;
  }
}

function parseBRL(input: string) {
  const raw = input
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function getMonthLabel() {
  return new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function getCategoryMeta(name: CategoryName) {
  const map: Record<
    CategoryName,
    {
      subtitle: string;
      icon: keyof typeof Ionicons.glyphMap;
      baseColor: string;
    }
  > = {
    Mercado: {
      subtitle: "Compras do mês",
      icon: "cart",
      baseColor: "#2563eb",
    },
    Transporte: {
      subtitle: "Apps e deslocamento",
      icon: "car",
      baseColor: "#0ea5e9",
    },
    Lazer: {
      subtitle: "Diversão e entretenimento",
      icon: "game-controller",
      baseColor: "#7c3aed",
    },
    Alimentação: {
      subtitle: "Restaurantes e delivery",
      icon: "restaurant",
      baseColor: "#f97316",
    },
    Casa: {
      subtitle: "Contas e despesas da casa",
      icon: "home",
      baseColor: "#16a34a",
    },
    Combustível: {
      subtitle: "Abastecimento do veículo",
      icon: "flame",
      baseColor: "#ef4444",
    },
    Assinaturas: {
      subtitle: "Serviços recorrentes",
      icon: "card",
      baseColor: "#64748b",
    },
    Outros: {
      subtitle: "Despesas gerais",
      icon: "ellipsis-horizontal",
      baseColor: "#334155",
    },
  };

  return map[name];
}

function getStatusColor(status: CategorySummary["status"], baseColor: string) {
  if (status === "danger") return "#ef4444";
  if (status === "warning") return "#f59e0b";
  if (status === "safe") return "#16a34a";
  return baseColor;
}

function getStatusLabel(item: CategorySummary) {
  if (!item.hasLimit) return "SEM LIMITE";
  if (item.status === "danger") return "CRÍTICO";
  if (item.status === "warning") return "ATENÇÃO";
  return "CONTROLADO";
}

export default function CategoriesScreen() {
  const {
    income,
    savingsGoal,
    categories,
    expenses,
    updateCategoryLimit,
  } = useFinance();

  const [editingCategory, setEditingCategory] = useState<CategoryName | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [savingCategory, setSavingCategory] = useState<CategoryName | null>(null);

  const monthLabel = useMemo(() => getMonthLabel(), []);

  const totalAvailable = Math.max(0, income - savingsGoal);

  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  }, [expenses]);

  const totalCategoryBudget = useMemo(() => {
    return categories.reduce((acc, item) => acc + (Number(item.limit) || 0), 0);
  }, [categories]);

  const totalRemaining = Math.max(0, totalAvailable - totalSpent);

  const averageProgress = useMemo(() => {
    const withLimit = categories.filter((item) => item.hasLimit);
    if (!withLimit.length) return 0;
    return (
      withLimit.reduce((acc, item) => acc + item.progress, 0) / withLimit.length
    );
  }, [categories]);

  const openEdit = (item: CategorySummary) => {
    setEditingCategory(item.name);
    setEditingValue(item.limit > 0 ? String(item.limit).replace(".", ",") : "");
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingValue("");
  };

  const saveEdit = async (categoryName: CategoryName) => {
    const parsed = parseBRL(editingValue);

    if (parsed <= 0) {
      Alert.alert(
        "Limite inválido",
        "Informe um valor maior que zero para o limite da categoria."
      );
      return;
    }

    try {
      setSavingCategory(categoryName);
      await updateCategoryLimit(categoryName, parsed);
      cancelEdit();
    } catch (error) {
      console.error("Erro ao atualizar limite:", error);
      Alert.alert(
        "Erro ao salvar",
        "Não foi possível atualizar o limite da categoria agora."
      );
    } finally {
      setSavingCategory(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#6b7280", fontSize: 12, textTransform: "capitalize" }}>
                {monthLabel}
              </Text>
              <Text
                style={{
                  color: "#111827",
                  fontSize: 22,
                  fontWeight: "900",
                  marginTop: 2,
                }}
              >
                Orçamento por Categoria
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <Ionicons name="options-outline" size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 14,
              borderRadius: 18,
              backgroundColor: "#1976ff",
              padding: 16,
              shadowColor: "#1976ff",
              shadowOpacity: 0.18,
              shadowRadius: 14,
              elevation: 6,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  Total disponível para gastar
                </Text>

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 28,
                    fontWeight: "900",
                    marginTop: 6,
                  }}
                >
                  {formatBRL(totalAvailable)}
                </Text>
              </View>

              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 14,
                  backgroundColor: "rgba(255,255,255,0.16)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="wallet-outline" size={18} color="#fff" />
              </View>
            </View>

            <View
              style={{
                marginTop: 14,
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 12,
                  fontWeight: "700",
                  marginBottom: 6,
                }}
              >
                Gasto total:{" "}
                <Text style={{ fontWeight: "900" }}>{formatBRL(totalSpent)}</Text>
              </Text>

              <Text
                style={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 12,
                  fontWeight: "700",
                  marginBottom: 6,
                }}
              >
                Restante:{" "}
                <Text style={{ fontWeight: "900" }}>{formatBRL(totalRemaining)}</Text>
              </Text>
            </View>

            <View
              style={{
                marginTop: 8,
                backgroundColor: "rgba(255,255,255,0.12)",
                borderRadius: 14,
                padding: 12,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>
                Meta de economia: <Text style={{ fontWeight: "800" }}>{formatBRL(savingsGoal)}</Text>
              </Text>
              <Text style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>
                Soma dos limites: <Text style={{ fontWeight: "800" }}>{formatBRL(totalCategoryBudget)}</Text>
              </Text>
              <Text style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>
                Média de uso das categorias:{" "}
                <Text style={{ fontWeight: "800" }}>{Math.round(averageProgress)}%</Text>
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 18,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#111827",
                fontSize: 16,
                fontWeight: "900",
                flex: 1,
              }}
            >
              Categorias
            </Text>

            <Text style={{ color: "#64748b", fontWeight: "700", fontSize: 12 }}>
              Toque em editar para mudar o limite
            </Text>
          </View>

          <View style={{ marginTop: 12 }}>
            {categories.length ? (
              categories.map((category, index) => (
                <View
                  key={category.id}
                  style={{ marginBottom: index < categories.length - 1 ? 12 : 0 }}
                >
                  <CategoryBudgetCard
                    item={category}
                    isEditing={editingCategory === category.name}
                    editingValue={editingValue}
                    saving={savingCategory === category.name}
                    onEdit={() => openEdit(category)}
                    onCancel={cancelEdit}
                    onChangeValue={setEditingValue}
                    onSave={() => saveEdit(category.name)}
                  />
                </View>
              ))
            ) : (
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 12,
                  elevation: 2,
                }}
              >
                <Text style={{ color: "#111827", fontWeight: "900", fontSize: 14 }}>
                  Nenhuma categoria configurada
                </Text>
                <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 6 }}>
                  Volte ao setup ou selecione categorias no seu planejamento.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function CategoryBudgetCard({
  item,
  isEditing,
  editingValue,
  saving,
  onEdit,
  onCancel,
  onChangeValue,
  onSave,
}: {
  item: CategorySummary;
  isEditing: boolean;
  editingValue: string;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onChangeValue: (value: string) => void;
  onSave: () => void;
}) {
  const meta = getCategoryMeta(item.name);
  const statusColor = getStatusColor(item.status, meta.baseColor);
  const statusLabel = getStatusLabel(item);

  const remainingLabel = item.hasLimit
    ? item.spent > item.limit
      ? "Excedido"
      : "Restante"
    : "Limite";

  const remainingValue = item.hasLimit
    ? item.spent > item.limit
      ? formatBRL(item.spent - item.limit)
      : formatBRL(item.remaining)
    : "Não definido";

  const safeProgress = Math.max(0, Math.min(100, item.progress));

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            backgroundColor: `${statusColor}1A`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name={meta.icon} size={20} color={statusColor} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: "#111827", fontWeight: "900", fontSize: 14 }}>
            {item.name}
          </Text>
          <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
            {meta.subtitle}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: "#94a3b8", fontWeight: "900", fontSize: 10 }}>
            {statusLabel}
          </Text>
          <Text
            style={{
              color: statusColor,
              fontWeight: "900",
              fontSize: 14,
              marginTop: 2,
            }}
          >
            {item.hasLimit ? `${Math.round(safeProgress)}%` : "--"}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <View
          style={{
            height: 7,
            backgroundColor: "#e5e7eb",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${safeProgress}%` as `${number}%`,
              height: "100%",
              backgroundColor: statusColor,
              borderRadius: 999,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            flexWrap: "wrap",
          }}
        >
          <Text style={{ color: "#6b7280", fontSize: 12, marginBottom: 4 }}>
            Gasto:{" "}
            <Text style={{ color: "#111827", fontWeight: "800" }}>
              {formatBRL(item.spent)}
            </Text>
          </Text>

          <Text style={{ color: "#6b7280", fontSize: 12, marginBottom: 4 }}>
            Limite:{" "}
            <Text style={{ color: "#111827", fontWeight: "800" }}>
              {item.hasLimit ? formatBRL(item.limit) : "Não definido"}
            </Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: 8,
            backgroundColor: "#f8fafc",
            borderRadius: 14,
            padding: 12,
          }}
        >
          <Text style={{ color: "#64748b", fontSize: 12 }}>
            {remainingLabel}:{" "}
            <Text style={{ color: statusColor, fontWeight: "800" }}>
              {remainingValue}
            </Text>
          </Text>
        </View>
      </View>

      {isEditing ? (
        <View style={{ marginTop: 14 }}>
          <Text style={{ color: "#374151", fontSize: 12, marginBottom: 6 }}>
            Novo limite mensal
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#e5e7eb",
              borderRadius: 12,
              paddingHorizontal: 12,
              height: 48,
            }}
          >
            <Text style={{ marginRight: 8, color: "#6b7280" }}>R$</Text>
            <TextInput
              value={editingValue}
              onChangeText={onChangeValue}
              keyboardType="numeric"
              placeholder="0,00"
              placeholderTextColor="#9ca3af"
              style={{ flex: 1, fontSize: 15, color: "#111827" }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: "#e5e7eb",
                borderRadius: 12,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              <Text style={{ color: "#374151", fontWeight: "700" }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSave}
              disabled={saving}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: "#2563eb",
                borderRadius: 12,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                {saving ? "Salvando..." : "Salvar limite"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.85}
          style={{
            marginTop: 14,
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#dbeafe",
            backgroundColor: "#eff6ff",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Ionicons name="create-outline" size={16} color="#2563eb" />
          <Text
            style={{
              color: "#2563eb",
              fontWeight: "800",
              marginLeft: 8,
            }}
          >
            {item.hasLimit ? "Editar limite" : "Definir limite"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}