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
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            {/* Hero */}
            <View style={{ marginBottom: 26 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 22,
                  backgroundColor: "#dbeafe",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                  shadowColor: "#2563eb",
                  shadowOpacity: 0.14,
                  shadowRadius: 14,
                  elevation: 5,
                }}
              >
                <Ionicons name="wallet-outline" size={30} color="#2563eb" />
              </View>

              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "900",
                  color: "#0f172a",
                  lineHeight: 36,
                }}
              >
                Bem-vindo de volta
              </Text>

              <Text
                style={{
                  color: "#64748b",
                  marginTop: 8,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                Entre na sua conta para acompanhar seu orçamento, categorias e gastos do mês.
              </Text>
            </View>

            {/* Card */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 24,
                padding: 18,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 18,
                elevation: 4,
                borderWidth: 1,
                borderColor: "#eef2f7",
              }}
            >
              <View
                style={{
                  marginBottom: 18,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "900",
                    color: "#111827",
                  }}
                >
                  Fazer login
                </Text>

                <Text
                  style={{
                    marginTop: 4,
                    color: "#94a3b8",
                    fontSize: 12,
                    lineHeight: 18,
                  }}
                >
                  Use seu email e senha cadastrados para acessar o aplicativo.
                </Text>
              </View>

              <Text style={label}>EMAIL</Text>
              <View style={inputWrap}>
                <View style={leftIconWrap}>
                  <Ionicons name="mail-outline" size={18} color="#64748b" />
                </View>
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

              <Text style={[label, { marginTop: 14 }]}>SENHA</Text>
              <View style={inputWrap}>
                <View style={leftIconWrap}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748b" />
                </View>

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#9ca3af"
                  style={input}
                />

                <TouchableOpacity
                  onPress={() => setShowPass((s) => !s)}
                  activeOpacity={0.8}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={showPass ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>

              {!!error && (
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: "#fef2f2",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#fecaca",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#ef4444"
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      color: "#dc2626",
                      fontSize: 12,
                      fontWeight: "700",
                      flex: 1,
                    }}
                  >
                    {error}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={onSubmit}
                disabled={!canSubmit}
                activeOpacity={0.9}
                style={{
                  marginTop: 18,
                  height: 56,
                  borderRadius: 18,
                  backgroundColor: canSubmit ? "#1976ff" : "#93c5fd",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#1976ff",
                  shadowOpacity: canSubmit ? 0.25 : 0,
                  shadowRadius: 16,
                  elevation: canSubmit ? 8 : 0,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "900", fontSize: 15 }}>
                  {submitting ? "Entrando..." : "Entrar"}
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  marginTop: 18,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#94a3b8",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  Ainda não tem uma conta?
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                  activeOpacity={0.85}
                  style={{
                    marginTop: 8,
                    paddingHorizontal: 14,
                    height: 38,
                    borderRadius: 999,
                    backgroundColor: "#eff6ff",
                    borderWidth: 1,
                    borderColor: "#dbeafe",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#1976ff",
                      fontSize: 13,
                      fontWeight: "900",
                    }}
                  >
                    Criar conta agora
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom helper */}
            <View
              style={{
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  textAlign: "center",
                  lineHeight: 18,
                }}
              >
                Organize seus gastos, acompanhe metas e controle seu orçamento com mais clareza.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const label = {
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

const leftIconWrap = {
  width: 36,
  height: 36,
  borderRadius: 12,
  backgroundColor: "#eef2f7",
  alignItems: "center" as const,
  justifyContent: "center" as const,
  marginRight: 10,
};

const input = {
  flex: 1,
  fontSize: 14,
  color: "#111827",
};