import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildFinanceFixture } from "@/lib/finance/fixtures";
import { financeRepository } from "@/lib/finance/mock-repository";
import { FinanceAccounts } from "./accounts";

function renderAccounts() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FinanceAccounts data={buildFinanceFixture(new Date("2026-09-07"))} />
    </QueryClientProvider>,
  );
}

describe("FinanceAccounts management", () => {
  beforeEach(() => financeRepository.reset());
  afterEach(cleanup);

  it("opens the add form and validates the account name", async () => {
    renderAccounts();
    fireEvent.click(screen.getByRole("button", { name: /add account/i }));
    expect(screen.getByRole("heading", { name: "Add account" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Account name is required",
    );
  });

  it("opens edit from the card overflow without selecting the card", async () => {
    renderAccounts();
    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Manage Checking" }),
    );
    fireEvent.click(
      await screen.findByRole("menuitem", { name: /edit account/i }),
    );
    expect(screen.getByRole("heading", { name: "Edit account" })).toBeVisible();
    expect(screen.getByLabelText("Account name")).toHaveValue("Checking");
    expect(screen.queryByText(/Recent · Checking/i)).not.toBeInTheDocument();
  });

  it("checks and displays references before account deletion", async () => {
    renderAccounts();
    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Manage Checking" }),
    );
    fireEvent.click(
      await screen.findByRole("menuitem", { name: /delete account/i }),
    );
    expect(
      screen.getByRole("heading", { name: "Delete account?" }),
    ).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText(/currently referenced by/i)).toBeVisible(),
    );
    expect(
      screen.getByText("66 transactions", { selector: "li" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
  });
});
