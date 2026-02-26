import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { G, Circle, Path } from "react-native-svg";

type PieSlice = { label: string; value: number; color: string };

export default function AnalysisScreen() {
  const monthLabel = "Setembro 2023";

  const slices: PieSlice[] = useMemo(
    () => [
      { label: "Moradia (40%)", value: 40, color: "#1976ff" },
      { label: "Alimentação (25%)", value: 25, color: "#10b981" },
      { label: "Lazer (15%)", value: 15, color: "#f59e0b" },
      { label: "Outros (20%)", value: 20, color: "#d1d5db" },
    ],
    []
  );

  const months = ["ABR", "MAI", "JUN", "JUL", "AGO", "SET"];
  const trend = [1200, 1350, 2100, 1650, 2600, 2300];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "900",
            color: "#111827",
            textAlign: "center",
          }}
        >
          Análise Mensal
        </Text>

        <View style={{ alignItems: "center", marginTop: 10 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ color: "#1976ff", fontWeight: "700", fontSize: 12 }}>
              {monthLabel}
            </Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color="#1976ff"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>

        {/* ECONOMIA */}
        <View style={cardStyle}>
          <Text style={titleSmall}>VALOR ECONOMIZADO</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text
              style={{
                fontSize: 34,
                fontWeight: "900",
                color: "#111827",
                marginTop: 8,
              }}
            >
              R$ 1.250,00
            </Text>

            <View
              style={{
                backgroundColor: "#d1fae5",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "#059669", fontWeight: "800", fontSize: 12 }}>
                ↗ +12%
              </Text>
            </View>
          </View>

          <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
            vs mês passado
          </Text>
        </View>

        {/* DONUT */}
        <View style={cardStyle}>
          <Text style={titleSmall}>DISTRIBUIÇÃO DE GASTOS</Text>

          <View style={{ alignItems: "center", marginTop: 14 }}>
            <DonutChart
              size={180}
              strokeWidth={18}
              slices={slices}
              centerTop="TOTAL"
              centerMain="R$ 4.820"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 18,
              rowGap: 10,
            }}
          >
            {slices.map((s) => (
              <Legend key={s.label} color={s.color} label={s.label} />
            ))}
          </View>
        </View>

        {/* TENDÊNCIA (RESPONSIVA) */}
        <View style={cardStyle}>
          <Text style={titleSmall}>TENDÊNCIA DE GASTOS (6 MESES)</Text>

          <View
            style={{
              marginTop: 14,
              borderRadius: 14,
              backgroundColor: "#f9fafb",
              padding: 12,
            }}
          >
            <ResponsiveLineChart data={trend} height={140} />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              paddingHorizontal: 4,
            }}
          >
            {months.map((m) => (
              <Text key={m} style={{ fontSize: 11, color: "#9ca3af" }}>
                {m}
              </Text>
            ))}
          </View>
        </View>

        {/* DESTAQUES */}
        <View style={cardStyle}>
          <Text style={titleSmall}>DESTAQUES DO MÊS</Text>

          <Highlight
            icon="restaurant"
            color="#1976ff"
            title="Alimentação reduzida"
            subtitle="Você gastou R$ 240 a menos que em Agosto."
          />

          <Highlight
            icon="warning"
            color="#f59e0b"
            title="Alerta de Lazer"
            subtitle="Atingiu 95% do orçamento para esta categoria."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------ COMPONENTES ------------------ */

function DonutChart({
  size,
  strokeWidth,
  slices,
  centerTop,
  centerMain,
}: {
  size: number;
  strokeWidth: number;
  slices: PieSlice[];
  centerTop: string;
  centerMain: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const total = slices.reduce((acc, s) => acc + s.value, 0);

  let currentAngle = -90;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G>
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke="#eef2f7"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {slices.map((s, idx) => {
            const sweep = (s.value / total) * 360;
            const path = describeArc(cx, cy, radius, currentAngle, currentAngle + sweep);
            currentAngle += sweep;

            return (
              <Path
                key={idx}
                d={path}
                stroke={s.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
              />
            );
          })}
        </G>
      </Svg>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#9ca3af", fontSize: 11, fontWeight: "700" }}>
          {centerTop}
        </Text>
        <Text style={{ color: "#111827", fontSize: 26, fontWeight: "900", marginTop: 2 }}>
          {centerMain}
        </Text>
      </View>
    </View>
  );
}

/**
 * ✅ LINE CHART RESPONSIVO:
 * - mede a largura do container via onLayout
 * - desenha o SVG com width = containerWidth
 */
function ResponsiveLineChart({ data, height }: { data: number[]; height: number }) {
  const [width, setWidth] = useState(0);

  return (
    <View
      onLayout={(e) => {
        const w = Math.floor(e.nativeEvent.layout.width);
        if (w !== width) setWidth(w);
      }}
      style={{ width: "100%" }}
    >
      {width > 0 ? <LineChart data={data} width={width} height={height} /> : null}
    </View>
  );
}

function LineChart({
  data,
  width,
  height,
}: {
  data: number[];
  width: number;
  height: number;
}) {
  const paddingX = 10;
  const paddingY = 10;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);

  const stepX = (width - paddingX * 2) / Math.max(1, data.length - 1);

  const points = data.map((v, i) => {
    const x = paddingX + i * stepX;
    const y = paddingY + (height - paddingY * 2) * (1 - (v - min) / range);
    return { x, y };
  });

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  return (
    <Svg width={width} height={height}>
      {/* linha */}
      <Path d={d} stroke="#1976ff" strokeWidth={3} fill="none" strokeLinecap="round" />

      {/* bolinhas */}
      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={4} fill="#1976ff" />
      ))}
    </Svg>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontSize: 12, color: "#374151" }}>{label}</Text>
    </View>
  );
}

function Highlight({
  icon,
  color,
  title,
  subtitle,
}: {
  icon: any;
  color: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          backgroundColor: `${color}1A`,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "800", color: "#111827", fontSize: 13 }}>
          {title}
        </Text>
        <Text style={{ color: "#6b7280", fontSize: 12 }}>{subtitle}</Text>
      </View>
    </View>
  );
}

/* ------------------ UTILS SVG ARC ------------------ */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

/* ------------------ STYLES ------------------ */

const cardStyle = {
  marginTop: 14,
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 14,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 2,
};

const titleSmall = {
  fontSize: 12,
  fontWeight: "800" as const,
  color: "#64748b",
  letterSpacing: 0.6,
};