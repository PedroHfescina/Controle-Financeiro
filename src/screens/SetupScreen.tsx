import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useFinance, CategoryName } from "../context/FinanceContext";

type Props = NativeStackScreenProps<RootStackParamList, "Setup">;

type CategoryLimitMap = Partial<Record<CategoryName, string>>;

function parseBRL(input: string) {
  const raw = input
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function formatBRL(value: number) {
  try {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  } catch {
    return `R$ ${value.toFixed(2)}`.replace(".", ",");
  }
}

export default function SetupScreen({ navigation }: Props) {
  const { savePlan } = useFinance();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<CategoryName[]>(["Mercado"]);
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState("");
  const [categoryLimits, setCategoryLimits] = useState<CategoryLimitMap>({
    Mercado: "",
  });
  const [saving, setSaving] = useState(false);

  const categories = useMemo(
    () =>
      [
        { name: "Mercado", icon: "cart" },
        { name: "Transporte", icon: "car" },
        { name: "Lazer", icon: "game-controller" },
        { name: "Alimentação", icon: "restaurant" },
        { name: "Casa", icon: "home" },
        { name: "Combustível", icon: "flame" },
        { name: "Assinaturas", icon: "card" },
        { name: "Outros", icon: "ellipsis-horizontal" },
      ] as { name: CategoryName; icon: keyof typeof Ionicons.glyphMap }[],
    []
  );

  const totalIncome = parseBRL(income);
  const totalGoal = parseBRL(goal);

  const totalCategoryBudget = useMemo(() => {
    return selected.reduce((acc, category) => {
      return acc + parseBRL(categoryLimits[category] ?? "");
    }, 0);
  }, [selected, categoryLimits]);

  const availableToSpend = Math.max(0, totalIncome - totalGoal);

  const step1Valid =
    income.trim().length > 0 &&
    goal.trim().length > 0 &&
    totalIncome > 0 &&
    totalGoal >= 0;

  const step2Valid = selected.length > 0;

  const step3Valid =
    selected.length > 0 &&
    selected.every((category) => {
      const value = parseBRL(categoryLimits[category] ?? "");
      return value > 0;
    });

  const canFinish = step1Valid && step2Valid && step3Valid && !saving;

  const toggle = (name: CategoryName) => {
    setSelected((prev) => {
      const has = prev.includes(name);

      if (has) {
        const next = prev.filter((c) => c !== name);

        setCategoryLimits((old) => {
          const copy = { ...old };
          delete copy[name];
          return copy;
        });

        return next;
      }

      setCategoryLimits((old) => ({
        ...old,
        [name]: old[name] ?? "",
      }));

      return [...prev, name];
    });
  };

  const updateCategoryLimit = (name: CategoryName, value: string) => {
    setCategoryLimits((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextFromStep1 = () => {
    if (!step1Valid) {
      Alert.alert(
        "Preencha os dados",
        "Informe sua renda mensal e sua meta de economia para continuar."
      );
      return;
    }

    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!step2Valid) {
      Alert.alert(
        "Selecione ao menos uma categoria",
        "Escolha pelo menos uma categoria para controlar no aplicativo."
      );
      return;
    }

    setStep(3);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
    }
  };

  const onFinish = async () => {
    if (!canFinish) {
      Alert.alert(
        "Dados incompletos",
        "Preencha todos os limites das categorias selecionadas antes de continuar."
      );
      return;
    }

    const incomeNumber = parseBRL(income);
    const goalNumber = parseBRL(goal);

    if (incomeNumber <= 0 || goalNumber < 0) {
      Alert.alert(
        "Valores inválidos",
        "Verifique sua renda mensal e sua meta de economia."
      );
      return;
    }

    const limitsAsNumber: Record<CategoryName, number> = selected.reduce(
      (acc, category) => {
        acc[category] = parseBRL(categoryLimits[category] ?? "");
        return acc;
      },
      {} as Record<CategoryName, number>
    );

    const totalLimits = Object.values(limitsAsNumber).reduce(
      (acc, value) => acc + value,
      0
    );

    const available = Math.max(0, incomeNumber - goalNumber);

    if (totalLimits > available) {
      Alert.alert(
        "Orçamento acima do disponível",
        `A soma dos limites das categorias (${formatBRL(
          totalLimits
        )}) está acima do valor disponível para gastar (${formatBRL(available)}).`
      );
      return;
    }

    try {
      setSaving(true);

      await savePlan({
        income: incomeNumber,
        savingsGoal: goalNumber,
        selectedCategories: selected,
        categoryLimits: limitsAsNumber,
      });

      navigation.replace("HomeTabs");
    } catch (error) {
      console.error("Erro ao salvar planejamento:", error);
      Alert.alert(
        "Erro ao salvar",
        "Não foi possível salvar seu planejamento agora. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [1, 2, 3] as const;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          marginTop: 4,
        }}
      >
        {steps.map((item, index) => {
          const active = step === item;
          const done = step > item;

          return (
            <React.Fragment key={item}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: active || done ? "#2563eb" : "#dbeafe",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {done ? (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                ) : (
                  <Text
                    style={{
                      color: active ? "#fff" : "#2563eb",
                      fontWeight: "800",
                      fontSize: 13,
                    }}
                  >
                    {item}
                  </Text>
                )}
              </View>

              {index < steps.length - 1 && (
                <View
                  style={{
                    width: 28,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: step > item ? "#2563eb" : "#dbeafe",
                    marginHorizontal: 8,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  const renderHeader = () => {
    if (step === 1) {
      return (
        <>
          <Text style={{ fontSize: 26, fontWeight: "700", color: "#111827" }}>
            Vamos planejar seu mês?
          </Text>

          <Text style={{ color: "#6b7280", marginTop: 6, marginBottom: 24 }}>
            Primeiro, defina sua renda mensal e sua meta de economia.
          </Text>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <Text style={{ fontSize: 26, fontWeight: "700", color: "#111827" }}>
            O que você quer controlar?
          </Text>

          <Text style={{ color: "#6b7280", marginTop: 6, marginBottom: 24 }}>
            Escolha as categorias que farão parte do seu orçamento mensal.
          </Text>
        </>
      );
    }

    return (
      <>
        <Text style={{ fontSize: 26, fontWeight: "700", color: "#111827" }}>
          Defina o limite das categorias
        </Text>

        <Text style={{ color: "#6b7280", marginTop: 6, marginBottom: 24 }}>
          Agora informe quanto deseja reservar para cada categoria selecionada.
        </Text>
      </>
    );
  };

  const renderStep1 = () => {
    return (
      <>
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
            marginBottom: 14,
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

        <View
          style={{
            marginTop: 18,
            backgroundColor: "#eff6ff",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: "#bfdbfe",
          }}
        >
          <Text style={{ color: "#1d4ed8", fontWeight: "800", fontSize: 13 }}>
            Resumo inicial
          </Text>

          <Text style={{ color: "#334155", fontSize: 13, marginTop: 8 }}>
            Renda mensal: {formatBRL(totalIncome)}
          </Text>

          <Text style={{ color: "#334155", fontSize: 13, marginTop: 4 }}>
            Meta de economia: {formatBRL(totalGoal)}
          </Text>

          <Text style={{ color: "#334155", fontSize: 13, marginTop: 4 }}>
            Disponível para gastar: {formatBRL(availableToSpend)}
          </Text>
        </View>
      </>
    );
  };

  const renderStep2 = () => {
    return (
      <>
        <Text
          style={{
            marginBottom: 14,
            fontSize: 12,
            fontWeight: "700",
            color: "#94a3b8",
          }}
        >
          CATEGORIAS DISPONÍVEIS
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {categories.map((item) => {
            const isSelected = selected.includes(item.name);

            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => toggle(item.name)}
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
                    name={item.icon}
                    size={18}
                    color={isSelected ? "#fff" : "#6b7280"}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    color: isSelected ? "#2563eb" : "#374151",
                    fontWeight: isSelected ? "600" : "400",
                    flexShrink: 1,
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            marginTop: 10,
            backgroundColor: "#f8fafc",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: "#e2e8f0",
          }}
        >
          <Text style={{ color: "#0f172a", fontWeight: "800", fontSize: 13 }}>
            Selecionadas
          </Text>

          <Text style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>
            {selected.length > 0
              ? selected.join(" • ")
              : "Nenhuma categoria selecionada"}
          </Text>
        </View>
      </>
    );
  };

  const renderStep3 = () => {
    return (
      <>
        <View
          style={{
            backgroundColor: "#eff6ff",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: "#bfdbfe",
            marginBottom: 18,
          }}
        >
          <Text style={{ color: "#1d4ed8", fontWeight: "800", fontSize: 13 }}>
            Seu orçamento disponível para categorias
          </Text>

          <Text
            style={{
              color: "#0f172a",
              fontWeight: "800",
              fontSize: 22,
              marginTop: 6,
            }}
          >
            {formatBRL(availableToSpend)}
          </Text>

          <Text style={{ color: "#475569", fontSize: 12, marginTop: 6 }}>
            Esse valor corresponde à sua renda menos a meta de economia.
          </Text>
        </View>

        {selected.map((category) => {
          const meta = categories.find((item) => item.name === category);

          return (
            <View
              key={category}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 14,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: "#dbeafe",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Ionicons
                    name={meta?.icon ?? "ellipse"}
                    size={18}
                    color="#2563eb"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#111827",
                      fontWeight: "800",
                      fontSize: 14,
                    }}
                  >
                    {category}
                  </Text>

                  <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                    Defina o orçamento mensal dessa categoria
                  </Text>
                </View>
              </View>

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
                  value={categoryLimits[category] ?? ""}
                  onChangeText={(text) => updateCategoryLimit(category, text)}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor="#9ca3af"
                  style={{ flex: 1, fontSize: 15, color: "#111827" }}
                />
              </View>
            </View>
          );
        })}

        <View
          style={{
            marginTop: 6,
            backgroundColor:
              totalCategoryBudget > availableToSpend ? "#fef2f2" : "#f8fafc",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor:
              totalCategoryBudget > availableToSpend ? "#fecaca" : "#e2e8f0",
          }}
        >
          <Text style={{ color: "#0f172a", fontWeight: "800", fontSize: 13 }}>
            Resumo dos limites
          </Text>

          <Text style={{ color: "#475569", fontSize: 13, marginTop: 8 }}>
            Total dos limites: {formatBRL(totalCategoryBudget)}
          </Text>

          <Text style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>
            Disponível para gastar: {formatBRL(availableToSpend)}
          </Text>

          <Text
            style={{
              color:
                totalCategoryBudget > availableToSpend ? "#dc2626" : "#16a34a",
              fontSize: 13,
              fontWeight: "700",
              marginTop: 8,
            }}
          >
            {totalCategoryBudget > availableToSpend
              ? "Os limites estão acima do valor disponível."
              : "Os limites estão dentro do orçamento disponível."}
          </Text>
        </View>
      </>
    );
  };

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

          {renderStepIndicator()}
          {renderHeader()}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <View
            style={{
              flexDirection: "row",
              marginTop: 24,
              gap: 12,
            }}
          >
            {step > 1 && (
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.85}
                style={{
                  flex: 1,
                  backgroundColor: "#e5e7eb",
                  paddingVertical: 16,
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#374151", fontWeight: "700", fontSize: 15 }}
                >
                  Voltar
                </Text>
              </TouchableOpacity>
            )}

            {step < 3 ? (
              <TouchableOpacity
                onPress={step === 1 ? handleNextFromStep1 : handleNextFromStep2}
                activeOpacity={0.85}
                style={{
                  flex: 1,
                  backgroundColor: "#2563eb",
                  paddingVertical: 16,
                  borderRadius: 14,
                  alignItems: "center",
                  shadowColor: "#2563eb",
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 5,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                  Continuar
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onFinish}
                disabled={!canFinish}
                activeOpacity={0.85}
                style={{
                  flex: 1,
                  backgroundColor: canFinish ? "#2563eb" : "#93c5fd",
                  paddingVertical: 16,
                  borderRadius: 14,
                  alignItems: "center",
                  shadowColor: "#2563eb",
                  shadowOpacity: canFinish ? 0.3 : 0,
                  shadowRadius: 6,
                  elevation: canFinish ? 5 : 0,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                  {saving ? "Salvando..." : "Finalizar Planejamento"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text
            style={{
              marginTop: 12,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 11,
            }}
          >
            Você poderá alterar categorias e limites depois na aba Categorias.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}