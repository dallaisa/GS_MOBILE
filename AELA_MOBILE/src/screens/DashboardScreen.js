import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import HealthBadge from "../components/HealthBadge";
import { BarChart, LineChart, Ring, DonutChart } from "../components/Charts";
import { colors, radius } from "../theme/colors";
import { OPERADORES } from "../data/mock";
import { api } from "../services/api";
import { useAuth } from "../../App";

const DIAS = [
  { d: "Seg", n: 14 }, { d: "Ter", n: 15 }, { d: "Qua", n: 16 },
  { d: "Qui", n: 17 }, { d: "Sex", n: 18 }, { d: "Sab", n: 19 }, { d: "Dom", n: 20 },
];

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [sel, setSel] = useState(2);
  const [tab, setTab] = useState("atividade");
  const [ops, setOps] = useState(OPERADORES);
  const [online, setOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = async () => {
    const r = await api.listarOperadores();
    if (r.ok && Array.isArray(r.data)) {
      setOnline(true);
      // mescla com fotos locais
      setOps(r.data.map((o, i) => ({ ...OPERADORES[i % OPERADORES.length], ...o, foto: OPERADORES[i % OPERADORES.length].foto })));
    } else {
      setOnline(false);
      setOps(OPERADORES);
    }
  };
  useEffect(() => { carregar(); }, []);
  const onRefresh = async () => { setRefreshing(true); await carregar(); setRefreshing(false); };

  const media = Math.round(ops.reduce((a, b) => a + (b.score || 0), 0) / ops.length);

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.pink} />}>
        <View style={s.header}>
          <View>
            <Text style={s.hi}>Ola, {(user && user.nome) ? user.nome.split(" ")[0] : "Supervisora"}</Text>
            <Text style={s.sub}>Centro de Controle AELA</Text>
          </View>
          <View style={[s.statusDot, { backgroundColor: online ? colors.good + "22" : colors.mid + "22", borderColor: online ? colors.good : colors.mid }]}>
            <View style={[s.dot, { backgroundColor: online ? colors.good : colors.mid }]} />
            <Text style={[s.statusTxt, { color: online ? colors.good : colors.mid }]}>{online ? "API online" : "Modo demo"}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.week}>
          {DIAS.map((x, i) => (
            <Pressable key={i} onPress={() => setSel(i)} style={[s.day, sel === i && s.dayOn]}>
              <Text style={[s.dayD, sel === i && s.dayActiveTxt]}>{x.d}</Text>
              <Text style={[s.dayN, sel === i && s.dayActiveTxt]}>{x.n}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={s.seg}>
          {[["atividade", "Atividade"], ["nutricao", "Nutricao"]].map(([k, l]) => (
            <Pressable key={k} onPress={() => setTab(k)} style={[s.segBtn, tab === k && s.segOn]}>
              <Text style={[s.segTxt, tab === k && s.segTxtOn]}>{l}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.bigWrap}>
          <Text style={s.big}>{media}</Text>
          <Text style={s.bigLabel}>Prontidao media da tripulacao</Text>
        </View>

        <View style={s.stats}>
          {[["Operadoras", ops.length], ["Em missao", "4"], ["Alertas", ops.filter((o) => o.saude === "ruim").length]].map(([l, v], i) => (
            <Card key={i} style={s.stat}>
              <Text style={s.statLabel}>{l}</Text>
              <Text style={s.statVal}>{v}</Text>
            </Card>
          ))}
        </View>

        {tab === "atividade" ? (
          <>
            <Text style={s.section}>Indicadores</Text>
            <View style={s.charts}>
              <Card style={{ flex: 1 }}>
                <Text style={s.chartTitle}>Prontidao semanal</Text>
                <BarChart data={[62, 70, 68, 80, 74, 88, media]} />
              </Card>
            </View>
            <View style={[s.charts, { marginTop: 12 }]}>
              <Card style={{ flex: 1.4 }}>
                <Text style={s.chartTitle}>Frequencia cardiaca media</Text>
                <LineChart data={[66, 72, 69, 75, 71, 68]} color={colors.orange} />
              </Card>
              <Card style={{ width: 120, alignItems: "center" }}>
                <Text style={s.chartTitle}>SpO2</Text>
                <Ring value={97} color={colors.pink} />
                <Text style={s.ringSub}>media</Text>
              </Card>
            </View>
          </>
        ) : (
          <>
            <Text style={s.section}>Nutricao da tripulacao</Text>
            <View style={s.charts}>
              <Card style={{ flex: 1.3, alignItems: "center" }}>
                <Text style={s.chartTitle}>Distribuicao de macros</Text>
                <DonutChart data={[
                  { value: 45, color: colors.pink },
                  { value: 30, color: colors.orange },
                  { value: 25, color: colors.pinkPastel },
                ]} />
                <View style={s.legend}>
                  {[["Carboidratos", colors.pink], ["Proteinas", colors.orange], ["Gorduras", colors.pinkPastel]].map(([l, c]) => (
                    <View key={l} style={s.legendRow}>
                      <View style={[s.legendDot, { backgroundColor: c }]} />
                      <Text style={s.legendTxt}>{l}</Text>
                    </View>
                  ))}
                </View>
              </Card>
              <Card style={{ width: 120, alignItems: "center" }}>
                <Text style={s.chartTitle}>Hidratacao</Text>
                <Ring value={82} color={colors.pinkPastel} />
                <Text style={s.ringSub}>meta diaria</Text>
              </Card>
            </View>
            <View style={[s.charts, { marginTop: 12 }]}>
              <Card style={{ flex: 1 }}>
                <Text style={s.chartTitle}>Calorias consumidas (kcal)</Text>
                <BarChart data={[1800, 2100, 1950, 2200, 2050, 2300, 1990]} />
              </Card>
            </View>
            <View style={s.macroStats}>
              {[["Refeicoes", "4/dia"], ["Agua", "2.4 L"], ["Suplementos", "OK"]].map(([l, v], i) => (
                <Card key={i} style={s.stat}>
                  <Text style={s.statLabel}>{l}</Text>
                  <Text style={s.statVal}>{v}</Text>
                </Card>
              ))}
            </View>
          </>
        )}

        <Text style={s.section}>Tripulacao acompanhada</Text>
        {ops.map((o) => (
          <Pressable key={o.id} onPress={() => navigation.navigate("OperadorDetail", { id: o.id })}>
            <Card style={s.opCard}>
              <Image source={o.foto} style={s.opImg} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.opNome}>{o.nome}</Text>
                <Text style={s.opUpd}>{o.especialidade}</Text>
                <Text style={s.opTime}>Atualizado {o.atualizado}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 8 }}>
                <HealthBadge status={o.saude} />
                <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 18 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 16 },
  hi: { color: colors.text, fontSize: 24, fontWeight: "300" },
  sub: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  statusDot: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusTxt: { fontSize: 11, fontWeight: "700" },
  week: { gap: 10, paddingVertical: 4 },
  day: { width: 50, height: 64, borderRadius: 16, backgroundColor: colors.card, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  dayOn: { backgroundColor: colors.pink, borderColor: colors.pink },
  dayD: { color: colors.textDim, fontSize: 12 },
  dayN: { color: colors.text, fontSize: 17, fontWeight: "700", marginTop: 4 },
  dayActiveTxt: { color: "#fff" },
  seg: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 999, padding: 4, marginTop: 18, alignSelf: "center" },
  segBtn: { paddingHorizontal: 26, paddingVertical: 9, borderRadius: 999 },
  segOn: { backgroundColor: colors.pink },
  segTxt: { color: colors.textDim, fontWeight: "600" },
  segTxtOn: { color: "#fff" },
  bigWrap: { alignItems: "center", marginTop: 18 },
  big: { color: colors.text, fontSize: 76, fontWeight: "200", letterSpacing: 2 },
  bigLabel: { color: colors.textDim, marginTop: -4 },
  stats: { flexDirection: "row", gap: 10, marginTop: 18 },
  stat: { flex: 1, paddingVertical: 14, alignItems: "center" },
  statLabel: { color: colors.textDim, fontSize: 12 },
  statVal: { color: colors.text, fontSize: 22, fontWeight: "700", marginTop: 6 },
  section: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: 26, marginBottom: 12 },
  charts: { flexDirection: "row", gap: 12 },
  chartTitle: { color: colors.textDim, fontSize: 13, marginBottom: 10, fontWeight: "600" },
  ringSub: { color: colors.textFaint, fontSize: 11, marginTop: 6 },
  legend: { marginTop: 12, gap: 6, alignSelf: "stretch" },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { color: colors.textDim, fontSize: 12 },
  macroStats: { flexDirection: "row", gap: 10, marginTop: 12 },
  opCard: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  opImg: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.cardSoft },
  opNome: { color: colors.text, fontSize: 16, fontWeight: "700" },
  opUpd: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  opTime: { color: colors.textFaint, fontSize: 11, marginTop: 3 },
});
