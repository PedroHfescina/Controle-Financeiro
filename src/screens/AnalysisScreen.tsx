import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { G, Circle, Path, Line } from "react-native-svg";
import { useFinance, CategoryName } from "../context/FinanceContext";

type PieSlice = {
  label: string;
  rawLabel: string;
  value: number;
  color: string;
  percentage: number;
};

type ExpenseLike = {
  id?: string;
  title?: string;
  category?: string;
  value?: number | string;
  note?: string;
  createdAt?: any;
};

function formatBRL(value: number) {
  const safeValue = Number(value) || 0;

  try {
    return safeValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  } catch {
    return `R$ ${safeValue.toFixed(2)}`.replace(".", ",");
  }
}

function getDateFromInput(input: any): Date | null {
  if (!input) return null;

  if (typeof input === "object" && typeof input.toDate === "function") {
    const d = input.toDate();
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
  }

  if (input instanceof Date) {
    return !Number.isNaN(input.getTime()) ? input : null;
  }

  if (typeof input === "string" || typeof input === "number") {
    const d = new Date(input);
    return !Number.isNaN(d.getTime()) ? d : null;
  }

  return null;
}

function normalizeCategoryName(value?: string): CategoryName {
  if (!value) return "Outros";

  const normalized = value.trim().toLowerCase();

  const map: Record<string, CategoryName> = {
    mercado: "Mercado",
    transporte: "Transporte",
    lazer: "Lazer",
    alimentação: "Alimentação",
    alimentacao: "Alimentação",
    casa: "Casa",
    combustível: "Combustível",
    combustivel: "Combustível",
    assinaturas: "Assinaturas",
    outros: "Outros",
  };

  return map[normalized] ?? "Outros";
}

