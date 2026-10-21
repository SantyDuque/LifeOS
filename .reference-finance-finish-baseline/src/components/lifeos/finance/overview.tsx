import {
  ArrowRight,
  CalendarClock,
  ChartNoAxesCombined,
  Landmark,
  Plus,
  Receipt,
  Tags,
  Target,
  WalletCards,
} from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { DesktopFinanceOverview } from "./overview-desktop";
import {
  BALANCE_RANGES,
  availableBalanceRanges,
  financeRangeSelection,
  resolveBalanceRange,
  type BalanceRange,
} from "@/lib/finance/balance-trend";
import { Link } from "@tanstack/react-router";
import { EmptyState, Panel, PanelHeader } from "@/components/lifeos/states";
import { MetricGrid, MetricAction } from "@/components/lifeos/metric-grid";
import { Stat } from "@/components/lifeos/stat";
import { Button } from "@/components/ui/button";
import type { FinanceSnapshot } from "@/lib/finance/models";
import {
  accountBalance,
  expenseTotal,
  formatMoney,
  incomeTotal,
  spendingByCategory,
  sumMoney,
} from "@/lib/finance/selectors";
import {
  AccountIcon,
  BudgetProgress,
  CategoryIcon,
  MoneyText,
  categoryOf,
  moneyValueClass,
} from "./shared";
import { CashFlowChart } from "./cash-flow-chart";
import { FinanceSelect } from "./finance-select";
import { cn } from "@/lib/utils";
import { getDataSource } from "@/lib/api";

