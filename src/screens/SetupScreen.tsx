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
          marginTop: 18,
          marginBottom: 26,
        }}
      >
        {steps.map((item, index) => {
          const active = step === item;
          const done = step > item;

          return (
            <React.Fragment key={item}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: active || done ? "#2563eb" : "#dbeafe",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: active ? "#2563eb" : "transparent",
                  shadowOpacity: active ? 0.18 : 0,
                  shadowRadius: 10,
                  elevation: active ? 4 : 0,
                }}
              >
                {done ? (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                ) : (
                  <Text
                    style={{
                      color: active ? "#fff" : "#2563eb",
                      fontWeight: "900",
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
                    width: 34,
                    height: 4,
                    borderRadius: 999,
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
          <Text style={heroTitle}>Vamos planejar seu mês</Text>

          <Text style={heroText}>
            Defina sua renda mensal e a meta de economia para começar com um planejamento real.
          </Text>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <Text style={heroTitle}>Escolha suas categorias</Text>

          <Text style={heroText}>
            Selecione o que você quer acompanhar no seu orçamento mensal.
          </Text>
        </>
      );
    }

    return (
      <>
        <Text style={heroTitle}>Defina os limites</Text>

        <Text style={heroText}>
          Agora distribua o valor disponível entre as categorias escolhidas.
        </Text>
      </>
    );
  };

  const renderStep1 = () => {
    return (
      <>
        <View style={sectionCard}>
          <Text style={fieldLabel}>RENDA MENSAL</Text>

          <View style={inputWrap}>
            <View style={inputIconWrap}>
              <Ionicons name="cash-outline" size={18} color="#64748b" />
            </View>
            <Text style={currencyText}>R$</Text>
            <TextInput
              value={income}
              onChangeText={setIncome}
              keyboardType="numeric"
              placeholder="5.000,00"
              placeholderTextColor="#9ca3af"
              style={input}
            />
          </View>

          <Text style={[fieldLabel, { marginTop: 16 }]}>META DE ECONOMIA</Text>

          <View style={inputWrap}>
            <View style={inputIconWrap}>
              <Ionicons name="trophy-outline" size={18} color="#64748b" />
            </View>
            <Text style={currencyText}>R$</Text>
            <TextInput
              value={goal}
              onChangeText={setGoal}
              keyboardType="numeric"
              placeholder="Quanto quer guardar?"
              placeholderTextColor="#9ca3af"
              style={input}
            />
          </View>
        </View>

        <View style={summaryCardBlue}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={summaryIconWrap}>
              <Ionicons name="wallet-outline" size={18} color="#2563eb" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={summaryTitle}>Resumo inicial</Text>
              <Text style={summarySubtitle}>
                Veja quanto ficará disponível para uso no mês.
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <SummaryRow label="Renda mensal" value={formatBRL(totalIncome)} />
            <SummaryRow label="Meta de economia" value={formatBRL(totalGoal)} />
            <SummaryRow
              label="Disponível para gastar"
              value={formatBRL(availableToSpend)}
              highlight
            />
          </View>
        </View>
      </>
    );
  };

  const renderStep2 = () => {
    return (
      <>
        <Text style={sectionLabel}>CATEGORIAS DISPONÍVEIS</Text>

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
                activeOpacity={0.88}
                style={{
                  width: "48%",
                  backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                  borderRadius: 18,
                  padding: 14,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: isSelected ? "#93c5fd" : "#e5e7eb",
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 10,
                  elevation: 1,
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: isSelected ? "#2563eb" : "#f1f5f9",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={isSelected ? "#fff" : "#64748b"}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: isSelected ? "#2563eb" : "#0f172a",
                      fontWeight: "800",
                      flexShrink: 1,
                    }}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      marginTop: 2,
                      fontSize: 11,
                      color: isSelected ? "#60a5fa" : "#94a3b8",
                    }}
                  >
                    {isSelected ? "Selecionada" : "Toque para incluir"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={summaryNeutralCard}>
          <Text style={summaryTitleDark}>Selecionadas</Text>

          <Text style={{ color: "#64748b", fontSize: 13, marginTop: 6, lineHeight: 20 }}>
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
        <View style={summaryCardBlue}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={summaryIconWrap}>
              <Ionicons name="pie-chart-outline" size={18} color="#2563eb" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={summaryTitle}>Orçamento disponível</Text>
              <Text style={summarySubtitle}>
                Esse valor será distribuído entre suas categorias.
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: "#0f172a",
              fontWeight: "900",
              fontSize: 28,
              marginTop: 14,
            }}
          >
            {formatBRL(availableToSpend)}
          </Text>
        </View>

        {selected.map((category) => {
          const meta = categories.find((item) => item.name === category);

          return (
            <View
              key={category}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 20,
                padding: 14,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 1,
                borderWidth: 1,
                borderColor: "#eef2f7",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    backgroundColor: "#eff6ff",
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
                      fontWeight: "900",
                      fontSize: 14,
                    }}
                  >
                    {category}
                  </Text>

                  <Text
                    style={{
                      color: "#6b7280",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    Defina o orçamento mensal dessa categoria
                  </Text>
                </View>
              </View>

              <View style={inputWrap}>
                <View style={inputIconWrap}>
                  <Ionicons name="wallet-outline" size={18} color="#64748b" />
                </View>
                <Text style={currencyText}>R$</Text>
                <TextInput
                  value={categoryLimits[category] ?? ""}
                  onChangeText={(text) => updateCategoryLimit(category, text)}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor="#9ca3af"
                  style={input}
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
            borderRadius: 18,
            padding: 14,
            borderWidth: 1,
            borderColor:
              totalCategoryBudget > availableToSpend ? "#fecaca" : "#e2e8f0",
          }}
        >
          <Text style={summaryTitleDark}>Resumo dos limites</Text>

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
              fontWeight: "800",
              marginTop: 10,
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
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                backgroundColor: "#dbeafe",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                shadowColor: "#2563eb",
                shadowOpacity: 0.14,
                shadowRadius: 14,
                elevation: 4,
              }}
            >
              <Ionicons name="sparkles-outline" size={24} color="#2563eb" />
            </View>

            {renderStepIndicator()}
            {renderHeader()}

            <View
              style={{
                marginTop: 6,
              }}
            >
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 24,
              }}
            >
              {step > 1 && (
                <TouchableOpacity
                  onPress={handleBack}
                  activeOpacity={0.88}
                  style={{
                    flex: 1,
                    backgroundColor: "#e5e7eb",
                    paddingVertical: 16,
                    borderRadius: 18,
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{ color: "#374151", fontWeight: "800", fontSize: 15 }}
                  >
                    Voltar
                  </Text>
                </TouchableOpacity>
              )}

              {step < 3 ? (
                <TouchableOpacity
                  onPress={step === 1 ? handleNextFromStep1 : handleNextFromStep2}
                  activeOpacity={0.88}
                  style={{
                    flex: 1,
                    backgroundColor: "#2563eb",
                    paddingVertical: 16,
                    borderRadius: 18,
                    alignItems: "center",
                    shadowColor: "#2563eb",
                    shadowOpacity: 0.25,
                    shadowRadius: 16,
                    elevation: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "900", fontSize: 15 }}>
                    Continuar
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={onFinish}
                  disabled={!canFinish}
                  activeOpacity={0.88}
                  style={{
                    flex: 1,
                    backgroundColor: canFinish ? "#2563eb" : "#93c5fd",
                    paddingVertical: 16,
                    borderRadius: 18,
                    alignItems: "center",
                    shadowColor: "#2563eb",
                    shadowOpacity: canFinish ? 0.25 : 0,
                    shadowRadius: 16,
                    elevation: canFinish ? 6 : 0,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "900", fontSize: 15 }}>
                    {saving ? "Salvando..." : "Finalizar Planejamento"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={{
                marginTop: 14,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 11,
                lineHeight: 18,
              }}
            >
              Você poderá alterar categorias e limites depois na aba Categorias.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
      }}
    >
      <Text
        style={{
          color: highlight ? "#1d4ed8" : "#475569",
          fontSize: 13,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: highlight ? "#1d4ed8" : "#0f172a",
          fontSize: 13,
          fontWeight: "800",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const heroTitle = {
  fontSize: 30,
  fontWeight: "900" as const,
  color: "#0f172a",
  lineHeight: 36,
};

const heroText = {
  color: "#64748b",
  marginTop: 8,
  marginBottom: 6,
  fontSize: 15,
  lineHeight: 22,
};

const sectionLabel = {
  marginBottom: 14,
  fontSize: 12,
  fontWeight: "800" as const,
  color: "#94a3b8",
  letterSpacing: 0.8,
};

const sectionCard = {
  backgroundColor: "#ffffff",
  borderRadius: 24,
  padding: 18,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 18,
  elevation: 4,
  borderWidth: 1,
  borderColor: "#eef2f7",
};

const fieldLabel = {
  fontSize: 11,
  fontWeight: "900" as const,
  color: "#94a3b8",
  letterSpacing: 0.8,
};

const inputWrap = {
  marginTop: 8,
  minHeight: 56,
  borderRadius: 18,
  backgroundColor: "#f8fafc",
  paddingHorizontal: 10,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  borderWidth: 1,
  borderColor: "#e2e8f0",
};

const inputIconWrap = {
  width: 36,
  height: 36,
  borderRadius: 12,
  backgroundColor: "#eef2f7",
  alignItems: "center" as const,
  justifyContent: "center" as const,
  marginRight: 10,
};

const currencyText = {
  marginRight: 8,
  color: "#64748b",
  fontWeight: "800" as const,
  fontSize: 14,
};

const input = {
  flex: 1,
  fontSize: 14,
  color: "#111827",
};

const summaryCardBlue = {
  marginTop: 16,
  backgroundColor: "#eff6ff",
  borderRadius: 20,
  padding: 16,
  borderWidth: 1,
  borderColor: "#bfdbfe",
};

const summaryIconWrap = {
  width: 40,
  height: 40,
  borderRadius: 14,
  backgroundColor: "#dbeafe",
  alignItems: "center" as const,
  justifyContent: "center" as const,
  marginRight: 10,
};

const summaryTitle = {
  color: "#1d4ed8",
  fontWeight: "900" as const,
  fontSize: 14,
};

const summarySubtitle = {
  color: "#60a5fa",
  fontSize: 12,
  marginTop: 2,
};

const summaryNeutralCard = {
  marginTop: 10,
  backgroundColor: "#f8fafc",
  borderRadius: 18,
  padding: 14,
  borderWidth: 1,
  borderColor: "#e2e8f0",
};

const summaryTitleDark = {
  color: "#0f172a",
  fontWeight: "900" as const,
  fontSize: 13,
};