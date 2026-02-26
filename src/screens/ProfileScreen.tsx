import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  // mock (depois você liga no seu FinanceContext)
  const userName = "Pedro Almeida";
  const userEmail = "pedro.almeida@email.com";
  const income = "R$ 5.000";
  const goal = "R$ 1.200";
  const currency = "BRL (R$)";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP */}
        <View style={{ alignItems: "center", marginTop: 6 }}>
          {/* Avatar */}
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 78,
                height: 78,
                borderRadius: 39,
                backgroundColor: "#f3d4bf",
                borderWidth: 2,
                borderColor: "#3b82f6",
                shadowColor: "#3b82f6",
                shadowOpacity: 0.18,
                shadowRadius: 10,
                elevation: 5,
              }}
            />

            {/* check */}
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

        {/* CARDS */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 16,
          }}
        >
          <MiniStatCard icon="cash-outline" label="RENDA" value={income} />
          <MiniStatCard icon="trophy-outline" label="META" value={goal} />
          <MiniStatCard icon="logo-usd" label="MOEDA" value={currency} />
        </View>

        {/* GERENCIAMENTO */}
        <Text style={sectionTitle}>GERENCIAMENTO</Text>

        <View style={listCard}>
          <RowItem icon="person-outline" label="Editar Perfil" />
          <Divider />
          <RowItem
            icon="refresh-outline"
            label="Redefinir Planejamento Mensal"
            accent="#1976ff"
          />
          <Divider />
          <RowItem icon="settings-outline" label="Configurações" />
        </View>

        {/* SUPORTE */}
        <Text style={sectionTitle}>SUPORTE</Text>

        <View style={listCard}>
          <RowItem icon="help-circle-outline" label="Central de Ajuda" />
          <Divider />
          <RowItem
            icon="log-out-outline"
            label="Sair da Conta"
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENTES ---------------- */

function MiniStatCard({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flex: 1,
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
}: {
  icon: any;
  label: string;
  accent?: string;
  danger?: boolean;
}) {
  const iconColor = danger ? "#ef4444" : accent ? accent : "#111827";
  const textColor = danger ? "#ef4444" : accent ? accent : "#111827";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
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

      <Text style={{ flex: 1, fontSize: 13, fontWeight: "800", color: textColor }}>
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

/* ---------------- STYLES ---------------- */

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