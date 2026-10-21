import { useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Plus, Repeat2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/lifeos/states";
import { getDataSource } from "@/lib/api";
import {
  BALANCE_RANGES,
  availableBalanceRanges,
  financeRangeSelection,
  resolveBalanceRange,
  type BalanceRange,
} from "@/lib/finance/balance-trend";
import {
  accountBalance,
  expenseTotal,
  formatMoney,
  incomeTotal,
  spendingByCategory,
} from "@/lib/finance/selectors";
import type { FinanceOverviewProps } from "./overview";
import {
  AccountIcon,
  BudgetProgress,
  CategoryIcon,
  MoneyText,
  categoryOf,
} from "./shared";
import { CashFlowChart } from "./cash-flow-chart";
import { FinanceSelect } from "./finance-select";

function Surface({
  title,
  label,
  action,
  children,
  className = "",
}: {
  title: string;
  label?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`finance-surface ${className}`} aria-label={title}>
      <header className="finance-panel-header">
        <div>
          <h2>{title}</h2>
          {label && <p className="finance-scope-note">{label}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
function DetailLink({
  to,
  label,
}: {
  to: "/finances/accounts" | "/finances/budgets" | "/finances/recurring";
  label: string;
}) {
  return (
    <Button asChild variant="ghost" size="sm" className="finance-quiet">
      <Link to={to} aria-label={label}>
        View all <ArrowRight className="size-3.5" />
      </Link>
    </Button>
  );
}

/** v0 presentation over the existing snapshot/selectors; no prototype store or new queries. */
export function DesktopFinanceOverview({
  data,
  period,
  onPeriodChange,
  onCategory,
  onTransactions,
  onAdd,
}: FinanceOverviewProps) {
  const rangeAvailability = availableBalanceRanges(data.records);
  const effectivePeriod = resolveBalanceRange(data.records, period);
  useEffect(() => {
    if (data.records.length && effectivePeriod !== period)
      onPeriodChange(effectivePeriod);
  }, [data.records.length, effectivePeriod, onPeriodChange, period]);
  const { records } = financeRangeSelection(data.records, effectivePeriod);
  const income = incomeTotal(records);
  const expenses = expenseTotal(records);
  const net = income - expenses;
  const currency = data.accounts[0]?.balance.currencyCode ?? "USD";
  const balance = accountBalance(data.accounts);
  const hasAccounts = data.accounts.length > 0;
  const hasRecords = data.records.length > 0;
  // Match the real overview's existing no-FX boundary and calculations.
  const mixedCurrencies =
    getDataSource() === "api" &&
    new Set(data.records.map((record) => record.amount.currencyCode)).size > 1;
  const spending = spendingByCategory(records);
  const upcoming = [...data.standingOrders]
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))
    .slice(0, 3);
  const recent = [...data.records]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  const flowValue = (value: number, signed = false) =>
    hasAccounts && hasRecords && !mixedCurrencies
      ? formatMoney({ value, currencyCode: currency }, signed)
      : "—";
  const flowHint = mixedCurrencies
    ? "Multiple currencies; no FX conversion"
    : hasAccounts && hasRecords
      ? effectivePeriod
      : "No transactions yet";

  return (
    <div className="finance-experience">
      <section
        className="finance-intro"
        aria-labelledby="finance-overview-title"
      >
        <div>
          <h1 id="finance-overview-title">
            Your money,<em>with intention.</em>
          </h1>
          <p className="finance-context">
            <span aria-hidden="true" />
            Financial overview
          </p>
          <p className="finance-intro-description">
            A quieter view of what is coming in, what is going out, and what
            deserves your attention next.
          </p>
        </div>
        <div className="finance-next-step">
          <p className="finance-next-copy">
            Notice the shape, then choose one thing.
          </p>
          <p className="finance-scope-note">A small next step</p>
          <Button onClick={onAdd} className="finance-primary">
            <Plus className="size-4" />
            Add transaction
          </Button>
        </div>
      </section>
      <section className="finance-totals" aria-label="Financial totals">
        {[
          {
            label: "Total balance",
            value: hasAccounts
              ? balance
                ? formatMoney(balance)
                : "Multiple currencies"
              : "—",
            hint: hasAccounts
              ? `Across ${data.accounts.length} accounts`
              : "No accounts connected yet",
            tone: balance && balance.value < 0 ? "negative" : "plain",
          },
          {
            label: "Income",
            value: flowValue(income),
            hint: flowHint,
            tone: "positive",
          },
          {
            label: "Expenses",
            value: flowValue(expenses),
            hint: flowHint,
            tone: "plain",
          },
          {
            label: "Net cash flow",
            value: flowValue(net, true),
            hint: flowHint,
            tone: net >= 0 ? "positive" : "negative",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="finance-metric"
            data-finance-metric={item.label}
          >
            <p className="finance-eyebrow">{item.label}</p>
            <p className="finance-figure" data-tone={item.tone}>
              {item.value}
            </p>
            <p className="finance-metric-note">{item.hint}</p>
          </div>
        ))}
      </section>
      <div className="finance-primary-grid">
        <Surface
          title="Cash flow"
          label="Your balance over time"
          className="finance-flow"
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
              className="h-8 rounded-full px-3 text-xs"
            />
          }
        >
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
              title="No cash flow data yet"
              description="Your income and expenses will appear here once you start adding transactions."
              action={
                <Button onClick={onAdd} className="finance-primary" size="sm">
                  <Plus />
                  Add transaction
                </Button>
              }
            />
          )}
          {hasRecords && (
            <div className="finance-flow-footer">
              <span>
                Net cash flow <strong>{flowValue(net, true)}</strong>
              </span>
              <span className="finance-sync" data-status={data.sync.status}>
                {data.sync.label}
              </span>
            </div>
          )}
        </Surface>
        <Surface
          title="Spending by category"
          label={effectivePeriod}
          action={
            <Button
              variant="ghost"
              size="icon"
              className="finance-quiet"
              onClick={onTransactions}
              aria-label="View spending transactions"
            >
              <ArrowRight className="size-4" />
            </Button>
          }
        >
          {mixedCurrencies ? (
            <EmptyState
              title="Multiple currencies"
              description="Spending totals cannot combine currencies without conversion."
            />
          ) : spending.length ? (
            <div className="finance-category-list">
              {spending.slice(0, 6).map((item) => {
                const category = categoryOf(data.categories, item.categoryId);
                const percentage = expenses
                  ? Math.round((item.total / expenses) * 100)
                  : 0;
                return (
                  <button
                    key={item.categoryId}
                    type="button"
                    onClick={() => onCategory(item.categoryId)}
                    className="finance-category-row"
                  >
                    <span className="finance-category-mark">
                      <CategoryIcon category={category} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <span>{category.name}</span>
                        <span className="finance-row-note">{percentage}%</span>
                      </div>
                      <div className="finance-category-track">
                        <span style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                    <MoneyText
                      money={{ value: item.total, currencyCode: currency }}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No spending yet"
              description="Your transactions will be grouped by category here."
              action={
                <Button onClick={onAdd} size="sm" className="finance-primary">
                  <Plus />
                  Add transaction
                </Button>
              }
            />
          )}
        </Surface>
      </div>
      <div className="finance-summary-grid">
        <Surface
          title="Accounts"
          label="Where it lives"
          action={
            <DetailLink to="/finances/accounts" label="View all accounts" />
          }
        >
          {hasAccounts ? (
            <div className="finance-rows">
              {data.accounts.map((account) => (
                <Link
                  to="/finances/accounts"
                  search={{ action: undefined }}
                  key={account.id}
                  className="finance-account-row"
                >
                  <span className="finance-account-mark">
                    <AccountIcon type={account.type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{account.name}</p>
                    <p className="finance-row-note capitalize">
                      {account.type} · {account.balance.currencyCode}
                    </p>
                  </div>
                  <MoneyText money={account.balance} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No accounts yet"
              description="Add your first account to start tracking balances and transactions."
              action={
                <Button asChild size="sm" className="finance-primary">
                  <Link to="/finances/accounts" search={{ action: undefined }}>
                    <Plus />
                    Add account
                  </Link>
                </Button>
              }
            />
          )}
        </Surface>

        <Surface
          title="Budgets"
          label="Room to spend"
          action={
            <DetailLink to="/finances/budgets" label="View all budgets" />
          }
        >
          {data.budgets.length ? (
            <div className="finance-budget-list">
              {data.budgets.slice(0, 4).map((budget) => (
                <Link
                  key={budget.id}
                  to="/finances/budgets"
                  className="finance-budget-row"
                >
                  <div className="finance-budget-caption">
                    <span>
                      {budget.name ||
                        categoryOf(data.categories, budget.categoryId).name}
                    </span>
                    <span className="finance-row-note">
                      {formatMoney(budget.spent)} / {formatMoney(budget.limit)}
                    </span>
                  </div>
                  <BudgetProgress spent={budget.spent} limit={budget.limit} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No budgets yet"
              description="Create your first budget to start planning your spending."
              action={
                <Button asChild size="sm" className="finance-primary">
                  <Link to="/finances/budgets">
                    <Plus />
                    Create budget
                  </Link>
                </Button>
              }
            />
          )}
        </Surface>
        <Surface
          title="Next payments"
          label="Coming up"
          action={
            <DetailLink
              to="/finances/recurring"
              label="View all recurring payments"
            />
          }
        >
          {upcoming.length ? (
            <div className="finance-rows">
              {upcoming.map((item) => (
                <Link
                  key={item.id}
                  to="/finances/recurring"
                  className="finance-payment-row"
                >
                  <div>
                    <p>{item.counterparty}</p>
                    <p className="finance-row-note">
                      {format(parseISO(item.nextDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <MoneyText money={item.amount} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recurring payments yet"
              description="Add a recurring payment to keep upcoming commitments visible."
              action={
                <Button asChild size="sm" className="finance-primary">
                  <Link to="/finances/recurring">
                    <Plus />
                    Add recurring payment
                  </Link>
                </Button>
              }
            />
          )}
        </Surface>
      </div>
      <Surface
        title="Recent activity"
        label="Ledger"
        className="finance-recent"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={onTransactions}
            className="finance-quiet"
          >
            All transactions <ArrowRight className="size-3.5" />
          </Button>
        }
      >
        {recent.length ? (
          <div className="finance-rows">
            {recent.map((record) => (
              <button
                key={record.id}
                type="button"
                className="finance-recent-row"
                onClick={onTransactions}
              >
                <span className="finance-category-mark">
                  {record.recordType === "transfer" ? (
                    <Repeat2 className="size-4" />
                  ) : (
                    <CategoryIcon
                      category={categoryOf(data.categories, record.categoryId)}
                    />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate">{record.counterparty}</p>
                  <p className="finance-row-note">
                    {categoryOf(data.categories, record.categoryId).name} ·{" "}
                    {data.accounts.find(
                      (account) => account.id === record.accountId,
                    )?.name ?? "Account unavailable"}
                  </p>
                </div>
                <time dateTime={record.date}>
                  {format(parseISO(record.date), "MMM d")}
                </time>
                <span
                  className="finance-record-amount"
                  data-type={record.recordType}
                >
                  {record.recordType === "transfer" && (
                    <span className="sr-only">Transfer </span>
                  )}
                  <MoneyText
                    money={record.amount}
                    signed={record.recordType !== "transfer"}
                  />
                </span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No transactions yet"
            description="Your recent activity will appear here when you add a transaction."
            action={
              <Button size="sm" className="finance-primary" onClick={onAdd}>
                <Plus />
                Add transaction
              </Button>
            }
          />
        )}
      </Surface>
    </div>
  );
}
