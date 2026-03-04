import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && !submitting;

  const onSubmit = async () => {
    try {
      setError(null);
      setSubmitting(true);
      await login(email, password);
      // ✅ RootNavigator troca sozinho quando user logar
    } catch (e: any) {
      setError("Email ou senha inválidos.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 26, fontWeight: "900", color: "#111827" }}>
              Bem-vindo 👋
            </Text>
            <Text style={{ color: "#6b7280", marginTop: 6 }}>
              Faça login para continuar.
            </Text>
          </View>

          {/* Card */}
          <View
            style={{
              marginTop: 16,
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 14,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <Text style={label}>Email</Text>
            <View style={inputWrap}>
              <Ionicons name="mail-outline" size={18} color="#94a3b8" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="seuemail@email.com"
                placeholderTextColor="#9ca3af"
                style={input}
              />
            </View>

            <Text style={[label, { marginTop: 12 }]}>Senha</Text>
            <View style={inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                placeholder="********"
                placeholderTextColor="#9ca3af"
                style={input}
              />
              <TouchableOpacity
                onPress={() => setShowPass((s) => !s)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>

            {!!error && (
              <Text style={{ marginTop: 10, color: "#ef4444", fontSize: 12, fontWeight: "700" }}>
                {error}
              </Text>
            )}

            <TouchableOpacity
              onPress={onSubmit}
              disabled={!canSubmit}
              activeOpacity={0.9}
              style={{
                marginTop: 16,
                height: 52,
                borderRadius: 16,
                backgroundColor: canSubmit ? "#1976ff" : "#93c5fd",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#1976ff",
                shadowOpacity: canSubmit ? 0.2 : 0,
                shadowRadius: 14,
                elevation: canSubmit ? 8 : 0,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 15 }}>
                {submitting ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.85}
              style={{ marginTop: 14, alignItems: "center" }}
            >
              <Text style={{ color: "#6b7280", fontSize: 12 }}>
                Não tem conta?{" "}
                <Text style={{ color: "#1976ff", fontWeight: "900" }}>
                  Criar agora
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const label = {
  fontSize: 12,
  fontWeight: "900" as const,
  color: "#94a3b8",
  letterSpacing: 0.6,
};

const inputWrap = {
  marginTop: 8,
  height: 52,
  borderRadius: 16,
  backgroundColor: "#f1f5f9",
  paddingHorizontal: 12,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 10,
};

const input = {
  flex: 1,
  fontSize: 14,
  color: "#111827",
};