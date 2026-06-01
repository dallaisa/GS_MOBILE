import React from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";
import Gradient from "./Gradient";
import { colors, radius } from "../theme/colors";

export default function Button({ title, onPress, variant = "primary", style }) {
  if (variant === "primary") {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
        <Gradient h style={s.grad}>
          <Text style={s.txt}>{title}</Text>
        </Gradient>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.outline, { opacity: pressed ? 0.7 : 1 }, style]}>
      <Text style={[s.txt, { color: colors.pink }]}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  grad: { height: 54, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  outline: { height: 54, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: colors.pink },
  txt: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});
