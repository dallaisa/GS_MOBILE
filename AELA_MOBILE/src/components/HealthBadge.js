import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const MAP = {
  boa: { c: colors.good, t: "Saude boa" },
  media: { c: colors.mid, t: "Saude media" },
  ruim: { c: colors.bad, t: "Saude critica" },
};
export default function HealthBadge({ status }) {
  const m = MAP[status] || MAP.media;
  return (
    <View style={[s.b, { backgroundColor: m.c + "22", borderColor: m.c }]}>
      <View style={[s.dot, { backgroundColor: m.c }]} />
      <Text style={[s.t, { color: m.c }]}>{m.t}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  b: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 7 },
  t: { fontSize: 13, fontWeight: "700" },
});
