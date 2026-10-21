import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { DesktopFinanceOverview } from "./overview-desktop";
import { buildFinanceFixture } from "@/lib/finance/fixtures";
import {
  accountBalance,
  expenseTotal,
  formatMoney,
  incomeTotal,
} from "@/lib/finance/selectors";
import { financeRangeSelection } from "@/lib/finance/balance-trend";
import type { FinanceSnapshot } from "@/lib/finance/models";
const source = vi.hoisted(() => ({ mode: "mock" }));
vi.mock("@/lib/api", () => ({ getDataSource: () => source.mode }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
    search?: unknown;
  }) => {
    const { search: _search, ...attributes } = props;
    void _search;
    return (
      <a href={to} {...attributes}>
        {children}
      </a>
    );
  },
}));
vi.mock("./cash-flow-chart", () => ({
  CashFlowChart: () => <div aria-label="Cash balance over time" />,
}));
const actions = {
  onPeriodChange: vi.fn(),
  onCategory: vi.fn(),
  onTransactions: vi.fn(),
  onAdd: vi.fn(),
};
const view = (data: FinanceSnapshot) =>
  render(
    <DesktopFinanceOverview data={data} period="Last 30 days" {...actions} />,
  );
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-21T12:00:00Z"));
  vi.clearAllMocks();
  source.mode = "mock";
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Finance v0 overview uses the real snapshot", () => {
  it.each(["mock", "api"])(
    "preserves the existing totals and excludes transfers in %s mode",
    (mode) => {
      source.mode = mode;
      const data = buildFinanceFixture();
      const original = structuredClone(data);
      const records = financeRangeSelection(
        data.records,
        "Last 30 days",
      ).records;
      const income = incomeTotal(records),
        expenses = expenseTotal(records);
      view(data);
      const totals = screen.getByRole("region", { name: "Financial totals" });
      const metric = (name: string) =>
        totals.querySelector(`[data-finance-metric="${name}"]`)!;
      expect(metric("Total balance")).toHaveTextContent(
        formatMoney(accountBalance(data.accounts)!),
      );
      expect(metric("Income")).toHaveTextContent(
        formatMoney({ value: income, currencyCode: "USD" }),
      );
      expect(metric("Expenses")).toHaveTextContent(
        formatMoney({ value: expenses, currencyCode: "USD" }),
      );
      expect(metric("Net cash flow")).toHaveTextContent(
        formatMoney({ value: income - expenses, currencyCode: "USD" }, true),
      );
      expect(data).toEqual(original);
    },
  );
  it("keeps mixed-currency API balances uncombined and every record's currency intact", () => {
    source.mode = "api";
    const data = buildFinanceFixture();
    data.accounts[1].balance.currencyCode = "EUR";
    data.records[1].amount.currencyCode = "EUR";
    view(data);
    expect(
      screen.getByRole("region", { name: "Financial totals" }),
    ).toHaveTextContent("Multiple currencies");
    expect(
      screen.getByText(
        "Cash flow cannot combine currencies without conversion.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Spending totals cannot combine currencies without conversion.",
      ),
    ).toBeVisible();
    expect(screen.getByRole("region", { name: "Accounts" })).toHaveTextContent(
      "EUR",
    );
  });
  it("keeps empty values honest and management and create entry points usable", () => {
    view({
      accounts: [],
      categories: [],
      records: [],
      budgets: [],
      standingOrders: [],
      sync: { status: "synced", label: "Ready" },
    });
    const totals = screen.getByRole("region", { name: "Financial totals" });
    expect(totals.querySelectorAll(".finance-figure")).toHaveLength(4);
    expect(totals.textContent).not.toMatch(/\$0/);
    expect(
      screen.getByRole("link", { name: /Add recurring payment/ }),
    ).toHaveAttribute("href", "/finances/recurring");
    expect(screen.getByRole("link", { name: /Add account/ })).toHaveAttribute(
      "href",
      "/finances/accounts",
    );
    expect(screen.getByRole("link", { name: /Create budget/ })).toHaveAttribute(
      "href",
      "/finances/budgets",
    );
    fireEvent.click(
      screen.getAllByRole("button", { name: "Add transaction" })[0],
    );
    expect(actions.onAdd).toHaveBeenCalledOnce();
  });
  it("links actual categories, recent records and sorted recurring commitments", () => {
    const data = buildFinanceFixture();
    view(data);
    fireEvent.click(
      within(
        screen.getByRole("region", { name: "Spending by category" }),
      ).getByRole("button", { name: /Housing/ }),
    );
    expect(actions.onCategory).toHaveBeenCalledWith("housing");
    const recent = screen.getByRole("region", { name: "Recent activity" });
    expect(within(recent).getAllByRole("button")).toHaveLength(6);
    fireEvent.click(within(recent).getAllByRole("button")[1]);
    expect(actions.onTransactions).toHaveBeenCalledOnce();
    const upcoming = screen.getByRole("region", { name: "Next payments" });
    expect(upcoming.querySelectorAll(".finance-payment-row")).toHaveLength(3);
    expect(upcoming.querySelector(".finance-payment-row")).toHaveTextContent(
      "Rent",
    );
  });
});
