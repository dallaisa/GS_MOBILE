import React from "react";
import { View, Text } from "react-native";
import Svg, { Rect, Polyline, Circle, Defs, LinearGradient as SvgGrad, Stop, Path } from "react-native-svg";
import { colors } from "../theme/colors";

// Grafico de barras
export function BarChart({ data = [], height = 110, dark = true }) {
  const max = Math.max(...data, 1);
  const w = 300, gap = 8, bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`}>
      <Defs>
        <SvgGrad id="bg" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#FF1E6F" />
          <Stop offset="1" stopColor="#FF8A1E" />
        </SvgGrad>
      </Defs>
      {data.map((v, i) => {
        const h = (v / max) * (height - 14);
        return (
          <Rect key={i} x={i * (bw + gap)} y={height - h} width={bw} height={h} rx={5} fill="url(#bg)" />
        );
      })}
    </Svg>
  );
}

// Grafico de linha
export function LineChart({ data = [], height = 120, color = colors.pink }) {
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const w = 300, range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${height - 10 - ((v - min) / range) * (height - 20)}`)
    .join(" ");
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`}>
      <Polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <Circle key={i} cx={(i / (data.length - 1)) * w} cy={height - 10 - ((v - min) / range) * (height - 20)} r="4" fill={color} />
      ))}
    </Svg>
  );
}

// Anel de progresso
export function Ring({ value = 0, size = 84, label, color = colors.pink, track = "#2C2C3A" }) {
  const r = size / 2 - 7, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth="7" fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="7" fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: "absolute", top: 0, bottom: 0, justifyContent: "center" }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800", textAlign: "center" }}>{Math.round(value)}</Text>
      </View>
    </View>
  );
}

// Grafico de rosca (macros / nutricao)
export function DonutChart({ data = [], size = 120, track = "#2C2C3A" }) {
  const total = data.reduce((a, b) => a + (b.value || 0), 0) || 1;
  const r = size / 2 - 9, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth="9" fill="none" />
      {data.map((seg, i) => {
        const frac = (seg.value || 0) / total;
        const dash = `${frac * c} ${c}`;
        const off = -acc * c;
        acc += frac;
        return (
          <Circle
            key={i}
            cx={size / 2} cy={size / 2} r={r} stroke={seg.color} strokeWidth="9" fill="none"
            strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
      })}
    </Svg>
  );
}

// Barras agrupadas (duas series)
export function GroupedBar({ a = [], b = [], height = 120, colorA = colors.pink, colorB = colors.orange }) {
  const max = Math.max(...a, ...b, 1);
  const w = 300, groups = a.length, gGap = 14;
  const gw = (w - gGap * (groups - 1)) / groups, bw = (gw - 4) / 2;
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`}>
      {a.map((v, i) => {
        const x = i * (gw + gGap);
        const ha = (v / max) * (height - 14);
        const hb = (b[i] / max) * (height - 14);
        return (
          <React.Fragment key={i}>
            <Rect x={x} y={height - ha} width={bw} height={ha} rx={4} fill={colorA} />
            <Rect x={x + bw + 4} y={height - hb} width={bw} height={hb} rx={4} fill={colorB} />
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
