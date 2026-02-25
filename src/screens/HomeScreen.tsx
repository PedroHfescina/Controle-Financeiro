import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goToCategoriesTab = () => {
    // ✅ como Home está dentro do TabNavigator (que está dentro do Stack),
    // o TabNavigator é o "parent" navigation.
    navigation.getParent()?.navigate("Categories" as never);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#111827", fontSize: 13 }}>Bom dia,</Text>
              <Text
                style={{ color: "#111827", fontSize: 22, fontWeight: "800" }}
              >
                Olá, Pedro
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

          {/* Budget Card */}
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
              R$ 4.250,00
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
                  R$ 1.750,00
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
                  R$ 2.500,00
                </Text>
              </View>
            </View>

            {/* Progress bar */}
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
                    width: "41%",
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
                41% do orçamento mensal utilizado
              </Text>
            </View>
          </View>

          {/* Alert */}
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
                Alerta de Orçamento
              </Text>
              <Text style={{ color: "#92400e", fontSize: 12, marginTop: 2 }}>
                Seu limite de Lazer está próximo (85%).
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

          {/* Categories */}
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

          <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
            <CategoryCard
              title="Mercado"
              value="R$ 800,00"
              icon="cart"
              accent="#2563eb"
              onPress={goToCategoriesTab}
            />
            <CategoryCard
              title="Lazer"
              value="R$ 450,00"
              icon="game-controller"
              accent="#7c3aed"
              onPress={goToCategoriesTab}
            />
            <CategoryCard
              title="Casa"
              value="R$ 300,00"
              icon="home"
              accent="#16a34a"
              onPress={goToCategoriesTab}
            />
          </View>

          {/* Recent Expenses */}
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
              Gastos Recentes
            </Text>
            <TouchableOpacity>
              <Text
                style={{ color: "#2563eb", fontWeight: "700", fontSize: 12 }}
              >
                Filtros
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}>
            <ExpenseRow
              title="Starbucks Coffee"
              subtitle="Hoje, 09:45 • Lazer"
              value="- R$ 24,50"
              icon="cafe"
              negative
            />
            <ExpenseRow
              title="Supermercado Silva"
              subtitle="Ontem, 18:20 • Mercado"
              value="- R$ 189,90"
              icon="bag"
              negative
            />
            <ExpenseRow
              title="Uber Viagem"
              subtitle="Ontem, 14:10 • Transporte"
              value="- R$ 12,50"
              icon="car"
              negative
            />
          </View>
        </ScrollView>

        {/* Floating + (abre AddExpense) */}
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
}: {
  title: string;
  value: string;
  icon: any;
  accent: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        flex: 1,
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
            style={{ width: "55%", height: "100%", backgroundColor: accent }}
          />
        </View>

        <Text style={{ marginTop: 6, color: "#6b7280", fontSize: 11 }}>
          {value}
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
  icon: any;
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