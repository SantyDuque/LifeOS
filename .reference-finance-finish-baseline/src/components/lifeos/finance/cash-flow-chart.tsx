import { useId, useMemo } from "react";
import { format } from "date-fns";
import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FinanceRecord, Money } from "@/lib/finance/models";
import {
  getBalanceTrend,
  type BalancePoint,
  type BalanceRange,
} from "@/lib/finance/balance-trend";

function BalanceTooltip({
  active,
  payload,
  currencyCode,
}: {
  active?: boolean;
  payload?: Array<{ payload: BalancePoint }>;
  currencyCode: string;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  });
  return (
    <div className="min-w-36 rounded-md border border-border bg-popover p-3 text-xs text-popover-foreground shadow-md">
      <p className="mb-2 font-medium">
        {point.bucketStart !== point.date
          ? `${format(new Date(`${point.bucketStart}T00:00:00`), "MMM d")} – `
          : ""}
        {format(point.timestamp, "MMM d, yyyy")}
      </p>
      <div className="space-y-1.5">
        {(
          [
            ["Balance", point.balance],
            ["Income", point.income],
            ["Expenses", point.expenses],
            ["Net change", point.net],
          ] as const
        ).map(([label, value]) => (
          <p key={label} className="flex justify-between gap-5">
            <span className="text-muted-foreground">{label}</span>
            <span>{value === null ? "Unknown" : money.format(value)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function paddedBalanceDomain(data: BalancePoint[]): [number, number] {
  const values = data
    .map((point) => point.balance)
    .filter((value): value is number => value !== null && Number.isFinite(value));
  if (!values.length) return [-1, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min;
  const padding =
    spread > Math.max(1, Math.abs(max) * 0.001)
      ? spread * 0.08
      : Math.max(Math.abs(max) * 0.1, 1);
  return [min - padding, max + padding];
}

export function CashFlowChart({
  records,
  balance,
  range,
}: {
  records: FinanceRecord[];
  balance: Money | null;
  range: BalanceRange;
}) {
  const fillId = useId();
  const data = useMemo(
    () => getBalanceTrend(records, balance, range),
    [records, balance, range],
  );
  if (!data.length)
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {balance
          ? "Not enough transaction history to show a trend yet."
          : "A combined balance trend requires accounts in the same currency."}
      </p>
    );
  const currencyCode = balance!.currencyCode;
  const yDomain = paddedBalanceDomain(data);
  return (
    <div
      className="h-56 w-full min-w-0"
      role="group"
      aria-label="Cash balance over time"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ top: 8, right: 4, left: -12, bottom: 0 }}
          baseValue="dataMin"
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 5"
            strokeOpacity={0.7}
          />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickCount={5}
            ticks={[
              ...new Set(
                [0, 0.25, 0.5, 0.75, 1].map(
                  (fraction) =>
                    data[Math.round(fraction * (data.length - 1))]!.timestamp,
                ),
              ),
            ]}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            tickFormatter={(value: number) =>
              format(
                value,
                range === "Max" &&
                  data.at(-1)!.timestamp - data[0]!.timestamp > 366 * 86400000
                  ? "MMM yy"
                  : "MMM d",
              )
            }
          />
          <YAxis
            domain={yDomain}
            axisLine={false}
            tickLine={false}
            width={60}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            tickFormatter={(value: number) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currencyCode,
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(value)
            }
          />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            content={<BalanceTooltip currencyCode={currencyCode} />}
          />
          <Area
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="var(--primary)"
            strokeWidth={2}
            fill={`url(#${fillId})`}
            dot={data.length === 1 ? { r: 3 } : false}
            activeDot={{ r: 4, fill: "var(--primary)", stroke: "var(--card)" }}
            animationDuration={400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
