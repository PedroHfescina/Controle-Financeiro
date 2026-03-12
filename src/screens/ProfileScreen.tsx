import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signOut, updateProfile } from "firebase/auth";

import { auth } from "../services/firebase";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";

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

function getInitials(name?: string | null, email?: string | null) {
  const base = (name?.trim() || email?.trim() || "U").split(" ");
  const first = base[0]?.[0] ?? "U";
  const second = base[1]?.[0] ?? "";
  return `${first}${second}`.toUpperCase();
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { income, savingsGoal, expenses } = useFinance();

  const [editingProfile, setEditingProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    setNameInput(user?.displayName?.trim() || "");
  }, [user?.displayName]);

  const userName = user?.displayName?.trim() || "Usuário";
  const userEmail = user?.email?.trim() || "email@exemplo.com";
  const initials = useMemo(() => getInitials(userName, userEmail), [userName, userEmail]);

  const currentMonthSpent = useMemo(() => {
    return (expenses ?? []).reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  }, [expenses]);

  const availableToSpend = Math.max(0, Number(income || 0) - Number(savingsGoal || 0));

  const handleSaveProfile = async () => {
    const safeName = nameInput.trim();

    if (!safeName) {
      Alert.alert("Nome inválido", "Digite um nome para salvar seu perfil.");
      return;
    }

    try {
      if (!auth.currentUser) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      await updateProfile(auth.currentUser, {
        displayName: safeName,
      });

      setEditingProfile(false);
      Alert.alert("Perfil atualizado", "Seu nome foi atualizado com sucesso.");
    } catch (error: any) {
      Alert.alert(
        "Erro ao atualizar",
        error?.message || "Não foi possível atualizar seu perfil agora."
      );
    }
  };

  const handleResetPlanning = () => {
    Alert.alert(
      "Redefinir planejamento",
      "Você será levado ao setup para ajustar renda, meta e categorias.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Continuar",
          onPress: () => navigation.navigate("Setup"),
        },
      ]
    );
  };

  const handleOpenCategories = () => {
    try {
      navigation.navigate("HomeTabs", { screen: "Categories" });
    } catch {
      try {
        navigation.navigate("Categories");
      } catch {}
    }
  };

  const handleOpenExpensesHistory = () => {
    try {
      navigation.navigate("ExpensesHistory");
    } catch {}
  };

  const handleOpenAddExpense = () => {
    try {
      navigation.navigate("AddExpense");
    } catch {}
  };

  const handleHelpCenter = () => {
    Alert.alert(
      "Central de Ajuda",
      "Dicas rápidas:\n\n• Use Categorias para definir limites mensais.\n• Use o botão + para registrar novos gastos.\n• Use Histórico para ver todos os lançamentos do mês.",
      [
        { text: "Fechar", style: "cancel" },
        { text: "Categorias", onPress: handleOpenCategories },
        { text: "Novo gasto", onPress: handleOpenAddExpense },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error: any) {
            Alert.alert(
              "Erro ao sair",
              error?.message || "Não foi possível sair da conta."
            );
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", marginTop: 6 }}>
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 78,
                height: 78,
                borderRadius: 39,
                backgroundColor: "#dbeafe",
                borderWidth: 2,
                borderColor: "#3b82f6",
                shadowColor: "#3b82f6",
                shadowOpacity: 0.18,
                shadowRadius: 10,
                elevation: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "900",
                  color: "#1d4ed8",
                }}
              >
                {initials}
              </Text>
            </View>

            <View
              style={{
                position: "absolute",
                right: -2,
                bottom: -2,
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: "#1976ff",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: "#f5f6f8",
              }}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          </View>

          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              fontWeight: "900",
              color: "#111827",
            }}
          >
            {userName}
          </Text>

          <Text style={{ marginTop: 2, fontSize: 12, color: "#94a3b8" }}>
            {userEmail}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 16,
          }}
        >
          <View style={{ flex: 1, marginRight: 10 }}>
            <MiniStatCard
              icon="cash-outline"
              label="RENDA"
              value={formatBRL(Number(income) || 0)}
            />
          </View>

          <View style={{ flex: 1, marginRight: 10 }}>
            <MiniStatCard
              icon="trophy-outline"
              label="META"
              value={formatBRL(Number(savingsGoal) || 0)}
            />
          </View>

          <View style={{ flex: 1 }}>
            <MiniStatCard
              icon="wallet-outline"
              label="DISPONÍVEL"
              value={formatBRL(availableToSpend)}
            />
          </View>
        </View>

        <Text style={sectionTitle}>GERENCIAMENTO</Text>

        <View style={listCard}>
          <RowItem
            icon="person-outline"
            label="Editar Perfil"
            onPress={() => {
              setEditingProfile((prev) => !prev);
              setShowSettings(false);
            }}
          />

          {editingProfile && (
            <View
              style={{
                paddingHorizontal: 14,
                paddingBottom: 14,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: 14,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                }}
              >
                <Text
                  style={{
                    color: "#374151",
                    fontSize: 12,
                    fontWeight: "700",
                    marginBottom: 6,
                  }}
                >
                  Nome do perfil
                </Text>

                <View
                  style={{
                    height: 46,
                    borderRadius: 12,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#dbeafe",
                    paddingHorizontal: 12,
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    value={nameInput}
                    onChangeText={setNameInput}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#94a3b8"
                    style={{
                      color: "#111827",
                      fontSize: 14,
                    }}
                  />
                </View>

                <Text
                  style={{
                    color: "#94a3b8",
                    fontSize: 11,
                    marginTop: 8,
                  }}
                >
                  O e-mail é exibido apenas para leitura.
                </Text>

                <View style={{ flexDirection: "row", marginTop: 12 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingProfile(false);
                      setNameInput(user?.displayName?.trim() || "");
                    }}
                    activeOpacity={0.85}
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: 12,
                      backgroundColor: "#e5e7eb",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                    }}
                  >
                    <Text style={{ color: "#374151", fontWeight: "700" }}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    activeOpacity={0.85}
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: 12,
                      backgroundColor: "#1976ff",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Salvar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <Divider />

          <RowItem
            icon="refresh-outline"
            label="Redefinir Planejamento Mensal"
            accent="#1976ff"
            onPress={handleResetPlanning}
          />

          <Divider />

          <RowItem
            icon="settings-outline"
            label="Configurações"
            onPress={() => {
              setShowSettings((prev) => !prev);
              setEditingProfile(false);
            }}
          />

          {showSettings && (
            <View
              style={{
                paddingHorizontal: 14,
                paddingBottom: 14,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: 14,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                }}
              >
                <Text
                  style={{
                    color: "#111827",
                    fontSize: 13,
                    fontWeight: "800",
                  }}
                >
                  Ações rápidas
                </Text>

                <TouchableOpacity
                  onPress={handleOpenCategories}
                  activeOpacity={0.85}
                  style={settingsButton}
                >
                  <Ionicons name="grid-outline" size={16} color="#1976ff" />
                  <Text style={settingsButtonText}>Abrir Categorias</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleOpenExpensesHistory}
                  activeOpacity={0.85}
                  style={settingsButton}
                >
                  <Ionicons name="receipt-outline" size={16} color="#1976ff" />
                  <Text style={settingsButtonText}>Ver histórico de gastos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleOpenAddExpense}
                  activeOpacity={0.85}
                  style={settingsButton}
                >
                  <Ionicons name="add-circle-outline" size={16} color="#1976ff" />
                  <Text style={settingsButtonText}>Registrar novo gasto</Text>
                </TouchableOpacity>

                <View
                  style={{
                    marginTop: 10,
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  }}
                >
                  <Text style={{ color: "#64748b", fontSize: 11, fontWeight: "700" }}>
                    RESUMO DO MÊS
                  </Text>
                  <Text style={{ color: "#111827", fontSize: 13, marginTop: 6 }}>
                    Gasto atual:{" "}
                    <Text style={{ fontWeight: "800" }}>
                      {formatBRL(currentMonthSpent)}
                    </Text>
                  </Text>
                  <Text style={{ color: "#111827", fontSize: 13, marginTop: 4 }}>
                    Disponível para gastar:{" "}
                    <Text style={{ fontWeight: "800" }}>
                      {formatBRL(availableToSpend)}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <Text style={sectionTitle}>SUPORTE</Text>

        <View style={listCard}>
          <RowItem
            icon="help-circle-outline"
            label="Central de Ajuda"
            onPress={handleHelpCenter}
          />
          <Divider />
          <RowItem
            icon="log-out-outline"
            label="Sair da Conta"
            danger
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStatCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: "center",
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
          backgroundColor: "#e0edff",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <Ionicons name={icon} size={18} color="#1976ff" />
      </View>

      <Text
        style={{
          fontSize: 10,
          fontWeight: "900",
          letterSpacing: 0.7,
          color: "#94a3b8",
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 13,
          fontWeight: "900",
          color: "#111827",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function RowItem({
  icon,
  label,
  accent,
  danger,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  accent?: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  const iconColor = danger ? "#ef4444" : accent ? accent : "#111827";
  const textColor = danger ? "#ef4444" : accent ? accent : "#111827";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 14,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          backgroundColor: danger ? "#fee2e2" : "#f1f5f9",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>

      <Text
        style={{
          flex: 1,
          fontSize: 13,
          fontWeight: "800",
          color: textColor,
        }}
      >
        {label}
      </Text>

      <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "#e5e7eb",
        marginLeft: 60,
      }}
    />
  );
}

const settingsButton = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  height: 42,
  borderRadius: 12,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#dbeafe",
  paddingHorizontal: 12,
  marginTop: 10,
};

const settingsButtonText = {
  marginLeft: 8,
  color: "#1976ff",
  fontWeight: "700" as const,
  fontSize: 13,
};

const sectionTitle = {
  marginTop: 18,
  marginBottom: 10,
  fontSize: 11,
  fontWeight: "900" as const,
  letterSpacing: 0.7,
  color: "#94a3b8",
};

const listCard = {
  backgroundColor: "#fff",
  borderRadius: 16,
  overflow: "hidden" as const,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 2,
};