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
import { financeRepository } from "@/lib/finance/mock-repository";
import { FinanceBudgets } from "./budgets";

function renderBudgets() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FinanceBudgets data={buildFinanceFixture(new Date("2026-09-07"))} />
    </QueryClientProvider>,
  );
}

async function openCreate() {
  fireEvent.pointerDown(screen.getByRole("button", { name: "Manage budgets" }));
  fireEvent.click(
    await screen.findByRole("menuitem", { name: "Create budget" }),
  );
}

describe("FinanceBudgets management", () => {
  beforeEach(() => financeRepository.reset());
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("opens the FAB actions and validates create input", async () => {
    renderBudgets();
    await openCreate();
    expect(
      screen.getByRole("heading", { name: "Create budget" }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Create budget" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Budget amount must be greater than zero",
    );
  });

  it("creates a category budget and invalidates through the shared repository", async () => {
    renderBudgets();
    await openCreate();
    fireEvent.change(screen.getByLabelText("Budget amount"), {
      target: { value: "450" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create budget" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "Create budget" }),
      ).not.toBeInTheDocument(),
    );
    expect((await financeRepository.getSnapshot()).budgets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          categoryId: "housing",
          limit: expect.objectContaining({ value: 450 }),
        }),
      ]),
    );
  });

  it("enters and exits management mode and opens a prepopulated editor", async () => {
    renderBudgets();
    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Manage budgets" }),
    );
    fireEvent.click(
      await screen.findByRole("menuitem", { name: "Edit budgets" }),
    );
    expect(screen.getByRole("button", { name: "Done" })).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: "Edit Groceries budget" }),
    );
    expect(screen.getByRole("heading", { name: "Edit budget" })).toBeVisible();
    expect(screen.getByLabelText("Budget amount")).toHaveValue("600");
    expect(screen.getByLabelText("Category")).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(
      screen.queryByRole("button", { name: "Edit Groceries budget" }),
    ).not.toBeInTheDocument();
  });

  it("shows repository errors inline", async () => {
    vi.spyOn(financeRepository, "createBudget").mockRejectedValueOnce(
      new Error("Wallet is still synchronizing. Try again shortly."),
    );
    renderBudgets();
    await openCreate();
    fireEvent.change(screen.getByLabelText("Budget amount"), {
      target: { value: "450" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create budget" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Wallet is still synchronizing",
    );
  });
});
