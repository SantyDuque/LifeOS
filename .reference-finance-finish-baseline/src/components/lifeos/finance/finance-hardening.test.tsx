import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FinanceSnapshot } from "@/lib/finance/models";
import { FinanceOverview } from "./overview";
import { FinanceTransactions } from "./transactions";
import { AddTransactionDialog } from "./transaction-dialog";

vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));
vi.mock("@/lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api")>()),
  getDataSource: () => "api",
}));

const empty: FinanceSnapshot = {
  accounts: [],
  categories: [],
  records: [],
  budgets: [],
  standingOrders: [],
  sync: { status: "synced", label: "Up to date" },
};

describe("Finance production consistency", () => {
  afterEach(() => cleanup());
  it("uses accessible LifeOS validation instead of native required bubbles", async () => {
    const data: FinanceSnapshot = {
      ...empty,
      accounts: [
        {
          id: "account",
          name: "Cash",
          type: "cash",
          balance: { value: 0, currencyCode: "USD" },
        },
      ],
      categories: [{ id: "category", name: "Dining" }],
    };
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <AddTransactionDialog
          open
          onOpenChange={vi.fn()}
          data={data}
          onAdd={vi.fn()}
          pending={false}
        />
      </QueryClientProvider>,
    );
    const form = screen
      .getByRole("button", { name: "Add transaction" })
      .closest("form");
    expect(form).toHaveAttribute("novalidate");
    fireEvent.click(screen.getByRole("button", { name: "Add transaction" }));
    expect(
      await screen.findByText("Enter an amount greater than 0.", {
        selector: "[role=alert]",
      }),
    ).toBeVisible();
    expect(
      screen.getByText("Enter a counterparty.", { selector: "[role=alert]" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Amount")).toHaveFocus();
    fireEvent.change(screen.getByLabelText("Amount"), {
      target: { value: "25" },
    });
    expect(
      screen.queryByText("Enter an amount greater than 0."),
    ).not.toBeInTheDocument();
  });
  it("keeps recurring payments discoverable in an empty account", () => {
    render(
      <FinanceOverview
        data={empty}
        period="Last 30 days"
        onPeriodChange={vi.fn()}
        onCategory={vi.fn()}
        onTransactions={vi.fn()}
        onAdd={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("link", { name: /Add recurring payment/i }),
    ).toHaveAttribute("href", "/finances/recurring");
  });

  it("preloads editable transaction values and uses canonical controls", () => {
    const data: FinanceSnapshot = {
      ...empty,
      accounts: [
        {
          id: "account",
          name: "Cash",
          type: "cash",
          balance: { value: 0, currencyCode: "USD" },
        },
      ],
      categories: [{ id: "category", name: "Dining" }],
      records: [
        {
          id: "record",
          date: "2026-09-20",
          counterparty: "Dinner",
          amount: { value: -1234.5, currencyCode: "USD" },
          recordType: "expense",
          paymentType: "card",
          categoryId: "category",
          accountId: "account",
          labels: [],
        },
      ],
    };
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <FinanceTransactions
          data={data}
          records={data.records}
          initialCategory=""
          onAdd={vi.fn()}
        />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByText("Dinner"));
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByLabelText("Description")).toHaveValue("Dinner");
    expect(screen.getByLabelText("Amount")).toHaveValue("1,234.5");
    expect(screen.getByRole("button", { name: "Category" })).toHaveTextContent(
      "Dining",
    );
    expect(
      screen.getByRole("button", { name: "20 Sep 2026" }),
    ).toHaveTextContent("20 Sep 2026");
    expect(
      screen.getByRole("button", { name: "Save transaction" }).parentElement,
    ).toHaveClass("justify-end");
    const editGrid = document.querySelector(
      '[data-slot="transaction-edit-grid"]',
    );
    expect(editGrid).toHaveClass("sm:grid-cols-2", "gap-y-4");
  });
});
