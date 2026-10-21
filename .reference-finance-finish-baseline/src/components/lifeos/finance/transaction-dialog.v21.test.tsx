import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AddTransactionDialog } from "./transaction-dialog";
import { buildFinanceFixture } from "@/lib/finance/fixtures";
const source = vi.hoisted(() => ({ mode: "mock" }));
vi.mock("@/lib/api", async (original) => ({
  ...(await original<typeof import("@/lib/api")>()),
  getDataSource: () => source.mode,
}));
afterEach(cleanup);
beforeEach(() => {
  source.mode = "mock";
});
const renderForm = (pending = false) => {
  const data = buildFinanceFixture();
  if (source.mode === "api") data.accounts[0].balance.currencyCode = "EUR";
  const onAdd = vi.fn();
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <AddTransactionDialog
        open
        onOpenChange={vi.fn()}
        data={data}
        pending={pending}
        onAdd={onAdd}
      />
    </QueryClientProvider>,
  );
  return { onAdd, data };
};
it.each(["mock", "api"])(
  "retains canonical income payload and account currency in %s",
  (mode) => {
    source.mode = mode;
    const { onAdd } = renderForm();
    fireEvent.click(screen.getByRole("button", { name: /^income$/i }));
    fireEvent.change(screen.getByLabelText("Amount", { exact: true }), {
      target: { value: "125.50" },
    });
    fireEvent.change(screen.getByLabelText("Counterparty", { exact: true }), {
      target: { value: "Client payment" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /^Add transaction$/ }),
    );
    expect(onAdd).toHaveBeenCalledOnce();
    expect(onAdd.mock.calls[0][0]).toMatchObject({
      recordType: "income",
      amount: { value: 125.5, currencyCode: mode === "api" ? "EUR" : "USD" },
      accountId: "checking",
      counterparty: "Client payment",
      categoryId: "housing",
      paymentType: "card",
      labels: [],
    });
    expect(screen.getByRole("button", { name: /^income$/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
);
it("retains pending submit protection with an accessible busy state", () => {
  const { onAdd } = renderForm(true);
  const submit = screen.getByRole("button", { name: /Adding/ });
  expect(submit).toBeDisabled();
  expect(submit.closest("form")).toHaveAttribute("aria-busy", "true");
  fireEvent.click(submit);
  expect(onAdd).not.toHaveBeenCalled();
});
