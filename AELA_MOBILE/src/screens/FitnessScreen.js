import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "../components/Charts";
import Gradient from "../components/Gradient";
import { colors, radius } from "../theme/colors";
import { TREINOS, KANBAN_INICIAL } from "../data/mock";
import { loadKanban, saveKanban } from "../services/storage";

const COLS = [
  { key: "todo", label: "A fazer", c: colors.textDim },
  { key: "doing", label: "Em andamento", c: colors.orange },
  { key: "done", label: "Concluido", c: colors.good },
];

export default function FitnessScreen() {
  const [board, setBoard] = useState(KANBAN_INICIAL);

  useEffect(() => { loadKanban().then((b) => b && setBoard(b)); }, []);

  const avancar = (col, id) => {
    const order = ["todo", "doing", "done"];
    const idx = order.indexOf(col);
    if (idx >= order.length - 1) return;
    const next = order[idx + 1];
    const item = board[col].find((x) => x.id === id);
    const nb = { ...board, [col]: board[col].filter((x) => x.id !== id), [next]: [...board[next], item] };
    setBoard(nb); saveKanban(nb);
  };

  const total = COLS.reduce((a, c) => a + board[c.key].length, 0);
  const feitos = board.done.length;

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
        <Gradient style={s.hero}>
          <View style={{ flex: 1 }}>
            <Text style={s.heroTag}>FITNESS · TRIPULAÇÃO</Text>
            <Text style={s.h1}>Treino & Performance</Text>
            <Text style={s.sub}>Aulas e rotinas físicas dos astronautas</Text>
          </View>
          <View style={s.heroIcon}>
            <Ionicons name="barbell" size={26} color="#fff" />
          </View>
        </Gradient>

        <View style={s.dashRow}>
          <View style={[s.dash, { flex: 1 }]}>
            <Text style={s.dashLabel}>Aderencia da semana</Text>
            <Text style={s.dashVal}>{Math.round((feitos / Math.max(total, 1)) * 100)}%</Text>
            <BarChart data={[40, 55, 60, 72, 68, 80, 88]} height={70} />
          </View>
          <View style={[s.dash, { width: 130 }]}>
            <Text style={s.dashLabel}>Concluidos</Text>
            <Text style={s.dashVal}>{feitos}/{total}</Text>
            <Text style={s.dashFoot}>tarefas no kanban</Text>
          </View>
        </View>

        <Text style={s.h2}>Aulas disponiveis</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
          {TREINOS.map((t) => (
            <View key={t.id} style={s.treino}>
              <Image source={t.img} style={s.treinoImg} />
              <View style={s.treinoBody}>
                <Text style={s.treinoTit} numberOfLines={2}>{t.titulo}</Text>
                <View style={s.treinoMeta}>
                  <Ionicons name="time-outline" size={14} color={colors.textDim} />
                  <Text style={s.treinoMetaTxt}>{t.duracao}</Text>
                  <Ionicons name="flame-outline" size={14} color={colors.orange} style={{ marginLeft: 10 }} />
                  <Text style={s.treinoMetaTxt}>{t.kcal} kcal</Text>
                </View>
                <View style={s.nivel}><Text style={s.nivelTxt}>{t.nivel}</Text></View>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={s.h2}>Kanban da tripulacao</Text>
        <Text style={s.kanInfo}>Cada astronauta tem suas tarefas. O supervisor acompanha quem já fez os exercícios. Toque para avançar.</Text>
        {COLS.map((col) => (
          <View key={col.key} style={s.col}>
            <View style={s.colHead}>
              <View style={[s.colDot, { backgroundColor: col.c }]} />
              <Text style={s.colTitle}>{col.label}</Text>
              <Text style={s.colCount}>{board[col.key].length}</Text>
            </View>
            {board[col.key].length === 0 ? <Text style={s.empty}>Vazio</Text> : null}
            {board[col.key].map((item) => (
              <Pressable key={item.id} onPress={() => avancar(col.key, item.id)} style={s.kCard}>
                <View style={s.avatar}>
                  <Text style={s.avatarTxt}>{item.op.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.kTarefa}>{item.tarefa}</Text>
                  <Text style={s.kOp}>🧑‍🚀 {item.op}</Text>
                </View>
                <Ionicons
                  name={col.key === "done" ? "checkmark-circle" : "ellipse-outline"}
                  size={24} color={col.key === "done" ? colors.good : colors.textDim}
                />
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { flexDirection: "row", alignItems: "center", borderRadius: radius.xl, padding: 20, marginBottom: 20 },
  heroTag: { color: colors.pinkPastel, fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginBottom: 6 },
  heroIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  h1: { color: "#fff", fontSize: 24, fontWeight: "800" },
  sub: { color: "rgba(255,255,255,0.9)", marginTop: 4 },
  dashRow: { flexDirection: "row", gap: 12 },
  dash: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border },
  dashLabel: { color: colors.textDim, fontSize: 13, fontWeight: "600" },
  dashVal: { color: colors.text, fontSize: 30, fontWeight: "800", marginVertical: 6 },
  dashFoot: { color: colors.textDim, fontSize: 12 },
  h2: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: 24, marginBottom: 12 },
  treino: { width: 180, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  treinoImg: { width: "100%", height: 150, backgroundColor: colors.cardSoft },
  treinoBody: { padding: 12 },
  treinoTit: { color: colors.text, fontWeight: "700", fontSize: 15, minHeight: 40 },
  treinoMeta: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  treinoMetaTxt: { color: colors.textDim, fontSize: 12, marginLeft: 4 },
  nivel: { alignSelf: "flex-start", marginTop: 10, backgroundColor: "#3A2A18", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  nivelTxt: { color: colors.orange, fontSize: 11, fontWeight: "700" },
  kanInfo: { color: colors.textDim, fontSize: 13, marginBottom: 12 },
  col: { marginBottom: 16 },
  colHead: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  colDot: { width: 9, height: 9, borderRadius: 5, marginRight: 8 },
  colTitle: { color: colors.text, fontWeight: "700", flex: 1 },
  colCount: { color: colors.textDim, fontWeight: "700" },
  empty: { color: colors.textDim, fontStyle: "italic", marginLeft: 17, marginBottom: 6 },
  kCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.md, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  kTarefa: { color: colors.text, fontWeight: "700" },
  kOp: { color: colors.textDim, fontSize: 12, marginTop: 3 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.pink, alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarTxt: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
