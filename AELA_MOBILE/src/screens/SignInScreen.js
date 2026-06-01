import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import { colors, radius } from "../theme/colors";
import { IMG } from "../data/images";
import { useAuth } from "../../App";

export default function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async () => {
    if (!email.trim() || !senha.trim()) { setErr("Preencha e-mail e senha."); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("Formato de e-mail invalido."); return; }
    setErr("");
    await signIn({ nome: "Supervisora AELA", email });
  };

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.c} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={s.logoWrap}><Image source={IMG.logo} style={s.logo} resizeMode="cover" /></View>
        <Text style={s.title}>Bem-vinda de volta</Text>
        <View style={s.accentLine} />
        <Text style={s.ver}>2.4.0 Alpha</Text>

        <Text style={s.label}>Email / Usuario</Text>
        <TextInput style={s.input} placeholder="nome@aela.io" placeholderTextColor={colors.textFaint}
          autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />

        <Text style={s.label}>Senha</Text>
        <View style={s.pwd}>
          <TextInput style={s.pwdInput} placeholder="********" placeholderTextColor={colors.textFaint}
            secureTextEntry={!show} value={senha} onChangeText={setSenha} />
          <Pressable onPress={() => setShow(!show)}>
            <Ionicons name={show ? "eye-off" : "eye"} size={20} color={colors.textDim} />
          </Pressable>
        </View>

        {err ? <Text style={s.err}>{err}</Text> : null}

        <Button title="Sign In" onPress={onSubmit} style={{ marginTop: 22 }} />
        <Text style={s.forgot}>Esqueceu a senha?</Text>

        <View style={s.divider}><View style={s.line} /><Text style={s.or}>Ou</Text><View style={s.line} /></View>

        <Pressable style={s.social} onPress={() => Alert.alert("Demo", "Login social e ilustrativo.")}>
          <Ionicons name="logo-google" size={18} color={colors.text} />
          <Text style={s.socialTxt}>Continue with Google</Text>
        </Pressable>
        <Pressable style={s.social} onPress={() => Alert.alert("Demo", "Login social e ilustrativo.")}>
          <Ionicons name="logo-facebook" size={18} color={colors.text} />
          <Text style={s.socialTxt}>Continue with Facebook</Text>
        </Pressable>

        <Text style={s.bottom}>
          Nao tem conta?{" "}
          <Text style={s.link} onPress={() => navigation.navigate("SignUp")}>Sign up</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  c: { padding: 26, paddingTop: 8 },
  back: { width: 40, height: 40, justifyContent: "center" },
  logoWrap: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.card, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.pink, marginTop: 4, overflow: "hidden" },
  logo: { width: "100%", height: "100%", borderRadius: 38 },
  title: { color: colors.text, fontSize: 26, fontWeight: "300", marginTop: 20 },
  accentLine: { width: 50, height: 3, borderRadius: 3, backgroundColor: colors.pinkPastel, marginTop: 12 },
  ver: { color: colors.textFaint, fontSize: 12, marginTop: 4 },
  label: { color: colors.textDim, fontSize: 14, marginTop: 22, marginBottom: 8, fontWeight: "600" },
  input: { backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: 16, height: 52, color: colors.text, borderWidth: 1, borderColor: colors.border },
  pwd: { backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: 16, height: 52, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border },
  pwdInput: { flex: 1, color: colors.text },
  err: { color: colors.bad, marginTop: 12, fontSize: 13 },
  forgot: { color: colors.pink, textAlign: "center", marginTop: 16, fontWeight: "600" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 22 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.textDim, marginHorizontal: 12 },
  social: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: colors.card, borderRadius: radius.pill, height: 52, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  socialTxt: { color: colors.text, fontWeight: "600" },
  bottom: { color: colors.textDim, textAlign: "center", marginTop: 18 },
  link: { color: colors.pink, fontWeight: "700" },
});
