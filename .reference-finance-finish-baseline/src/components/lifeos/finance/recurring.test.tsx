import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildFinanceFixture } from "@/lib/finance/fixtures";
import { FinanceRecurring } from "./recurring";

const auth = vi.hoisted(() => ({
  getSession: vi.fn().mockResolvedValue({
    data: { session: { access_token: "user-jwt" } },
    error: null,
  }),
  refreshSession: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@/lib/auth/password-recovery", () => ({
  getSupabaseClient: async () => ({ auth }),
}));
vi.mock("@/lib/auth/runtime-config", () => ({
  getRuntimeConfig: async () => ({ apiBaseUrl: "/api/v1" }),
}));
vi.mock("@/lib/api", () => ({
  getDataSource: () => "api",
  api: { getSession: async () => ({ status: "signed-in", profile: { id: "owner" } }) },
}));

function renderPage() {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <FinanceRecurring data={buildFinanceFixture()} />
    </QueryClientProvider>,
  );
}
beforeEach(() => vi.stubEnv("VITE_RECURRING_DATA_SOURCE", "api"));
afterEach(() => {
  vi.unstubAllEnvs();
  cleanup();
  vi.unstubAllGlobals();
});
describe("Recurring payments", () => {
  it("shows loading without fabricated commitments", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    renderPage();
    expect(screen.getByRole("status", { name: "Loading" })).toBeVisible();
  });
  it("shows a LifeOS error and retries", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ error: { message: "Try again shortly." } }),
          { status: 429 },
        ),
      )
      .mockResolvedValue(
        new Response(
          JSON.stringify({ items: [], activeOrders: 0, monthlyCommitment: [] }),
        ),
      );
    vi.stubGlobal("fetch", fetcher);
    renderPage();
    expect(
      await screen.findByText("Try again shortly."),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /retry|try again/i }));
    expect(await screen.findByText("No upcoming payments.")).toBeVisible();
  });
  it("shows inline mutation errors and preserves entered fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((_url, init?: RequestInit) =>
        Promise.resolve(
          init?.method === "POST"
            ? new Response(
                JSON.stringify({
                  error: { message: "Payment date is invalid." },
                }),
                { status: 400 },
              )
            : new Response(
                JSON.stringify({
                  items: [],
                  activeOrders: 0,
                  monthlyCommitment: [],
                }),
              ),
        ),
      ),
    );
    renderPage();
    await screen.findByText("No upcoming payments.");
    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Recurring payment actions" }),
      { button: 0, ctrlKey: false },
    );
    fireEvent.click(
      await screen.findByRole("menuitem", { name: "Add recurring payment" }),
    );
    fireEvent.change(screen.getByLabelText("Name", { exact: true }), {
      target: { value: "Rent" },
    });
    fireEvent.change(screen.getByLabelText("Amount", { exact: true }), {
      target: { value: "1250" },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: "Add recurring payment",
      }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Payment date is invalid.",
    );
    expect(screen.getByLabelText("Name", { exact: true })).toHaveValue("Rent");
  });
  it("records an upcoming occurrence through the authenticated API", async () => {
    const data = buildFinanceFixture();
    const standing = data.standingOrders[0]!;
    const item = {
      id: standing.id,
      name: standing.counterparty,
      amountMinor: Math.round(standing.amount.value * 100),
      currency: standing.amount.currencyCode,
      accountRef: standing.accountId,
      categoryRef: standing.categoryId,
      frequency: "MONTHLY",
      nextPaymentDate: standing.nextDate,
      nextOccurrenceDate: standing.nextDate,
      lastPaidDate: null,
      lastPaidTransactionId: null,
      status: "ACTIVE",
      startDate: null,
      endDate: null,
      payee: standing.counterparty,
      notes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const fetcher = vi.fn((_url: string, init?: RequestInit) =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            init?.method === "POST"
              ? {
                  recurringPayment: {
                    ...item,
                    nextOccurrenceDate: "2026-10-24",
                    lastPaidDate: item.nextOccurrenceDate,
                  },
                  transactionId: "transaction-id",
                  occurrenceDate: item.nextOccurrenceDate,
                  duplicate: false,
                }
              : { items: [item], activeOrders: 1, monthlyCommitment: [] },
          ),
          { status: init?.method === "POST" ? 201 : 200 },
        ),
      ),
    );
    vi.stubGlobal("fetch", fetcher);
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Pay" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Record as paid" }),
    );
    await waitFor(() =>
      expect(fetcher).toHaveBeenCalledWith(
        expect.stringContaining("/finance/recurring-payments/"),
        expect.objectContaining({ method: "POST" }),
      ),
    );
  });
});
