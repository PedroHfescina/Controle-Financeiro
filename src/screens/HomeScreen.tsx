import React, { useContext, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import {
  FinanceContext,
  CategoryName,
  CategorySummary,
} from "../context/FinanceContext";

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

function formatShortDateTime(input: any) {
  const d = getDateFromInput(input);
  if (!d) return "Agora";

  const today = new Date();

  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  if (isToday) return `Hoje, ${hh}:${mm}`;

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return `Ontem, ${hh}:${mm}`;

  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");

  return `${dd}/${mo}, ${hh}:${mm}`;
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

function getCategoryProgressColor(category: CategorySummary) {
  if (!category.hasLimit) return "#94a3b8";
  if (category.status === "danger") return "#ef4444";
  if (category.status === "warning") return "#f59e0b";
  if (category.status === "safe") return "#16a34a";
  return getCategoryMeta(category.name).accent;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const context = useContext(FinanceContext);

  const income = Number(context?.income) || 0;
  const savingsGoal = Number(context?.savingsGoal) || 0;
  const categories = (context?.categories ?? []) as CategorySummary[];
  const expenses = (context?.expenses ?? []) as ExpenseLike[];

  const goToCategoriesTab = () => {
    try {
      (navigation as any).navigate("Categories");
      return;
    } catch {}

    try {
      navigation.navigate("HomeTabs", { screen: "Categories" });
      return;
    } catch {}

    try {
      const parent = navigation.getParent?.();
      if (parent) {
        (parent as any).navigate("Categories");
      }
    } catch {}
  };

  const goToExpensesHistory = () => {
    navigation.navigate("ExpensesHistory");
  };

  const spentTotal = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + (Number(expense?.value) || 0), 0);
  }, [expenses]);

  const totalAvailable = useMemo(() => {
    const value = income - savingsGoal;
    return value > 0 ? value : 0;
  }, [income, savingsGoal]);

  const remaining = useMemo(() => {
    const value = totalAvailable - spentTotal;
    return value > 0 ? value : 0;
  }, [totalAvailable, spentTotal]);

  const percentUsed = useMemo(() => {
    if (totalAvailable <= 0) return 0;
    const percent = (spentTotal / totalAvailable) * 100;
    return Math.max(0, Math.min(100, percent));
  }, [spentTotal, totalAvailable]);

  const topCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 3);
  }, [categories]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => {
        const aTime = getDateFromInput(a?.createdAt)?.getTime() ?? 0;
        const bTime = getDateFromInput(b?.createdAt)?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, 6);
  }, [expenses]);

  const showBudgetAlert = percentUsed >= 80 && totalAvailable > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#111827", fontSize: 13 }}>
                {getGreeting()},
              </Text>
              <Text
                style={{ color: "#111827", fontSize: 22, fontWeight: "800" }}
              >
                Seu painel financeiro
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#111827"
              />
              <View
                style={{
                  position: "absolute",
                  right: 11,
                  top: 9,
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: "#ef4444",
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 14,
              borderRadius: 16,
              backgroundColor: "#1976ff",
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
              TOTAL DISPONÍVEL
            </Text>

            <Text
              style={{
                color: "#fff",
                fontSize: 26,
                fontWeight: "900",
                marginTop: 4,
              }}
            >
              {formatBRL(totalAvailable)}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 11,
                  }}
                >
                  Gasto
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: "700",
                    marginTop: 2,
                  }}
                >
                  {formatBRL(spentTotal)}
                </Text>
              </View>

              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 11,
                  }}
                >
                  Restante
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: "700",
                    marginTop: 2,
                  }}
                >
                  {formatBRL(remaining)}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.28)",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${Math.round(percentUsed)}%` as `${number}%`,
                    height: "100%",
                    backgroundColor: "#fff",
                    borderRadius: 8,
                  }}
                />
              </View>

              <Text
                style={{
                  marginTop: 8,
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                {Math.round(percentUsed)}% do orçamento mensal utilizado
              </Text>
            </View>
          </View>

          {showBudgetAlert && (
            <View
              style={{
                marginTop: 14,
                backgroundColor: "#fff7ed",
                borderRadius: 14,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: "#fde68a",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Ionicons name="warning" size={18} color="#a16207" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: "#a16207", fontWeight: "800", fontSize: 13 }}
                >
                  Alerta de orçamento
                </Text>
                <Text style={{ color: "#92400e", fontSize: 12, marginTop: 2 }}>
                  Você já usou {Math.round(percentUsed)}% do seu orçamento disponível.
                </Text>
              </View>

              <TouchableOpacity onPress={goToCategoriesTab}>
                <Text
                  style={{ color: "#2563eb", fontSize: 12, fontWeight: "800" }}
                >
                  VER
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
              Categorias
            </Text>

            <TouchableOpacity onPress={goToCategoriesTab}>
              <Text
                style={{ color: "#2563eb", fontWeight: "700", fontSize: 12 }}
              >
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
            }}
          >
            {topCategories.length ? (
              topCategories.map((category, index) => {
                const meta = getCategoryMeta(category.name);
                const progressColor = getCategoryProgressColor(category);

                return (
                  <View
                    key={category.id}
                    style={{
                      flex: 1,
                      marginRight: index < topCategories.length - 1 ? 12 : 0,
                    }}
                  >
                    <CategoryCard
                      title={category.name}
                      value={formatBRL(category.spent)}
                      icon={meta.icon}
                      accent={progressColor}
                      onPress={goToCategoriesTab}
                      progress={category.progress}
                      hasLimit={category.hasLimit}
                    />
                  </View>
                );
              })
            ) : (
              <>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <CategoryCard
                    title="Mercado"
                    value="R$ 0,00"
                    icon="cart"
                    accent="#94a3b8"
                    onPress={goToCategoriesTab}
                    progress={0}
                    hasLimit={false}
                  />
                </View>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <CategoryCard
                    title="Lazer"
                    value="R$ 0,00"
                    icon="game-controller"
                    accent="#94a3b8"
                    onPress={goToCategoriesTab}
                    progress={0}
                    hasLimit={false}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <CategoryCard
                    title="Casa"
                    value="R$ 0,00"
                    icon="home"
                    accent="#94a3b8"
                    onPress={goToCategoriesTab}
                    progress={0}
                    hasLimit={false}
                  />
                </View>
              </>
            )}
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
              Gastos recentes
            </Text>

            <TouchableOpacity onPress={goToExpensesHistory}>
              <Text
                style={{ color: "#2563eb", fontWeight: "700", fontSize: 12 }}
              >
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}>
            {recentExpenses.length ? (
              recentExpenses.map((expense, index) => {
                const expenseCategory = normalizeCategoryName(expense.category);
                const meta = getCategoryMeta(expenseCategory);

                return (
                  <ExpenseRow
                    key={expense.id ?? `${expense.title}-${index}`}
                    title={expense.title || "Gasto"}
                    subtitle={`${formatShortDateTime(expense.createdAt)} • ${expenseCategory}`}
                    value={`- ${formatBRL(Number(expense.value) || 0)}`}
                    icon={meta.icon}
                    negative
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
                  Nenhum gasto ainda
                </Text>
                <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
                  Toque no botão + para adicionar seu primeiro gasto.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddExpense")}
          activeOpacity={0.9}
          style={{
            position: "absolute",
            right: 18,
            bottom: 100,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#1976ff",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#1976ff",
            shadowOpacity: 0.25,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function CategoryCard({
  title,
  value,
  icon,
  accent,
  onPress,
  progress = 0,
  hasLimit = false,
}: {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  onPress?: () => void;
  progress?: number;
  hasLimit?: boolean;
}) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          backgroundColor: `${accent}1A`,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Ionicons name={icon} size={18} color={accent} />
      </View>

      <Text style={{ color: "#111827", fontWeight: "800", fontSize: 12 }}>
        {title}
      </Text>

      <View style={{ marginTop: 8 }}>
        <View
          style={{
            height: 4,
            backgroundColor: "#e5e7eb",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${safeProgress}%` as `${number}%`,
              height: "100%",
              backgroundColor: accent,
            }}
          />
        </View>

        <Text style={{ marginTop: 6, color: "#6b7280", fontSize: 11 }}>
          {value}
        </Text>

        <Text
          style={{
            marginTop: 2,
            color: hasLimit ? accent : "#94a3b8",
            fontSize: 10,
            fontWeight: "700",
          }}
        >
          {hasLimit ? `${Math.round(safeProgress)}% usado` : "Sem limite"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function ExpenseRow({
  title,
  subtitle,
  value,
  icon,
  negative,
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  negative?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
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
      </View>

      <Text
        style={{
          color: negative ? "#ef4444" : "#16a34a",
          fontWeight: "900",
          fontSize: 12,
        }}
      >
        {value}
      </Text>
    </View>
  );
}