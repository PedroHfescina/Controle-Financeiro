import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CategoryItem = {
  id: string;
  title: string;
  subtitle: string;
  spent: number;
  limit: number;
  color: string;
  icon: any;
};

function formatBRL(value: number) {
  const fixed = value.toFixed(2).replace(".", ",");
  const parts = fixed.split(",");
  const int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${int},${parts[1]}`;
}

export default function CategoriesScreen() {
  const monthLabel = "Outubro 2023";

  const categories = useMemo<CategoryItem[]>(
    () => [
      {
        id: "food",
        title: "Alimentação",
        subtitle: "Restaurantes e delivery",
        spent: 800,
        limit: 1200,
        color: "#1976ff",
        icon: "fast-food",
      },
      {
        id: "fun",
        title: "Lazer",
        subtitle: "Games e Cinema",
        spent: 280,
        limit: 300,
        color: "#f59e0b",
        icon: "game-controller",
      },
      {
        id: "transport",
        title: "Transporte",
        subtitle: "Combustível e Apps",
        spent: 250,
        limit: 200,
        color: "#ef4444",
        icon: "car",
      },
      {
        id: "market",
        title: "Mercado",
        subtitle: "Compras do mês",
        spent: 1050,
        limit: 1800,
        color: "#22c55e",
        icon: "cart",
      },
    ],
    []
  );

  const totalAvailable = 2450;
  const totalSpent = 3550;
  const goal = 6000;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#6b7280", fontSize: 12 }}>{monthLabel}</Text>
              <Text
                style={{
                  color: "#111827",
                  fontSize: 22,
                  fontWeight: "900",
                  marginTop: 2,
                }}
              >
                Orçamento Mensal
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
              <Ionicons name="notifications-outline" size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Blue Summary Card */}
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
                  Total Disponível
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
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                Gasto Total:{" "}
                <Text style={{ fontWeight: "900" }}>{formatBRL(totalSpent)}</Text>
              </Text>

              <Text
                style={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                Meta: <Text style={{ fontWeight: "900" }}>{formatBRL(goal)}</Text>
              </Text>
            </View>
          </View>

          {/* Categories header row */}
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

            <TouchableOpacity
              activeOpacity={0.85}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons name="add-circle-outline" size={16} color="#1976ff" />
              <Text style={{ color: "#1976ff", fontWeight: "800", fontSize: 12 }}>
                Adicionar Categoria
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category cards */}
          <View style={{ marginTop: 12, gap: 12 }}>
            {categories.map((c) => (
              <CategoryBudgetCard key={c.id} item={c} />
            ))}
          </View>

          {/* Bottom big button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              marginTop: 18,
              backgroundColor: "#1976ff",
              height: 56,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#1976ff",
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 10,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 15 }}>
              Nova Categoria
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function CategoryBudgetCard({ item }: { item: CategoryItem }) {
  const spentPct = item.limit <= 0 ? 0 : item.spent / item.limit;
  const isExceeded = item.spent > item.limit;

  const remaining = item.limit - item.spent;
  const remainingAbs = Math.abs(remaining);

  const statusLabel = isExceeded ? "EXCEDIDO" : "RESTANTE";
  const statusValue = isExceeded
    ? formatBRL(remainingAbs)
    : formatBRL(Math.max(remaining, 0));

  const statusColor = isExceeded ? "#ef4444" : item.color;

  // ✅ barra em flex (sem "55%" string)
  const fill = Math.max(0, Math.min(1, isExceeded ? 1 : spentPct));
  const empty = 1 - fill;

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
            backgroundColor: `${item.color}1A`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: "#111827", fontWeight: "900", fontSize: 14 }}>
            {item.title}
          </Text>
          <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
            {item.subtitle}
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
            {statusValue}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <View
          style={{
            height: 6,
            backgroundColor: "#e5e7eb",
            borderRadius: 999,
            overflow: "hidden",
            flexDirection: "row",
          }}
        >
          <View style={{ flex: fill, backgroundColor: statusColor }} />
          <View style={{ flex: empty, backgroundColor: "transparent" }} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#6b7280", fontSize: 12 }}>
            Gasto:{" "}
            <Text style={{ color: "#111827", fontWeight: "800" }}>
              {formatBRL(item.spent)}
            </Text>
          </Text>

          <Text style={{ color: "#6b7280", fontSize: 12 }}>
            Limite:{" "}
            <Text style={{ color: "#111827", fontWeight: "800" }}>
              {formatBRL(item.limit)}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}