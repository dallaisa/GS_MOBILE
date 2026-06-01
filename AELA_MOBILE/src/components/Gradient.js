import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "../theme/colors";

export default function Gradient({ colors, style, children, h = false }) {
  return (
    <LinearGradient
      colors={colors || gradients.brand}
      start={{ x: 0, y: 0 }}
      end={h ? { x: 1, y: 0 } : { x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
