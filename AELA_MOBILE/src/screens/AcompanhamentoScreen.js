import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Linking, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BarChart, LineChart, DonutChart, GroupedBar } from "../components/Charts";
import { colors, radius } from "../theme/colors";
import { IMG } from "../data/images";
import { OPERADORES } from "../data/mock";
import { preverRecuperacao } from "../services/prediction";

const SAUDE_COLOR = { boa: colors.good, media: colors.mid, ruim: colors.bad };
const SAUDE_LABEL = { boa: "Otimo", media: "Atencao", ruim: "Critico" };

function piorSistemaDeRec(metrics) {
  const rec = preverRecuperacao(metrics);
  return rec.reduce((a, b) =>
    b.diasRecuperacao > a.diasRecuperacao ||
    (b.diasRecuperacao === a.diasRecuperacao && b.desvio > a.desvio)
      ? b : a
  );
}

export default function AcompanhamentoScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const op = OPERADORES.find(o => o.id === selectedId);
  const pior = piorSistemaDeRec(op.metrics);
  const ringColor = pior.status === "Otimo" ? colors.good : pior.status === "Atencao" ? colors.mid : colors.bad;
  const d = op.dados;

  const contato = (quem) =>
    Alert.alert(quem, "Abrindo canal de atendimento (demo).", [
      { text: "Cancelar", style: "cancel" },
      { text: "Falar agora", onPress: () => Linking.openURL("tel:+5511999999999").catch(() => {}) },
    ]);

  return (
    <SafeAreaView style={s.root} edges={["top"]}>

      {/* Modal seletor de astronauta */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={s.overlay} onPress={() => setModalVisible(false)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>Selecionar astronauta</Text>
          {OPERADORES.map(o => {
            const piorO = piorSistemaDeRec(o.metrics);
            const selected = o.id === selectedId;
            const sc = SAUDE_COLOR[o.saude];
            return (
              <Pressable
                key={o.id}
                style={[s.crewItem, selected && s.crewItemSelected]}
                onPress={() => { setSelectedId(o.id); setModalVisible(false); }}
              >
                <Image source={o.foto} style={s.crewPhoto} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.crewName}>{o.nome}</Text>
                  <Text style={s.crewSpec}>{o.especialidade}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 4 }}>
                  <View style={[s.badge, { backgroundColor: sc + "22", borderColor: sc }]}>
                    <Text style={[s.badgeTxt, { color: sc }]}>{SAUDE_LABEL[o.saude]}</Text>
                  </View>
                  <Text style={s.crewDias}>
                    {piorO.diasRecuperacao > 0 ? `${piorO.diasRecuperacao} dias` : "Pronta"}
                  </Text>
                </View>
                {selected && <Ionicons name="checkmark-circle" size={18} color={colors.pink} style={{ marginLeft: 8 }} />}
              </Pressable>
            );
          })}
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
        <Text style={s.h1}>Acompanhamento</Text>
        <View style={s.accentLine} />
        <Text style={s.sub}>Saude individual e previsao de retorno a Terra</Text>

        {/* Seletor de astronauta */}
        <Pressable style={s.crewSelector} onPress={() => setModalVisible(true)}>
          <Image source={op.foto} style={s.selectorPhoto} />
          <Text style={s.selectorName}>{op.nome}</Text>
          <Text style={s.selectorSpec}>  ·  {op.especialidade}</Text>
          <Ionicons name="chevron-down" size={15} color={colors.textDim} style={{ marginLeft: "auto" }} />
        </Pressable>

        {/* Card de recuperacao */}
        <View style={s.recoveryCard}>
          <DonutChart
            size={76}
            data={[
              { value: Math.max(1, pior.desvio), color: ringColor },
              { value: Math.max(0.01, 100 - pior.desvio), color: colors.border },
            ]}
          />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <View style={[s.badge, { backgroundColor: ringColor + "22", borderColor: ringColor, alignSelf: "flex-start", marginBottom: 6 }]}>
              <Text style={[s.badgeTxt, { color: ringColor }]}>{pior.status}</Text>
            </View>
            <Text style={s.recoveryDias}>
              {pior.diasRecuperacao > 0 ? `${pior.diasRecuperacao} dias` : "Pronta"}
            </Text>
            <Text style={s.recoverySub}>
              {pior.diasRecuperacao > 0
                ? "estimados para recuperacao em gravidade 1G"
                : "para retorno imediato a Terra"}
            </Text>
            <Text style={s.recoverySystem}>{pior.label}</Text>
          </View>
        </View>

        <View style={s.cards}>
          <Pressable style={s.navCard} onPress={() => navigation.navigate("Body", { operadorId: op.id })}>
            <Image source={IMG.humano} style={s.navImg} resizeMode="contain" />
            <Text style={s.navTitle}>Corpo humano</Text>
            <Text style={s.navDesc}>Mapa de pontos clicaveis</Text>
          </Pressable>
          <Pressable style={s.navCard} onPress={() => navigation.navigate("Heart", { operadorId: op.id })}>
            <Image source={IMG.coracao} style={s.navImg} resizeMode="contain" />
            <Text style={s.navTitle}>Coração</Text>
            <Text style={s.navDesc}>Saude cardiovascular</Text>
          </Pressable>
        </View>

        <View style={s.dashRow}>
          <View style={[s.dash, { flex: 1 }]}>
            <Text style={s.dashLabel}>Densidade ossea media</Text>
            <Text style={s.dashVal}>{op.metrics.equilibrio}%</Text>
            <BarChart data={d.boneHistory} height={64} dark={false} />
          </View>
          <View style={[s.dash, { flex: 1 }]}>
            <Text style={s.dashLabel}>Pressao arterial</Text>
            <Text style={s.dashVal}>{d.pressao}</Text>
            <LineChart data={d.pressaoHistory} color={colors.pink} height={64} />
          </View>
        </View>

        <Text style={s.h2}>Nutricao</Text>
        <View style={s.dashRow}>
          <View style={[s.dash, { flex: 1, alignItems: "center" }]}>
            <Text style={s.dashLabel}>Macros do dia</Text>
            <DonutChart size={104} data={[
              { value: d.macros.carb, color: colors.pink },
              { value: d.macros.prot, color: colors.orange },
              { value: d.macros.gord, color: colors.pinkPastel },
            ]} />
            <View style={s.legend}>
              {[["Carb", colors.pink], ["Prot", colors.orange], ["Gord", colors.pinkPastel]].map(([l, c]) => (
                <View key={l} style={s.legendRow}>
                  <View style={[s.legendDot, { backgroundColor: c }]} />
                  <Text style={s.legendTxt}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={[s.dash, { flex: 1 }]}>
            <Text style={s.dashLabel}>Calorias x meta</Text>
            <Text style={s.dashVal}>{d.calorias} kcal</Text>
            <GroupedBar a={d.caloriasHistory} b={d.caloriasMeta} height={70} />
          </View>
        </View>

        <View style={s.dashRow}>
          <View style={[s.dash, { flex: 1 }]}>
            <Text style={s.dashLabel}>Qualidade do sono (h)</Text>
            <Text style={s.dashVal}>{op.metrics.sono} h</Text>
            <LineChart data={d.sonoHistory} color={colors.orange} height={64} />
          </View>
          <View style={[s.dash, { flex: 1 }]}>
            <Text style={s.dashLabel}>Hidratacao semanal</Text>
            <Text style={s.dashVal}>{d.hidratacao} L</Text>
            <BarChart data={d.hidratacaoHistory} height={64} />
          </View>
        </View>

        <Text style={s.h2}>Saude mental</Text>
        <Pressable style={s.mental} onPress={() => navigation.navigate("Mental")}>
          <Image source={IMG.cerebro} style={s.mentalImg} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text style={s.mentalTitle}>Bem-estar mental</Text>
            <Text style={s.mentalDesc}>Humor, estresse, sono e cognicao da tripulacao.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
        </Pressable>

        <Text style={s.h2}>Precisa de apoio?</Text>
        <Pressable style={s.doc} onPress={() => contato("Ajuda medica")}>
          <Image source={IMG.medico1} style={s.docImg} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.docTitle}>Precisando de ajuda medica?</Text>
            <Text style={s.docDesc}>Fale com a equipe medica da missao.</Text>
          </View>
          <Ionicons name="call" size={20} color={colors.pink} />
        </Pressable>
        <Pressable style={s.doc} onPress={() => contato("Apoio psicologico")}>
          <Image source={IMG.medico2} style={s.docImg} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.docTitle}>Precisando de psicologo?</Text>
            <Text style={s.docDesc}>Agende uma sessao de apoio emocional.</Text>
          </View>
          <Ionicons name="call" size={20} color={colors.pink} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  // titulo
  h1: { color: colors.text, fontSize: 26, fontWeight: "700" },
  accentLine: { width: 48, height: 3, borderRadius: 3, backgroundColor: colors.pinkPastel, marginTop: 8 },
  sub: { color: colors.textDim, marginTop: 4 },
  // seletor de astronauta
  crewSelector: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.card, borderRadius: radius.pill,
    paddingVertical: 8, paddingHorizontal: 14,
    borderWidth: 1, borderColor: colors.border,
    marginTop: 14,
  },
  selectorPhoto: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  selectorName: { color: colors.text, fontWeight: "700", fontSize: 14 },
  selectorSpec: { color: colors.textDim, fontSize: 13 },
  // card de recuperacao
  recoveryCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.card, borderRadius: radius.lg,
    padding: 14, borderWidth: 1, borderColor: colors.border,
    marginTop: 12, marginBottom: 4,
  },
  recoveryDias: { color: colors.text, fontSize: 28, fontWeight: "800" },
  recoverySub: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  recoverySystem: { color: colors.textFaint, fontSize: 11, marginTop: 4 },
  // badge (status)
  badge: { borderRadius: radius.pill, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  badgeTxt: { fontSize: 11, fontWeight: "700" },
  // modal
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: 44,
    borderWidth: 1, borderColor: colors.border,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: "center", marginBottom: 16 },
  sheetTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  crewItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  crewItemSelected: { backgroundColor: colors.cardSoft, borderRadius: radius.md, paddingHorizontal: 8, borderBottomWidth: 0 },
  crewPhoto: { width: 44, height: 44, borderRadius: 22 },
  crewName: { color: colors.text, fontWeight: "700", fontSize: 15 },
  crewSpec: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  crewDias: { color: colors.textFaint, fontSize: 11 },
  // cards corpo/coração
  cards: { flexDirection: "row", gap: 12, marginTop: 16 },
  navCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  navImg: { width: "100%", height: 130 },
  navTitle: { color: colors.text, fontWeight: "700", fontSize: 16, marginTop: 8 },
  navDesc: { color: colors.textDim, fontSize: 12, marginTop: 2, textAlign: "center" },
  // dashboard
  dashRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  dash: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border },
  dashLabel: { color: colors.textDim, fontSize: 12, fontWeight: "600" },
  dashVal: { color: colors.text, fontSize: 24, fontWeight: "800", marginVertical: 6 },
  legend: { marginTop: 10, gap: 5, alignSelf: "stretch" },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendTxt: { color: colors.textDim, fontSize: 11 },
  h2: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: 24, marginBottom: 12 },
  mental: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: colors.border },
  mentalImg: { width: 64, height: 64, marginRight: 12 },
  mentalTitle: { color: colors.text, fontWeight: "700", fontSize: 16 },
  mentalDesc: { color: colors.textDim, fontSize: 12, marginTop: 3 },
  doc: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  docImg: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.cardSoft },
  docTitle: { color: colors.text, fontWeight: "700" },
  docDesc: { color: colors.textDim, fontSize: 12, marginTop: 3 },
});