function getCategoryColor(name: CategoryName) {
  const map: Record<CategoryName, string> = {
    Mercado: "#2563eb",
    Transporte: "#0ea5e9",
    Lazer: "#f59e0b",
    Alimentação: "#10b981",
    Casa: "#7c3aed",
    Combustível: "#ef4444",
    Assinaturas: "#64748b",
    Outros: "#d1d5db",
  };

  return map[name];
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function isSameMonth(date: Date, month: number, year: number) {
  return date.getMonth() === month && date.getFullYear() === year;
}

function getMonthShortLabel(date: Date) {
  return date
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
}

export default function AnalysisScreen() {
  const { income, savingsGoal, expenses, categories } = useFinance();
  const [selectedMonthOffset, setSelectedMonthOffset] = useState(0);

  const now = new Date();
  const selectedDate = useMemo(() => {
    const d = new Date(now.getFullYear(), now.getMonth() - selectedMonthOffset, 1);
    return d;
  }, [now, selectedMonthOffset]);

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const monthLabel = useMemo(() => getMonthLabel(selectedDate), [selectedDate]);

  const normalizedExpenses = useMemo(() => {
    return (expenses ?? [])
      .map((expense: ExpenseLike) => {
        const createdAt = getDateFromInput(expense.createdAt);
        if (!createdAt) return null;

        return {
          ...expense,
          category: normalizeCategoryName(expense.category),
          value: Number(expense.value) || 0,
          createdAtDate: createdAt,
        };
      })
      .filter(Boolean) as Array<{
      id?: string;
      title?: string;
      category: CategoryName;
      value: number;
      note?: string;
      createdAtDate: Date;
    }>;
  }, [expenses]);

  const monthExpenses = useMemo(() => {
    return normalizedExpenses.filter((expense) =>
      isSameMonth(expense.createdAtDate, selectedMonth, selectedYear)
    );
  }, [normalizedExpenses, selectedMonth, selectedYear]);

  const previousMonthDate = useMemo(() => {
    return new Date(selectedYear, selectedMonth - 1, 1);
  }, [selectedMonth, selectedYear]);

  const previousMonthExpenses = useMemo(() => {
    return normalizedExpenses.filter((expense) =>
      isSameMonth(
        expense.createdAtDate,
        previousMonthDate.getMonth(),
        previousMonthDate.getFullYear()
      )
    );
  }, [normalizedExpenses, previousMonthDate]);

  const totalSpent = useMemo(() => {
    return monthExpenses.reduce((acc, expense) => acc + expense.value, 0);
  }, [monthExpenses]);

  const previousMonthSpent = useMemo(() => {
    return previousMonthExpenses.reduce((acc, expense) => acc + expense.value, 0);
  }, [previousMonthExpenses]);

  const savedValue = useMemo(() => {
    const available = Math.max(0, Number(income) - Number(savingsGoal));
    const remaining = available - totalSpent;
    return remaining > 0 ? remaining : 0;
  }, [income, savingsGoal, totalSpent]);

  const savingsDiffPercentage = useMemo(() => {
    const current = savedValue;
    const previousAvailable = Math.max(0, Number(income) - Number(savingsGoal));
    const previousRemaining = previousAvailable - previousMonthSpent;
    const previousSaved = previousRemaining > 0 ? previousRemaining : 0;

    if (previousSaved <= 0) {
      return current > 0 ? 100 : 0;
    }

    return ((current - previousSaved) / previousSaved) * 100;
  }, [income, savingsGoal, previousMonthSpent, savedValue]);

  const pieSlices = useMemo<PieSlice[]>(() => {
    const totalsByCategory = monthExpenses.reduce((acc, expense) => {
      const category = expense.category;
      acc[category] = (acc[category] || 0) + expense.value;
      return acc;
    }, {} as Record<CategoryName, number>);

    const total = Object.values(totalsByCategory).reduce((acc, value) => acc + value, 0);

    if (total <= 0) {
      return [
        {
          label: "Sem gastos",
          rawLabel: "Sem gastos",
          value: 1,
          color: "#d1d5db",
          percentage: 0,
        },
      ];
    }

    return Object.entries(totalsByCategory)
      .map(([category, value]) => {
        const percentage = (value / total) * 100;
        return {
          rawLabel: category,
          label: `${category} (${Math.round(percentage)}%)`,
          value,
          color: getCategoryColor(category as CategoryName),
          percentage,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthExpenses]);

  const trendData = useMemo(() => {
    const points = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const total = normalizedExpenses
        .filter((expense) =>
          isSameMonth(expense.createdAtDate, d.getMonth(), d.getFullYear())
        )
        .reduce((acc, expense) => acc + expense.value, 0);

      points.push({
        label: getMonthShortLabel(d),
        value: total,
      });
    }

    return points;
  }, [normalizedExpenses, now]);

  const topCategory = useMemo(() => {
    if (!categories?.length) return null;

    const sorted = [...categories].sort((a, b) => b.spent - a.spent);
    return sorted[0] ?? null;
  }, [categories]);

  const budgetAlertCategory = useMemo(() => {
    const critical = categories.find((item) => item.status === "danger");
    if (critical) return critical;

    const warning = categories.find((item) => item.status === "warning");
    return warning ?? null;
  }, [categories]);

  const canGoPrevMonth = selectedMonthOffset < 11;
  const canGoNextMonth = selectedMonthOffset > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
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

        <View
          style={{
            alignItems: "center",
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => canGoPrevMonth && setSelectedMonthOffset((prev) => prev + 1)}
            disabled={!canGoPrevMonth}
            activeOpacity={0.85}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              opacity: canGoPrevMonth ? 1 : 0.45,
              marginRight: 10,
            }}
          >
            <Ionicons name="chevron-back" size={18} color="#1976ff" />
          </TouchableOpacity>

          <View
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
            <Text
              style={{
                color: "#1976ff",
                fontWeight: "700",
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              {monthLabel}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => canGoNextMonth && setSelectedMonthOffset((prev) => prev - 1)}
            disabled={!canGoNextMonth}
            activeOpacity={0.85}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              opacity: canGoNextMonth ? 1 : 0.45,
              marginLeft: 10,
            }}
          >
            <Ionicons name="chevron-forward" size={18} color="#1976ff" />
          </TouchableOpacity>
        </View>

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
              {formatBRL(savedValue)}
            </Text>

            <View
              style={{
                backgroundColor: savingsDiffPercentage >= 0 ? "#d1fae5" : "#fee2e2",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  color: savingsDiffPercentage >= 0 ? "#059669" : "#dc2626",
                  fontWeight: "800",
                  fontSize: 12,
                }}
              >
                {savingsDiffPercentage >= 0 ? "↗" : "↘"}{" "}
                {Math.abs(Math.round(savingsDiffPercentage))}%
              </Text>
            </View>
          </View>

          <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
            vs mês anterior
          </Text>

          <View
            style={{
              marginTop: 12,
              backgroundColor: "#f8fafc",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <Text style={{ color: "#475569", fontSize: 12 }}>
              Renda do mês: <Text style={{ fontWeight: "800" }}>{formatBRL(Number(income) || 0)}</Text>
            </Text>
            <Text style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>
              Meta de economia:{" "}
              <Text style={{ fontWeight: "800" }}>{formatBRL(Number(savingsGoal) || 0)}</Text>
            </Text>
          </View>
        </View>

        <View style={cardStyle}>
          <Text style={titleSmall}>DISTRIBUIÇÃO DE GASTOS</Text>

          <View style={{ alignItems: "center", marginTop: 14 }}>
            <DonutChart
              size={180}
              strokeWidth={18}
              slices={pieSlices}
              centerTop="TOTAL"
              centerMain={formatBRL(totalSpent)}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 18,
            }}
          >
            {pieSlices.map((slice, index) => (
              <View
                key={`${slice.rawLabel}-${index}`}
                style={{ width: "48%", marginBottom: 10 }}
              >
                <Legend color={slice.color} label={slice.label} />
              </View>
            ))}
          </View>
        </View>

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
            <ResponsiveLineChart
              data={trendData.map((item) => item.value)}
              height={160}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              paddingHorizontal: 4,
            }}
          >
            {trendData.map((item) => (
              <Text key={item.label} style={{ fontSize: 11, color: "#9ca3af" }}>
                {item.label}
              </Text>
            ))}
          </View>
        </View>

        <View style={cardStyle}>
          <Text style={titleSmall}>DESTAQUES DO MÊS</Text>

          {topCategory ? (
            <Highlight
              icon="pie-chart-outline"
              color={getCategoryColor(topCategory.name)}
              title={`Maior categoria: ${topCategory.name}`}
              subtitle={`Você gastou ${formatBRL(topCategory.spent)} nessa categoria.`}
            />
          ) : (
            <Highlight
              icon="information-circle-outline"
              color="#1976ff"
              title="Ainda sem dados suficientes"
              subtitle="Adicione gastos para começar a ver destaques do mês."
            />
          )}

          {budgetAlertCategory ? (
            <Highlight
              icon={budgetAlertCategory.status === "danger" ? "warning" : "alert-circle-outline"}
              color={
                budgetAlertCategory.status === "danger"
                  ? "#ef4444"
                  : budgetAlertCategory.status === "warning"
                  ? "#f59e0b"
                  : "#1976ff"
              }
              title={`Categoria em atenção: ${budgetAlertCategory.name}`}
              subtitle={
                budgetAlertCategory.hasLimit
                  ? `Uso atual de ${Math.round(budgetAlertCategory.progress)}% do limite mensal.`
                  : "Essa categoria ainda não possui limite definido."
              }
            />
          ) : (
            <Highlight
              icon="checkmark-circle-outline"
              color="#10b981"
              title="Orçamento sob controle"
              subtitle="Nenhuma categoria está em estado de alerta no momento."
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  const total = slices.reduce((acc, slice) => acc + slice.value, 0);

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

          {slices.map((slice, index) => {
            const sweep = total > 0 ? (slice.value / total) * 360 : 0;
            const path = describeArc(cx, cy, radius, currentAngle, currentAngle + sweep);
            currentAngle += sweep;

            return (
              <Path
                key={index}
                d={path}
                stroke={slice.color}
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
        <Text
          style={{
            color: "#111827",
            fontSize: 24,
            fontWeight: "900",
            marginTop: 2,
          }}
        >
          {centerMain}
        </Text>
      </View>
    </View>
  );
}

function ResponsiveLineChart({
  data,
  height,
}: {
  data: number[];
  height: number;
}) {
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
  const paddingY = 14;

  const min = Math.min(...data, 0);
  const max = Math.max(...data, 1);
  const range = Math.max(1, max - min);

  const stepX = (width - paddingX * 2) / Math.max(1, data.length - 1);

  const points = data.map((value, index) => {
    const x = paddingX + index * stepX;
    const y =
      paddingY + (height - paddingY * 2) * (1 - (value - min) / range);

    return { x, y };
  });

  const d = points
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(" ");

  const gridLines = 4;

  return (
    <Svg width={width} height={height}>
      {Array.from({ length: gridLines }).map((_, index) => {
        const y = paddingY + ((height - paddingY * 2) / (gridLines - 1)) * index;

        return (
          <Line
            key={index}
            x1={paddingX}
            y1={y}
            x2={width - paddingX}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        );
      })}

      <Path
        d={d}
        stroke="#1976ff"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />

      {points.map((point, index) => (
        <Circle key={index} cx={point.x} cy={point.y} r={4} fill="#1976ff" />
      ))}
    </Svg>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
          marginRight: 6,
        }}
      />
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
  icon: keyof typeof Ionicons.glyphMap;
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

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
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