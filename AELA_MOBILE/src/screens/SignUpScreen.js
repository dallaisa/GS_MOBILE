import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import { colors, radius } from "../theme/colors";
import { api } from "../services/api";
import { useAuth } from "../../App";

const AMBIENTES = ["ASTRONAUTA", "DOUTOR", "TRIPULANTE", "COMANDANTE", "ANALISTA"];

export default function SignUpScreen({ navigation }) {
  const { signIn } = useAuth();
  const [f, setF] = useState({ nome: "", email: "", matricula: "", especialidade: "", senha: "", senha2: "" });
  const [ambiente, setAmbiente] = useState("ASTRONAUTA");
  const [aceito, setAceito] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const validar = () => {
    const e = {};
    if (f.nome.trim().length < 2) e.nome = "Informe o nome completo.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "E-mail profissional invalido.";
    if (!f.matricula.trim()) e.matricula = "Matricula obrigatoria.";
    if (f.senha.length < 6) e.senha = "Minimo 6 caracteres.";
    if (f.senha !== f.senha2) e.senha2 = "As senhas nao coincidem.";
    if (!aceito) e.aceito = "Aceite os termos para continuar.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validar()) return;
    setBusy(true);
    // Tenta registrar na API Java; se offline, segue com cadastro local
    await api.criarOperador({
      nome: f.nome, matricula: f.matricula, email: f.email,
      tipoAmbiente: ambiente, especialidade: f.especialidade,
    });
    setBusy(false);
    await signIn({ nome: f.nome, email: f.email, matricula: f.matricula, tipoAmbiente: ambiente });
  };

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.c} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={s.title}>Create Account</Text>
        </Pressable>
        <View style={s.accentLine} />

        <Field label="Nome completo" value={f.nome} onChangeText={set("nome")} ph="Isabelle Dallabeneta" err={errors.nome} />
        <Field label="E-mail profissional" value={f.email} onChangeText={set("email")} ph="nome@aela.io" err={errors.email} keyboardType="email-address" />
        <Field label="Matricula" value={f.matricula} onChangeText={set("matricula")} ph="AELA-001" err={errors.matricula} />

        <Text style={s.label}>Funcao na tripulacao</Text>
        <View style={s.chips}>
          {AMBIENTES.map((a) => (
            <Pressable key={a} onPress={() => setAmbiente(a)} style={[s.chip, ambiente === a && s.chipOn]}>
              <Text style={[s.chipTxt, ambiente === a && s.chipTxtOn]}>{a}</Text>
            </Pressable>
          ))}
        </View>

        <Field label="Especialidade" value={f.especialidade} onChangeText={set("especialidade")} ph="Operacoes Extraveiculares" />
        <Field label="Senha" value={f.senha} onChangeText={set("senha")} ph="********" err={errors.senha} secure />
        <Field label="Confirmar senha" value={f.senha2} onChangeText={set("senha2")} ph="********" err={errors.senha2} secure />

        <Pressable style={s.termsRow} onPress={() => setAceito(!aceito)}>
          <Ionicons name={aceito ? "checkmark-circle" : "ellipse-outline"} size={22} color={aceito ? colors.pink : colors.textFaint} />
          <Text style={s.termsTxt}>Concordo com os Termos e a Politica de Privacidade</Text>
        </Pressable>
        {errors.aceito ? <Text style={s.err}>{errors.aceito}</Text> : null}

        <Button title={busy ? "Criando..." : "Create Account"} onPress={onSubmit} style={{ marginTop: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, err, ph, secure, ...rest }) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput style={[s.input, err && { borderColor: colors.bad }]} placeholder={ph}
        placeholderTextColor={colors.textFaint} secureTextEntry={secure} autoCapitalize="none" {...rest} />
      {err ? <Text style={s.err}>{err}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  c: { padding: 26 },
  back: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  title: { color: colors.text, fontSize: 24, fontWeight: "400" },
  accentLine: { width: 48, height: 3, borderRadius: 3, backgroundColor: colors.pinkPastel, marginBottom: 6 },
  label: { color: colors.textDim, fontSize: 14, marginTop: 16, marginBottom: 8, fontWeight: "600" },
  input: { backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: 16, height: 50, color: colors.text, borderWidth: 1, borderColor: colors.border },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.pink, borderColor: colors.pink },
  chipTxt: { color: colors.textDim, fontWeight: "600", fontSize: 12 },
  chipTxtOn: { color: "#fff" },
  termsRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 22 },
  termsTxt: { color: colors.textDim, flex: 1 },
  err: { color: colors.bad, marginTop: 6, fontSize: 12 },
});
