import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LineChart, Ring } from "../components/Charts";
import { colors, radius } from "../theme/colors";
import { preverRecuperacao, projetar30dias } from "../services/prediction";
import { OPERADORES } from "../data/mock";

export default function SystemDetailScreen({ navigation, route }) {
  const { sistema, titulo, operadorId } = route.params || {};
  const op = operadorId ? OPERADORES.find(o => o.id === operadorId) : null;
  const metrics = op ? op.metrics : { fc: 82, equilibrio: 74, cog: 70, sono: 5.5 };
  const previsoes = preverRecuperacao(metrics);
  const alvo = previsoes.find((p) => p.sistema === sistema) || previsoes[0];
  const curva = projetar30dias(alvo.score);
  const corStatus = alvo.status === "Otimo" ? colors.good : alvo.status === "Atencao" ? colors.mid : colors.bad;

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="chevron-back" size={22} color={colors.frostText} />
        </Pressable>
        <Text style={s.title}>{titulo}</Text>
        <Text style={s.sub}>Previsao individual de retorno a Terra (modelo on-device)</Text>

        <View style={[s.card, { flexDirection: "row", alignItems: "center", gap: 16 }]}>
          <Ring value={alvo.score} color={corStatus} track="#EDE8E0" />
          <View style={{ flex: 1 }}>
            <View style={[s.badge, { backgroundColor: corStatus + "22", borderColor: corStatus }]}>
              <Text style={[s.badgeTxt, { color: corStatus }]}>{alvo.status}</Text>
            </View>
            <Text style={s.big}>{alvo.diasRecuperacao} dias</Text>
            <Text style={s.cardDesc}>estimados para recuperacao em gravidade 1G</Text>
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Curva de recuperacao projetada</Text>
          <LineChart data={curva} color={colors.pink} height={140} />
          <Text style={s.cardDesc}>Desvio atual em relacao ao baseline: {alvo.desvio}%</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Todos os sistemas</Text>
          {previsoes.map((p) => (
            <View key={p.sistema} style={s.line}>
              <Text style={s.lineL}>{p.label}</Text>
              <Text style={[s.lineV, { color: p.score >= 80 ? colors.good : p.score >= 60 ? colors.mid : colors.bad }]}>
                {p.score} - {p.diasRecuperacao}d
              </Text>
            </View>
          ))}
        </View>
        <Text style={s.note}>Modelo preditivo leve em JavaScript. A versao Python/scikit-learn esta documentada no README do projeto.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.frost },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.frostCard, borderWidth: 1, borderColor: "#E7E2DA" },
  title: { color: colors.frostText, fontSize: 26, fontWeight: "800", marginTop: 10 },
  sub: { color: colors.frostDim, marginTop: 4, marginBottom: 16 },
  card: { backgroundColor: colors.frostCard, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: "#E7E2DA", marginTop: 14 },
  cardTitle: { color: colors.frostText, fontWeight: "700", marginBottom: 8 },
  cardDesc: { color: colors.frostDim, fontSize: 13, marginTop: 6 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  badgeTxt: { fontWeight: "700", fontSize: 12 },
  big: { color: colors.frostText, fontSize: 30, fontWeight: "800", marginTop: 8 },
  line: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#EDE8E0" },
  lineL: { color: colors.frostText },
  lineV: { fontWeight: "700" },
  note: { color: colors.frostDim, fontSize: 12, marginTop: 16, fontStyle: "italic", lineHeight: 18 },
});
