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
      // ✅ RootNavigator troca sozinho quando user logar
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
          contentContainerStyle={{ padding: 18, paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
            style={{
              width: 42,
              height: 42,
              borderRadius: 16,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2,
              marginTop: 4,
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#111827" />
          </TouchableOpacity>

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 26, fontWeight: "900", color: "#111827" }}>
              Criar conta
            </Text>
            <Text style={{ color: "#6b7280", marginTop: 6 }}>
              Preencha seus dados para começar.
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
            <Text style={label}>Nome</Text>
            <View style={inputWrap}>
              <Ionicons name="person-outline" size={18} color="#94a3b8" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                placeholderTextColor="#9ca3af"
                style={input}
              />
            </View>

            <Text style={[label, { marginTop: 12 }]}>Email (login)</Text>
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
                value={pass}
                onChangeText={setPass}
                secureTextEntry={!showPass}
                placeholder="mínimo 6 caracteres"
                placeholderTextColor="#9ca3af"
                style={input}
              />
              <TouchableOpacity onPress={() => setShowPass((s) => !s)} activeOpacity={0.8}>
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>

            <Text style={[label, { marginTop: 12 }]}>Confirmar senha</Text>
            <View style={inputWrap}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#94a3b8" />
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
              <Text style={{ marginTop: 10, color: "#ef4444", fontSize: 12, fontWeight: "700" }}>
                As senhas não coincidem (mínimo 6 caracteres).
              </Text>
            )}

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
                {submitting ? "Criando..." : "Criar conta"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.85}
              style={{ marginTop: 14, alignItems: "center" }}
            >
              <Text style={{ color: "#6b7280", fontSize: 12 }}>
                Já tem conta?{" "}
                <Text style={{ color: "#1976ff", fontWeight: "900" }}>
                  Entrar
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