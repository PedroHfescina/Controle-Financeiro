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

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = pass.length >= 6 && pass === confirm;
  const canSubmit =
    name.trim().length >= 2 &&
    email.trim().length > 0 &&
    passwordsMatch &&
    !submitting;

  const onSubmit = async () => {
    try {
      setError(null);
      setSubmitting(true);
      await register(name.trim(), email, pass);
    } catch (e: any) {
      setError("Não foi possível criar a conta. Verifique o email e tente novamente.");
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
            {/* Top / back */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
                marginBottom: 24,
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#111827" />
            </TouchableOpacity>

            {/* Hero */}
            <View style={{ marginBottom: 24 }}>
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
                <Ionicons name="person-add-outline" size={30} color="#2563eb" />
              </View>

              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "900",
                  color: "#0f172a",
                  lineHeight: 36,
                }}
              >
                Criar conta
              </Text>

              <Text
                style={{
                  color: "#64748b",
                  marginTop: 8,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                Cadastre-se para começar a organizar seus gastos, metas e categorias do mês.
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
              <View style={{ marginBottom: 18 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "900",
                    color: "#111827",
                  }}
                >
                  Novo cadastro
                </Text>

                <Text
                  style={{
                    marginTop: 4,
                    color: "#94a3b8",
                    fontSize: 12,
                    lineHeight: 18,
                  }}
                >
                  Preencha seus dados abaixo para criar sua conta no aplicativo.
                </Text>
              </View>

              <Text style={label}>NOME</Text>
              <View style={inputWrap}>
                <View style={leftIconWrap}>
                  <Ionicons name="person-outline" size={18} color="#64748b" />
                </View>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome"
                  placeholderTextColor="#9ca3af"
                  style={input}
                />
              </View>

              <Text style={[label, { marginTop: 14 }]}>EMAIL</Text>
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
                  value={pass}
                  onChangeText={setPass}
                  secureTextEntry={!showPass}
                  placeholder="mínimo 6 caracteres"
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

              <Text style={[label, { marginTop: 14 }]}>CONFIRMAR SENHA</Text>
              <View style={inputWrap}>
                <View style={leftIconWrap}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color="#64748b"
                  />
                </View>
                <TextInput
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!showPass}
                  placeholder="repita a senha"
                  placeholderTextColor="#9ca3af"
                  style={input}
                />
              </View>

              {!passwordsMatch && confirm.length > 0 && (
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: "#fff7ed",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#fed7aa",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#ea580c"
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      color: "#c2410c",
                      fontSize: 12,
                      fontWeight: "700",
                      flex: 1,
                    }}
                  >
                    As senhas não coincidem ou possuem menos de 6 caracteres.
                  </Text>
                </View>
              )}

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
                  {submitting ? "Criando..." : "Criar conta"}
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
                  Já possui uma conta?
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
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
                    Entrar agora
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
                Seu planejamento será configurado logo após o cadastro, para você começar do jeito certo.
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