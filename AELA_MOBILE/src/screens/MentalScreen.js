import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Ring, LineChart } from "../components/Charts";
import { colors, radius } from "../theme/colors";
import { IMG } from "../data/images";

const HUMOR = [
  { e: "😖", l: "Estresse" }, { e: "🙂", l: "Calmo" },
  { e: "😄", l: "Otimo" }, { e: "😴", l: "Cansado" },
];

export default function MentalScreen({ navigation }) {
  const [sel, setSel] = useState(1);
  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="chevron-back" size={22} color={colors.frostText} />
        </Pressable>
        <View style={s.hero}><Image source={IMG.cerebro} style={s.brain} resizeMode="contain" /></View>
        <Text style={s.title}>Saude Mental</Text>
        <Text style={s.sub}>Como voce esta se sentindo hoje?</Text>

        <View style={s.humor}>
          {HUMOR.map((h, i) => (
            <Pressable key={i} onPress={() => setSel(i)} style={[s.hItem, sel === i && s.hItemOn]}>
              <Text style={s.emoji}>{h.e}</Text>
              <Text style={[s.hLabel, sel === i && { color: "#fff" }]}>{h.l}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.row}>
          {[["Clareza mental", 86, colors.pink], ["Estresse", 24, colors.orange], ["Cognicao", 88, colors.good]].map(([l, v, c]) => (
            <View key={l} style={s.ringCard}>
              <Ring value={v} color={c} track="#EDE8E0" size={70} />
              <Text style={s.ringL}>{l}</Text>
            </View>
          ))}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Qualidade do sono (semana)</Text>
          <LineChart data={[6, 7.5, 5, 8, 6.5, 7, 8]} color={colors.pink} height={120} />
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Recomendacao</Text>
          <Text style={s.cardDesc}>Pratique 10 min de respiracao guiada antes do periodo de sono. O estresse cumulativo da missao esta controlado.</Text>
        </View>

        <Pressable style={s.btn} onPress={() => navigation.navigate("SystemDetail", { sistema: "mental", titulo: "Saude Mental" })}>
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
  brain: { width: 180, height: 160 },
  title: { color: colors.frostText, fontSize: 24, fontWeight: "800", marginTop: 8 },
  sub: { color: colors.frostDim, marginTop: 4, marginBottom: 16 },
  humor: { flexDirection: "row", gap: 10 },
  hItem: { flex: 1, backgroundColor: colors.frostCard, borderRadius: radius.md, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#E7E2DA" },
  hItemOn: { backgroundColor: colors.pink, borderColor: colors.pink },
  emoji: { fontSize: 24 },
  hLabel: { color: colors.frostDim, fontSize: 11, marginTop: 4, fontWeight: "600" },
  row: { flexDirection: "row", gap: 10, marginTop: 16 },
  ringCard: { flex: 1, backgroundColor: colors.frostCard, borderRadius: radius.lg, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "#E7E2DA" },
  ringL: { color: colors.frostDim, fontSize: 11, marginTop: 8, fontWeight: "600", textAlign: "center" },
  card: { backgroundColor: colors.frostCard, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: "#E7E2DA", marginTop: 14 },
  cardTitle: { color: colors.frostText, fontWeight: "700", marginBottom: 8 },
  cardDesc: { color: colors.frostDim, fontSize: 13, lineHeight: 19 },
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.pink, borderRadius: radius.pill, height: 54, marginTop: 18 },
  btnTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
