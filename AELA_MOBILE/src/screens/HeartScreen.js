import React from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LineChart, Ring } from "../components/Charts";
import { colors, radius } from "../theme/colors";
import { IMG } from "../data/images";
import { OPERADORES } from "../data/mock";
import { preverRecuperacao } from "../services/prediction";

export default function HeartScreen({ navigation, route }) {
  const { operadorId } = route.params || {};
  const op = (operadorId ? OPERADORES.find(o => o.id === operadorId) : null) || OPERADORES[0];

  const previsoes = preverRecuperacao(op.metrics);
  const cardio = previsoes.find(p => p.sistema === "coracao");
  const ringColor = cardio.status === "Otimo" ? colors.good : cardio.status === "Atencao" ? colors.mid : colors.bad;
  const hrv = Math.max(20, Math.round(80 - cardio.desvio * 0.8));
  const fcBase = op.metrics.fc;
  const fcChart = [fcBase - 4, fcBase + 2, fcBase + 20, fcBase + 8, fcBase + 4, fcBase, fcBase - 2];
  const descCard = cardio.status === "Otimo"
    ? "Risco baixo. Adaptacao cardiovascular dentro do esperado para a fase da missao."
    : cardio.status === "Atencao"
    ? "Risco elevado. Monitoramento intensivo recomendado."
    : "Risco alto. Consulta medica imediata necessaria.";

  const METRICAS = [
    { k: "FC repouso", v: `${op.metrics.fc} bpm`, c: colors.pink },
    { k: "Pressao", v: op.dados.pressao, c: colors.orange },
    { k: "SpO2", v: `${op.metrics.spo2}%`, c: colors.good },
    { k: "Variabilidade", v: `${hrv} ms`, c: colors.pinkSoft },
  ];

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="chevron-back" size={22} color={colors.frostText} />
        </Pressable>
        <View style={s.hero}>
          <Image source={IMG.coracao} style={s.heart} resizeMode="contain" />
        </View>
        <Text style={s.title}>Sistema Cardiovascular</Text>
        <Text style={s.sub}>Monitoramento continuo do coração em microgravidade</Text>

        <View style={s.grid}>
          {METRICAS.map((m) => (
            <View key={m.k} style={s.metric}>
              <View style={[s.mDot, { backgroundColor: m.c }]} />
              <Text style={s.mVal}>{m.v}</Text>
              <Text style={s.mKey}>{m.k}</Text>
            </View>
          ))}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Frequencia cardiaca (24h)</Text>
          <LineChart data={fcChart} color={colors.pink} height={140} />
        </View>

        <View style={[s.card, { flexDirection: "row", alignItems: "center", gap: 16 }]}>
          <Ring value={cardio.score} color={ringColor} track="#EDE8E0" />
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>Indice de saude cardiaca</Text>
            <Text style={s.cardDesc}>{descCard}</Text>
          </View>
        </View>

        <Pressable
          style={s.btn}
          onPress={() => navigation.navigate("SystemDetail", { sistema: "coracao", titulo: "Coração", operadorId: op.id })}
        >
          <Text style={s.btnTxt}>Ver previsao de recuperacao</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.frost },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.frostCard, borderWidth: 1, borderColor: "#E7E2DA" },
  hero: { alignItems: "center", marginTop: 8 },
  heart: { width: 200, height: 200 },
  title: { color: colors.frostText, fontSize: 24, fontWeight: "800", marginTop: 8 },
  sub: { color: colors.frostDim, marginTop: 4, marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metric: { width: "47%", backgroundColor: colors.frostCard, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: "#E7E2DA" },
  mDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 8 },
  mVal: { color: colors.frostText, fontSize: 22, fontWeight: "800" },
  mKey: { color: colors.frostDim, fontSize: 12, marginTop: 2 },
  card: { backgroundColor: colors.frostCard, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: "#E7E2DA", marginTop: 14 },
  cardTitle: { color: colors.frostText, fontWeight: "700", marginBottom: 8 },
  cardDesc: { color: colors.frostDim, fontSize: 13, lineHeight: 19 },
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.pink, borderRadius: radius.pill, height: 54, marginTop: 18 },
  btnTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
