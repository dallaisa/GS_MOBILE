import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Gradient from "../components/Gradient";
import Button from "../components/Button";
import { colors, gradients } from "../theme/colors";
import { IMG } from "../data/images";

const { width } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={s.root}>
      <Gradient colors={gradients.pastel} style={s.glow} />
      <SafeAreaView style={s.safe}>
        <View style={s.top}>
          <View style={s.logoWrap}>
            <Image source={IMG.logo} style={s.logo} resizeMode="cover" />
          </View>
          <Text style={s.brand}>AELA</Text>
          <View style={s.accentLine} />
          <Text style={s.tag}>Adaptive Exposome Life Assessment</Text>
          <Text style={s.sub}>Inteligencia biologica para tripulacoes em ambientes extremos.</Text>
        </View>
        <View style={s.actions}>
          <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} />
          <Button title="Create Account" variant="outline" onPress={() => navigation.navigate("SignUp")} style={{ marginTop: 14 }} />
          <Text style={s.terms}>
            Ao continuar voce concorda com os <Text style={s.link}>Termos</Text> e a <Text style={s.link}>Politica de Privacidade</Text>.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  glow: { position: "absolute", top: -width * 0.4, alignSelf: "center", width: width * 1.4, height: width * 1.4, borderRadius: width, opacity: 0.28 },
  safe: { flex: 1, justifyContent: "space-between", paddingHorizontal: 28, paddingVertical: 20 },
  top: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoWrap: { width: 150, height: 150, borderRadius: 75, backgroundColor: colors.card, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  logo: { width: 150, height: 150 },
  brand: { color: colors.text, fontSize: 44, fontWeight: "200", letterSpacing: 10, marginTop: 26 },
  accentLine: { width: 54, height: 3, borderRadius: 3, backgroundColor: colors.pinkPastel, marginTop: 14 },
  tag: { color: colors.pinkPastel, fontSize: 13, letterSpacing: 1, marginTop: 12 },
  sub: { color: colors.textDim, fontSize: 15, textAlign: "center", marginTop: 18, lineHeight: 22, paddingHorizontal: 10 },
  actions: { paddingBottom: 10 },
  terms: { color: colors.textFaint, fontSize: 12, textAlign: "center", marginTop: 22, lineHeight: 18 },
  link: { color: colors.textDim, textDecorationLine: "underline" },
});
