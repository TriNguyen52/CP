import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle } from "react-native-svg";

import { NavigationHeader } from "../../components/common/NavigationHeader";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { useAppData } from "../../state/AppDataContext";
import { colors, radius, spacing, typography } from "../../theme/tokens";

type TimeFilter = "week" | "month" | "year";

type ExpensePoint = {
  amount: number;
  date: Date;
};

type ChartSeries = {
  labels: string[];
  values: number[];
};

const CHART_SIZE = 210;
const CHART_STROKE = 28;
const CHART_RADIUS = (CHART_SIZE - CHART_STROKE) / 2;
const CHART_CIRCUMFERENCE = 2 * Math.PI * CHART_RADIUS;

const categoryConfig = [
  {
    key: "Food",
    color: "#2ECC71",
    keywords: ["food", "grocery", "groceries", "dining", "restaurant", "meal"],
  },
  {
    key: "Shopping",
    color: "#3498DB",
    keywords: ["shopping", "shop", "retail", "clothing"],
  },
  {
    key: "Transportation",
    color: "#F39C12",
    keywords: ["transport", "transportation", "travel", "fuel", "gas", "uber", "taxi"],
  },
  {
    key: "Entertainment",
    color: "#E74C3C",
    keywords: ["entertainment", "movie", "music", "games", "fun", "other"],
  },
] as const;

type DashboardCategoryKey = (typeof categoryConfig)[number]["key"];

const timeFilters: Array<{ key: TimeFilter; label: string }> = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

const startOfDay = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const addDays = (date: Date, offset: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
};

const sumExpenseAmounts = (expenses: ExpensePoint[], start: Date, end: Date): number =>
  expenses.reduce((sum, expense) => {
    if (expense.date >= start && expense.date < end) {
      return sum + expense.amount;
    }

    return sum;
  }, 0);

const buildWeekSeries = (expenses: ExpensePoint[]): ChartSeries => {
  const today = startOfDay(new Date());
  const labels: string[] = [];
  const values: number[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const dayStart = addDays(today, -offset);
    const dayEnd = addDays(dayStart, 1);

    labels.push(dayStart.toLocaleDateString(undefined, { weekday: "short" }));
    values.push(sumExpenseAmounts(expenses, dayStart, dayEnd));
  }

  return { labels, values };
};

const buildMonthSeries = (expenses: ExpensePoint[]): ChartSeries => {
  const today = startOfDay(new Date());
  const firstDay = addDays(today, -29);
  const labels: string[] = [];
  const values: number[] = [];

  for (let weekIndex = 0; weekIndex < 5; weekIndex += 1) {
    const weekStart = addDays(firstDay, weekIndex * 7);
    const weekEnd = weekIndex === 4 ? addDays(today, 1) : addDays(firstDay, (weekIndex + 1) * 7);

    labels.push(`W${weekIndex + 1}`);
    values.push(sumExpenseAmounts(expenses, weekStart, weekEnd));
  }

  return { labels, values };
};

const buildYearSeries = (expenses: ExpensePoint[]): ChartSeries => {
  const now = new Date();
  const labels: string[] = [];
  const values: number[] = [];

  for (let monthOffset = 11; monthOffset >= 0; monthOffset -= 1) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 1);

    labels.push(monthStart.toLocaleDateString(undefined, { month: "short" }));
    values.push(sumExpenseAmounts(expenses, monthStart, monthEnd));
  }

  return { labels, values };
};

const mapToDashboardCategory = (category?: string, description?: string): DashboardCategoryKey => {
  const normalized = `${category ?? ""} ${description ?? ""}`.toLowerCase();

  for (const entry of categoryConfig) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry.key;
    }
  }

  return "Entertainment";
};

