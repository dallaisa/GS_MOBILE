import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, radius } from "../theme/colors";

export default function Card({ children, style, frost }) {
  return <View style={[s.card, frost && s.frost, style]}>{children}</View>;
}
const s = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border },
  frost: { backgroundColor: colors.frostCard, borderColor: "#E7E2DA" },
});
