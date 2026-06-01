import React from "react";
import { View, Text, StyleSheet, Image, Pressable, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../theme/colors";
import { IMG } from "../data/images";

const { width } = Dimensions.get("window");
const H = width * 1.5;

// pontos sobre o corpo. side define o lado da caixinha
const PONTOS = [
  { id: "mental", n: 1, label: "Sanidade / Mental", status: "boa", top: 0.10, side: "esq", go: "Mental" },
  { id: "coracao", n: 2, label: "Coração", status: "boa", top: 0.30, side: "dir", go: "Heart" },
  { id: "braco", n: 3, label: "Ossos · Braço", status: "media", top: 0.45, side: "esq", sistema: "ossos", titulo: "Ossos - Braço" },
  { id: "perna", n: 4, label: "Ossos · Perna / Joelho", status: "media", top: 0.70, side: "dir", sistema: "ossos", titulo: "Ossos - Perna/Joelho" },
];

const STATUS_COR = { boa: colors.good, media: colors.mid, ruim: colors.bad };
const STATUS_TXT = { boa: "Estavel", media: "Atencao", ruim: "Critico" };

export default function BodyScreen({ navigation, route }) {
  const { operadorId } = route.params || {};
  const onPoint = (p) => {
    if (p.go) navigation.navigate(p.go, { operadorId });
    else navigation.navigate("SystemDetail", { sistema: p.sistema, titulo: p.titulo, operadorId });
  };

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <Pressable onPress={() => navigation.goBack()} style={s.back}>
        <Ionicons name="chevron-back" size={22} color={colors.frostText} />
      </Pressable>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <Text style={s.title}>Mapa Corporal</Text>
        <View style={s.accentLine} />
        <Text style={s.sub}>4 áreas monitoradas · toque em um ponto</Text>

        <View style={s.summaryRow}>
          {[["Estaveis", "2", colors.good], ["Em atencao", "2", colors.mid], ["Criticos", "0", colors.bad]].map(([l, v, c]) => (
            <View key={l} style={s.sumCard}>
              <Text style={[s.sumVal, { color: c }]}>{v}</Text>
              <Text style={s.sumLabel}>{l}</Text>
            </View>
          ))}
        </View>

        <View style={s.stage}>
          <Image source={IMG.humano} style={s.body} resizeMode="contain" />
          {PONTOS.map((p) => {
            const Dot = (
              <View style={[s.pulse, { backgroundColor: STATUS_COR[p.status] }]}><Text style={s.pNum}>{p.n}</Text></View>
            );
            const Tag = (
              <View style={s.tag}>
                <Text style={s.tagTxt} numberOfLines={1}>{p.label}</Text>
              </View>
            );
            return (
              <Pressable
                key={p.id}
                onPress={() => onPoint(p)}
                style={[
                  s.point,
                  { top: p.top * H },
                  p.side === "esq" ? { left: 14 } : { right: 14, flexDirection: "row-reverse" },
                ]}
              >
                {p.side === "esq" ? (<>{Tag}{Dot}</>) : (<>{Dot}{Tag}</>)}
              </Pressable>
            );
          })}
        </View>

        <Text style={s.listTitle}>Areas monitoradas</Text>
        {PONTOS.map((p) => (
          <Pressable key={p.id} style={s.listItem} onPress={() => onPoint(p)}>
            <View style={[s.listNum, { backgroundColor: STATUS_COR[p.status] }]}><Text style={s.pNum}>{p.n}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.listLabel}>{p.label}</Text>
              <Text style={[s.listStatus, { color: STATUS_COR[p.status] }]}>{STATUS_TXT[p.status]}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.frostDim} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.frost },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.frostCard, borderWidth: 1, borderColor: "#E7E2DA", margin: 14 },
  title: { color: colors.frostText, fontSize: 28, fontWeight: "800", paddingHorizontal: 18 },
  accentLine: { width: 48, height: 3, borderRadius: 3, backgroundColor: colors.pinkPastel, marginLeft: 18, marginTop: 6 },
  sub: { color: colors.frostDim, paddingHorizontal: 18, marginTop: 4, marginBottom: 6 },
  summaryRow: { flexDirection: "row", gap: 10, paddingHorizontal: 18, marginTop: 10, marginBottom: 6 },
  sumCard: { flex: 1, backgroundColor: colors.frostCard, borderRadius: radius.lg, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#E7E2DA" },
  sumVal: { fontSize: 22, fontWeight: "800" },
  sumLabel: { color: colors.frostDim, fontSize: 11, marginTop: 2 },
  stage: { width, height: H },
  body: { width: "100%", height: "100%" },
  point: { position: "absolute", flexDirection: "row", alignItems: "center", gap: 8, maxWidth: width * 0.62 },
  pulse: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.pink, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff", shadowColor: colors.pink, shadowOpacity: 0.6, shadowRadius: 8, elevation: 6 },
  pNum: { color: "#fff", fontWeight: "800", fontSize: 13 },
  tag: { backgroundColor: colors.frostText, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, maxWidth: width * 0.5 },
  tagTxt: { color: "#fff", fontSize: 12.5, fontWeight: "700" },
  listTitle: { color: colors.frostText, fontSize: 18, fontWeight: "800", paddingHorizontal: 18, marginTop: 8, marginBottom: 12 },
  listItem: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.frostCard, borderRadius: radius.lg, padding: 12, marginHorizontal: 18, marginBottom: 10, borderWidth: 1, borderColor: "#E7E2DA" },
  listNum: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  listLabel: { color: colors.frostText, fontWeight: "700", fontSize: 14 },
  listStatus: { fontSize: 12, fontWeight: "600", marginTop: 2 },
});