export function DashboardScreen() {
  const { groups } = useAppData();
  const { width } = useWindowDimensions();
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>("week");

  const categoryAnalytics = useMemo(() => {
    const totals: Record<DashboardCategoryKey, number> = {
      Food: 0,
      Shopping: 0,
      Transportation: 0,
      Entertainment: 0,
    };

    groups.forEach((group) => {
      group.expenses.forEach((expense) => {
        const mappedCategory = mapToDashboardCategory(expense.category, expense.description);
        totals[mappedCategory] += expense.amount;
      });
    });

    const totalAmount = Object.values(totals).reduce((sum, value) => sum + value, 0);

    return categoryConfig.map((entry) => {
      const amount = totals[entry.key];
      const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;

      return {
        key: entry.key,
        color: entry.color,
        amount,
        percentage,
      };
    });
  }, [groups]);

  const pieSegments = useMemo(() => {
    let cumulativeArcLength = 0;

    return categoryAnalytics
      .map((entry) => {
        const arcLength = (entry.percentage / 100) * CHART_CIRCUMFERENCE;
        const segment = {
          ...entry,
          arcLength,
          arcOffset: cumulativeArcLength,
        };

        cumulativeArcLength += arcLength;
        return segment;
      })
      .filter((entry) => entry.arcLength > 0);
  }, [categoryAnalytics]);

  const totalAmount = categoryAnalytics.reduce((sum, entry) => sum + entry.amount, 0);
  const chartWidth = Math.max(260, width - spacing.md * 4);

  const expensePoints = useMemo<ExpensePoint[]>(() => {
    return groups.flatMap((group) =>
      group.expenses
        .map((expense) => ({ amount: expense.amount, date: new Date(expense.date) }))
        .filter((point) => !Number.isNaN(point.date.getTime()))
    );
  }, [groups]);

  const timeSeries = useMemo<ChartSeries>(() => {
    if (selectedFilter === "week") {
      return buildWeekSeries(expensePoints);
    }

    if (selectedFilter === "month") {
      return buildMonthSeries(expensePoints);
    }

    return buildYearSeries(expensePoints);
  }, [expensePoints, selectedFilter]);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <NavigationHeader title="Spending Analytics" />

      <Text style={styles.subtitle}>Spending Categories</Text>

      <View style={styles.chartCard}>
        <View style={styles.chartWrap}>
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            <Circle
              stroke={colors.border}
              fill="none"
              cx={CHART_SIZE / 2}
              cy={CHART_SIZE / 2}
              r={CHART_RADIUS}
              strokeWidth={CHART_STROKE}
            />
            {pieSegments.map((segment) => (
              <Circle
                key={segment.key}
                stroke={segment.color}
                fill="none"
                cx={CHART_SIZE / 2}
                cy={CHART_SIZE / 2}
                r={CHART_RADIUS}
                strokeWidth={CHART_STROKE}
                strokeDasharray={`${segment.arcLength} ${CHART_CIRCUMFERENCE - segment.arcLength}`}
                strokeDashoffset={-segment.arcOffset}
                transform={`rotate(-90 ${CHART_SIZE / 2} ${CHART_SIZE / 2})`}
              />
            ))}
          </Svg>

          <View style={styles.chartCenter}>
            <Text style={styles.totalAmount}>${totalAmount.toFixed(0)}</Text>
            <Text style={styles.totalLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.legendWrap}>
          {categoryAnalytics.map((entry) => (
            <View key={entry.key} style={styles.legendRow}>
              <View style={styles.legendTitleWrap}>
                <View style={[styles.legendSwatch, { backgroundColor: entry.color }]} />
                <Text style={styles.legendLabel}>{entry.key}</Text>
              </View>
              <Text style={styles.legendValue}>{entry.percentage.toFixed(1)}%</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.subtitle}>Spending Over Time</Text>

      <View style={styles.filterRow}>
        {timeFilters.map((filter) => {
          const selected = filter.key === selectedFilter;

          return (
            <Pressable
              key={filter.key}
              style={[styles.filterButton, selected && styles.filterButtonActive]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text style={[styles.filterButtonText, selected && styles.filterButtonTextActive]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.timeChartCard}>
        <LineChart
          data={{
            labels: timeSeries.labels,
            datasets: [{ data: timeSeries.values.map((value) => Number(value.toFixed(2))) }],
          }}
          width={chartWidth}
          height={220}
          fromZero
          bezier
          withVerticalLines
          withHorizontalLines
          yLabelsOffset={8}
          chartConfig={{
            backgroundColor: "#000000",
            backgroundGradientFrom: "#000000",
            backgroundGradientTo: "#000000",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59,130,246,${opacity})`,
            labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#3B82F6",
              fill: "#3B82F6",
            },
            propsForBackgroundLines: {
              stroke: "rgba(255,255,255,0.12)",
            },
          }}
          style={styles.lineChart}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: 116,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  chartCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: 16,
    zIndex: 10,
  },
  chartWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  totalAmount: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 26,
  },
  totalLabel: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  legendWrap: {
    gap: spacing.xs,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 30,
  },
  legendTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  legendValue: {
    color: colors.textSecondary,
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  filterButton: {
    minHeight: 34,
    minWidth: 72,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  filterButtonActive: {
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(59,130,246,0.16)",
  },
  filterButtonText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  filterButtonTextActive: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
  },
  timeChartCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#1F1F1F",
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
    paddingLeft: spacing.xs,
    marginBottom: 16,
  },
  lineChart: {
    borderRadius: radius.md,
  },
});
