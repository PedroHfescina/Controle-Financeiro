import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFinance, CategoryName } from "../context/FinanceContext";

type ExpenseLike = {
  id?: string;
  title?: string;
  category?: string;
  value?: number | string;
  note?: string;
  createdAt?: any;
};

function formatBRL(value: number) {
  const safeValue = Number(value) || 0;

  try {
    return safeValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  } catch {
    return `R$ ${safeValue.toFixed(2)}`.replace(".", ",");
  }
}

function getDateFromInput(input: any): Date | null {
  if (!input) return null;

  if (typeof input === "object" && typeof input.toDate === "function") {
    const d = input.toDate();
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
  }

  if (input instanceof Date) {
    return !Number.isNaN(input.getTime()) ? input : null;
  }

  if (typeof input === "string" || typeof input === "number") {
    const d = new Date(input);
    return !Number.isNaN(d.getTime()) ? d : null;
  }

  return null;
}

function formatFullDateTime(input: any) {
  const d = getDateFromInput(input);
  if (!d) return "Data indisponível";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} • ${hh}:${min}`;
}

function normalizeCategoryName(value?: string): CategoryName {
  if (!value) return "Outros";

  const normalized = value.trim().toLowerCase();

  const map: Record<string, CategoryName> = {
    mercado: "Mercado",
    transporte: "Transporte",
    lazer: "Lazer",
    alimentação: "Alimentação",
    alimentacao: "Alimentação",
    casa: "Casa",
    combustível: "Combustível",
    combustivel: "Combustível",
    assinaturas: "Assinaturas",
    outros: "Outros",
  };

  return map[normalized] ?? "Outros";
}

function getCategoryMeta(name?: string) {
  const safeName = normalizeCategoryName(name);

  const map: Record<
    CategoryName,
    { icon: keyof typeof Ionicons.glyphMap; accent: string }
  > = {
    Mercado: { icon: "cart", accent: "#2563eb" },
    Transporte: { icon: "car", accent: "#0ea5e9" },
    Lazer: { icon: "game-controller", accent: "#7c3aed" },
    Alimentação: { icon: "restaurant", accent: "#f97316" },
    Casa: { icon: "home", accent: "#16a34a" },
    Combustível: { icon: "flame", accent: "#ef4444" },
    Assinaturas: { icon: "card", accent: "#64748b" },
    Outros: { icon: "ellipsis-horizontal", accent: "#334155" },
  };

  return map[safeName];
}

function getCurrentMonthLabel() {
  return new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export default function ExpensesHistoryScreen() {
  const navigation = useNavigation<any>();
  const { expenses } = useFinance();

  const sortedExpenses = useMemo(() => {
    return [...(expenses ?? [])].sort((a: ExpenseLike, b: ExpenseLike) => {
      const aTime = getDateFromInput(a?.createdAt)?.getTime() ?? 0;
      const bTime = getDateFromInput(b?.createdAt)?.getTime() ?? 0;
      return bTime - aTime;
    });
  }, [expenses]);

  const monthLabel = useMemo(() => getCurrentMonthLabel(), []);

  const totalSpent = useMemo(() => {
    return sortedExpenses.reduce(
      (acc: number, item: ExpenseLike) => acc + (Number(item?.value) || 0),
      0
    );
  }, [sortedExpenses]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 32 }}
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
              <Text
                style={{
                  color: "#6b7280",
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                {monthLabel}
              </Text>
              <Text
                style={{ color: "#111827", fontSize: 20, fontWeight: "900" }}
              >
                Histórico de gastos
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
                fontWeight: "700",
                letterSpacing: 0.6,
              }}
            >
              TOTAL DE GASTOS DO MÊS
            </Text>

            <Text
              style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: "900",
                marginTop: 6,
              }}
            >
              {formatBRL(totalSpent)}
            </Text>

            <Text
              style={{
                color: "rgba(255,255,255,0.92)",
                fontSize: 12,
                marginTop: 8,
              }}
            >
              {sortedExpenses.length} {sortedExpenses.length === 1 ? "lançamento" : "lançamentos"}
            </Text>
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
                fontSize: 16,
                fontWeight: "900",
                color: "#111827",
                flex: 1,
              }}
            >
              Todos os gastos
            </Text>
          </View>

          <View style={{ marginTop: 12 }}>
            {sortedExpenses.length ? (
              sortedExpenses.map((expense: ExpenseLike, index: number) => {
                const category = normalizeCategoryName(expense?.category);
                const meta = getCategoryMeta(category);

                return (
                  <ExpenseHistoryRow
                    key={expense.id ?? `${expense.title}-${index}`}
                    title={expense.title || "Gasto"}
                    subtitle={`${formatFullDateTime(expense.createdAt)} • ${category}`}
                    value={`- ${formatBRL(Number(expense.value) || 0)}`}
                    icon={meta.icon}
                    note={expense.note}
                  />
                );
              })
            ) : (
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  padding: 14,
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 10,
                  elevation: 1,
                }}
              >
                <Text
                  style={{ color: "#111827", fontWeight: "900", fontSize: 13 }}
                >
                  Nenhum gasto encontrado
                </Text>
                <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
                  Quando você adicionar gastos, eles aparecerão aqui.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function ExpenseHistoryRow({
  title,
  subtitle,
  value,
  icon,
  note,
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  note?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: "#f1f5f9",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={18} color="#111827" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: "#111827", fontWeight: "800", fontSize: 13 }}>
          {title}
        </Text>

        <Text style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>
          {subtitle}
        </Text>

        {!!note?.trim() && (
          <Text style={{ color: "#94a3b8", fontSize: 11, marginTop: 6 }}>
            {note.trim()}
          </Text>
        )}
      </View>

      <Text
        style={{
          color: "#ef4444",
          fontWeight: "900",
          fontSize: 12,
          marginLeft: 10,
        }}
      >
        {value}
      </Text>
    </View>
  );
}