import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Ring, BarChart } from "../components/Charts";
import HealthBadge from "../components/HealthBadge";
import { colors, radius } from "../theme/colors";
import { OPERADORES, TIPOS_TAREFA } from "../data/mock";
import { api } from "../services/api";

export default function OperadorDetailScreen({ navigation, route }) {
  const op = OPERADORES.find((o) => o.id === route.params.id) || OPERADORES[0];
  const [tarefa, setTarefa] = useState("EVA");
  const [readiness, setReadiness] = useState(null);
  const [busy, setBusy] = useState(false);
  const [foto, setFoto] = useState(null);

  const calcular = async () => {
    setBusy(true);
    const r = await api.readiness(op.id, tarefa);
    setBusy(false);
    if (r.ok && r.data) setReadiness(r.data);
    else setReadiness({ scoreGeral: op.score, classificacao: op.score >= 80 ? "APTO" : op.score >= 50 ? "MONITORAMENTO" : "INAPTO", recomendacao: "Calculo local (API offline). Baseado na ultima leitura simulada." });
  };

  const registrarLeituraCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert("Permissao negada", "Habilite a camera para registrar a leitura."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (res.canceled) return;
    setFoto(res.assets[0].uri);
    await api.registrarLeitura(op.id, { freqCardiaca: op.metrics.fc, saturacaoO2: op.metrics.spo2, fonte: "CAMERA", scoreCognitivo: op.metrics.cog });
    Alert.alert("Leitura registrada", "Captura via camera anexada a leitura fisiologica.");
  };

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={s.head}>
          <Image source={foto ? { uri: foto } : op.foto} style={s.avatar} />
          <Text style={s.nome}>{op.nome}</Text>
          <Text style={s.esp}>{op.especialidade}</Text>
          <HealthBadge status={op.saude} />
        </View>

        <View style={s.metrics}>
          {[["FC", op.metrics.fc], ["SpO2", op.metrics.spo2 + "%"], ["Sono", op.metrics.sono + "h"], ["Cognicao", op.metrics.cog]].map(([l, v]) => (
            <View key={l} style={s.metric}><Text style={s.mVal}>{v}</Text><Text style={s.mKey}>{l}</Text></View>
          ))}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Prontidao por tarefa (ReadinessScore)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginVertical: 10 }}>
            {TIPOS_TAREFA.map((t) => (
              <Pressable key={t.key} onPress={() => setTarefa(t.key)} style={[s.chip, tarefa === t.key && s.chipOn]}>
                <Text style={[s.chipTxt, tarefa === t.key && { color: "#fff" }]}>{t.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={s.calc} onPress={calcular}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.calcTxt}>Calcular ReadinessScore</Text>}
          </Pressable>
          {readiness ? (
            <View style={s.result}>
              <Ring value={readiness.scoreGeral || 0} color={colors.pink} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.classif}>{readiness.classificacao}</Text>
                <Text style={s.reco}>{readiness.recomendacao}</Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Tendencia de prontidao</Text>
          <BarChart data={[70, 74, 68, 80, 76, 84, op.score]} />
        </View>

        <Pressable style={s.cam} onPress={registrarLeituraCamera}>
          <Ionicons name="camera" size={20} color="#fff" />
          <Text style={s.camTxt}>Registrar leitura (camera)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  head: { alignItems: "center", marginTop: 8, gap: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.card },
  nome: { color: colors.text, fontSize: 22, fontWeight: "700" },
  esp: { color: colors.textDim, marginBottom: 4 },
  metrics: { flexDirection: "row", gap: 10, marginTop: 20 },
  metric: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  mVal: { color: colors.text, fontSize: 18, fontWeight: "800" },
  mKey: { color: colors.textDim, fontSize: 11, marginTop: 4 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border, marginTop: 16 },
  cardTitle: { color: colors.text, fontWeight: "700" },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: colors.cardSoft, borderWidth: 1, borderColor: colors.border },
  chipOn: { backgroundColor: colors.pink, borderColor: colors.pink },
  chipTxt: { color: colors.textDim, fontWeight: "600", fontSize: 12 },
  calc: { backgroundColor: colors.orange, borderRadius: radius.pill, height: 48, alignItems: "center", justifyContent: "center" },
  calcTxt: { color: "#fff", fontWeight: "700" },
  result: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  classif: { color: colors.pink, fontSize: 18, fontWeight: "800" },
  reco: { color: colors.textDim, fontSize: 13, marginTop: 4, lineHeight: 18 },
  cam: { flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.pink, borderRadius: radius.pill, height: 54, marginTop: 18 },
  camTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