function LegacyFinanceOverview({
  data,
  period,
  onPeriodChange,
  onCategory,
  onTransactions,
  onAdd,
}: {
  data: FinanceSnapshot;
  period: BalanceRange;
  onPeriodChange: (period: BalanceRange) => void;
  onCategory: (id: string) => void;
  onTransactions: () => void;
  onAdd: () => void;
}) {
  const rangeAvailability = availableBalanceRanges(data.records);
  const effectivePeriod = resolveBalanceRange(data.records, period);
  useEffect(() => {
    if (data.records.length && effectivePeriod !== period)
      onPeriodChange(effectivePeriod);
  }, [data.records.length, effectivePeriod, onPeriodChange, period]);
  const { records } = financeRangeSelection(data.records, effectivePeriod);
  const periodLabel = effectivePeriod;
  const income = incomeTotal(records);
  const expenses = expenseTotal(records);
  const net = income - expenses;
  const currency = data.accounts[0]?.balance.currencyCode ?? "USD";
  const balance = accountBalance(data.accounts);
  const hasAccounts = data.accounts.length > 0;
  const hasRecords = data.records.length > 0;
  const mixedCurrencies =
    getDataSource() === "api" &&
    new Set(data.records.map((record) => record.amount.currencyCode)).size > 1;
  const spending = spendingByCategory(records);
  const top = spending[0];
  const largest = records
    .filter((record) => record.recordType === "expense")
    .sort((a, b) => Math.abs(b.amount.value) - Math.abs(a.amount.value))[0];
  const bestBudget = [...data.budgets].sort(
    (a, b) => a.spent.value / a.limit.value - b.spent.value / b.limit.value,
  )[0];
  const upcoming = [...data.standingOrders].sort((a, b) =>
    a.nextDate.localeCompare(b.nextDate),
  )[0];
  return (
    <div className="space-y-6">
      <div className="relative">
        <MetricGrid
          action={<MetricAction label="Add transaction" onClick={onAdd} />}
        >
          <Stat
            label="Total balance"
            value={
              hasAccounts
                ? balance
                  ? formatMoney(balance)
                  : "Multiple currencies"
                : "—"
            }
            hint={
              hasAccounts
                ? `Across ${data.accounts.length} accounts`
                : "No accounts connected yet"
            }
            valueClassName={
              balance ? moneyValueClass(balance.value) : undefined
            }
          />
          <Stat
            label="Income"
            value={
              hasAccounts && hasRecords && !mixedCurrencies
                ? formatMoney({ value: income, currencyCode: currency })
                : "—"
            }
            hint={
              mixedCurrencies
                ? "Multiple currencies; no FX conversion"
                : hasAccounts && hasRecords
                  ? periodLabel
                  : "No transactions yet"
            }
            valueClassName="text-success"
          />
          <Stat
            label="Expenses"
            value={
              hasAccounts && hasRecords && !mixedCurrencies
                ? formatMoney({ value: expenses, currencyCode: currency })
                : "—"
            }
            hint={
              mixedCurrencies
                ? "Multiple currencies; no FX conversion"
                : hasAccounts && hasRecords
                  ? effectivePeriod
                  : "No transactions yet"
            }
          />
          <Stat
            label="Net cash flow"
            value={
              hasAccounts && hasRecords && !mixedCurrencies
                ? formatMoney({ value: net, currencyCode: currency }, true)
                : "—"
            }
            hint={
              mixedCurrencies
                ? "Multiple currencies; no FX conversion"
                : hasAccounts && hasRecords
                  ? periodLabel
                  : "No transactions yet"
            }
            state={net >= 0 ? "positive" : "attention"}
            valueClassName={net >= 0 ? "text-success" : moneyValueClass(net)}
          />
        </MetricGrid>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel tourId="finances-cash-flow" className="flex flex-col">
          <PanelHeader
            title="Cash flow"
            hint="Income and expenses over time"
            action={
              <FinanceSelect
                ariaLabel="Finance period"
                value={period}
                onValueChange={(value) => onPeriodChange(value as BalanceRange)}
                options={BALANCE_RANGES.map((item) => [
                  item,
                  item,
                  !rangeAvailability[item],
                ])}
                className="h-8 min-w-28 px-2.5 text-xs text-muted-foreground"
              />
            }
          />
          {mixedCurrencies ? (
            <EmptyState
              title="Multiple currencies"
              description="Cash flow cannot combine currencies without conversion."
            />
          ) : hasRecords ? (
            <CashFlowChart
              records={data.records}
              balance={balance}
              range={effectivePeriod}
            />
          ) : (
            <EmptyState
              className="flex-1"
              icon={<ChartNoAxesCombined className="size-5 text-primary" />}
              title="No cash flow data yet"
              description="Your income and expenses will appear here once you start adding transactions."
              action={
                <Button size="sm" onClick={onAdd}>
                  <Plus />
                  Add transaction
                </Button>
              }
            />
          )}
          {hasRecords ? (
            <div className="mt-auto flex justify-end gap-2 pt-2 text-xs text-muted-foreground">
              <span
                className={cn(
                  "size-1.5 self-center rounded-full",
                  data.sync.status === "synced" && "bg-success",
                  data.sync.status === "syncing" && "bg-warning",
                  data.sync.status === "unavailable" && "bg-muted-foreground",
                )}
              />
              {data.sync.label}
            </div>
          ) : null}
        </Panel>
        <Panel>
          <PanelHeader
            title="Spending by category"
            hint={`${periodLabel} · select to filter transactions`}
            action={
              <Button variant="ghost" size="sm" onClick={onTransactions}>
                Transactions <ArrowRight className="size-3.5" />
              </Button>
            }
          />
          {mixedCurrencies ? (
            <EmptyState
              title="Multiple currencies"
              description="Spending totals cannot combine currencies without conversion."
            />
          ) : spending.length === 0 ? (
            <EmptyState
              icon={<Tags className="size-5 text-primary" />}
              title="No spending yet"
              description="Your transactions will be grouped by category here."
              action={
                <Button size="sm" onClick={onAdd}>
                  <Plus />
                  Add transaction
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {spending.slice(0, 6).map((item) => {
                const category = categoryOf(data.categories, item.categoryId);
                const pct = expenses
                  ? Math.round((item.total / expenses) * 100)
                  : 0;
                return (
                  <button
                    key={item.categoryId}
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md p-1.5 text-left transition-colors hover:bg-accent/50"
                    onClick={() => onCategory(item.categoryId)}
                  >
                    <CategoryIcon category={category} />
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{category.name}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <MoneyText
                      money={{ value: item.total, currencyCode: currency }}
                      className="text-xs"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Largest expense",
            icon: Receipt,
            value: largest
              ? categoryOf(data.categories, largest.categoryId).name
              : "—",
            hint: largest
              ? formatMoney({
                  ...largest.amount,
                  value: Math.abs(largest.amount.value),
                })
              : "No expenses yet",
          },
          {
            label: "Top category",
            icon: Tags,
            value: top ? categoryOf(data.categories, top.categoryId).name : "—",
            hint:
              top && expenses
                ? `${Math.round((top.total / expenses) * 100)}% of spending`
                : "No spending yet",
          },
          {
            label: "Best budget",
            icon: Target,
            value: bestBudget
              ? categoryOf(data.categories, bestBudget.categoryId).name
              : "—",
            hint: bestBudget
              ? `${Math.round((1 - bestBudget.spent.value / bestBudget.limit.value) * 100)}% remaining`
              : "No budgets yet",
          },
          {
            label: "Next payment",
            icon: CalendarClock,
            value: upcoming?.counterparty ?? "—",
            hint: upcoming
              ? `${upcoming.nextDate} · ${formatMoney(upcoming.amount)}`
              : "Nothing scheduled",
          },
        ].map(({ label, icon: Icon, value, hint }) => (
          <div
            key={label}
            className="panel grid min-w-0 grid-cols-[3.75rem_minmax(0,1fr)] overflow-hidden"
            data-slot="finance-signal"
          >
            <div className="grid min-h-full place-items-center border-r border-primary/15 bg-primary/[0.06] text-primary">
              <Icon className="size-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 px-4 py-3">
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                {label}
              </p>
              <p className="mt-1 truncate text-base font-medium" title={value}>
                {value}
              </p>
              <p
                className="mt-1 truncate text-xs text-foreground/80"
                title={hint}
              >
                {hint}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Accounts"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/finances/accounts" search={{ action: undefined }}>
                  View all <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            }
          />
          {data.accounts.length === 0 ? (
            <EmptyState
              icon={<Landmark className="size-5 text-primary" />}
              title="No accounts yet"
              description="Add your first account to start tracking balances and transactions."
              action={
                <Button asChild size="sm">
                  <Link to="/finances/accounts" search={{ action: undefined }}>
                    <Plus />
                    Add account
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-border">
              {data.accounts.map((account) => (
                <div key={account.id} className="flex items-center gap-3 py-3">
                  <AccountIcon type={account.type} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{account.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {account.type} · {account.balance.currencyCode}
                    </p>
                  </div>
                  <MoneyText money={account.balance} />
                </div>
              ))}
            </div>
          )}
        </Panel>
        <Panel>
          <PanelHeader
            title="Budgets"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/finances/budgets">
                  View all <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            }
          />
          {data.budgets.length === 0 ? (
            <EmptyState
              icon={<WalletCards className="size-5 text-primary" />}
              title="No budgets yet"
              description="Create your first budget to start planning your spending."
              action={
                <Button asChild size="sm">
                  <Link to="/finances/budgets">
                    <Plus />
                    Create budget
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {data.budgets.slice(0, 4).map((budget) => (
                <div key={budget.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>
                      {categoryOf(data.categories, budget.categoryId).name}
                    </span>
                    <span className="text-muted-foreground">
                      {formatMoney(budget.spent)} / {formatMoney(budget.limit)}
                    </span>
                  </div>
                  <BudgetProgress spent={budget.spent} limit={budget.limit} />
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
      <Panel>
        <PanelHeader
          title="Recurring payments"
          hint="Next expected commitment"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/finances/recurring">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          }
        />
        {upcoming ? (
          <div className="flex items-center gap-3">
            <CalendarClock className="size-4 text-primary" />
            <div className="flex-1">
              <p className="text-sm">
                Upcoming payment · {upcoming.counterparty}
              </p>
              <p className="text-xs text-muted-foreground">
                {upcoming.nextDate}
              </p>
            </div>
            <MoneyText money={upcoming.amount} />
          </div>
        ) : (
          <EmptyState
            icon={<CalendarClock className="size-5 text-primary" />}
            title="No recurring payments yet"
            description="Add a recurring payment to keep upcoming commitments visible."
            action={
              <Button asChild size="sm">
                <Link to="/finances/recurring">
                  <Plus />
                  Add recurring payment
                </Link>
              </Button>
            }
          />
        )}
      </Panel>
    </div>
  );
}

export type FinanceOverviewProps = Parameters<typeof LegacyFinanceOverview>[0];
const desktopQuery = "(min-width: 1024px)";
const subscribeDesktop = (callback: () => void) => {
  const media = window.matchMedia?.(desktopQuery);
  if (!media) return () => {};
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const desktopSnapshot = () =>
  window.matchMedia?.(desktopQuery).matches ?? false;
export function FinanceOverview(props: FinanceOverviewProps) {
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    desktopSnapshot,
    () => false,
  );
  return desktop ? (
    <DesktopFinanceOverview {...props} />
  ) : (
    <LegacyFinanceOverview {...props} />
  );
}
