import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDataSource } from "@/lib/api";
import { apiFinanceRepository } from "@/lib/finance/api-repository";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CurrencyCode,
  FinanceBudget,
  FinanceCategory,
  WalletBudgetType,
} from "@/lib/finance/models";
import { useCreateFinanceBudget, useUpdateFinanceBudget } from "@/lib/queries";
import { FinanceAmountInput } from "./finance-amount-input";

const PERIODS: Array<{ value: WalletBudgetType; label: string }> = [
  { value: "BUDGET_INTERVAL_WEEK", label: "Weekly" },
  { value: "BUDGET_INTERVAL_MONTH", label: "Monthly" },
  { value: "BUDGET_INTERVAL_YEAR", label: "Yearly" },
  { value: "BUDGET_CUSTOM", label: "Custom" },
];
const NO_UNAVAILABLE_CATEGORIES: string[] = [];

export function BudgetDialog({
  open,
  onOpenChange,
  budget,
  categories,
  unavailableCategoryIds = NO_UNAVAILABLE_CATEGORIES,
  onRequestDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: FinanceBudget;
  categories: FinanceCategory[];
  unavailableCategoryIds?: string[];
  onRequestDelete?: () => void;
}) {
  const availableCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.id === budget?.categoryId ||
          !unavailableCategoryIds.includes(category.id),
      ),
    [budget?.categoryId, categories, unavailableCategoryIds],
  );
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [period, setPeriod] = useState<WalletBudgetType>(
    "BUDGET_INTERVAL_MONTH",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const create = useCreateFinanceBudget();
  const update = useUpdateFinanceBudget();
  const apiMode = getDataSource() === "api";
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState("");
  const createCategory = useMutation({
    mutationFn: (name: string) => apiFinanceRepository.createCategory(name),
    onSuccess: (created) => {
      setCategoryId(created.id);
      setNewCategory("");
      void queryClient.invalidateQueries({ queryKey: ["finances"] });
    },
    onError: (cause: Error) => setError(cause.message),
  });

  useEffect(() => {
    if (!open) return;
    setCategoryId(budget?.categoryId ?? availableCategories[0]?.id ?? "");
    setAmount(String(budget?.limit.value ?? ""));
    setCurrency(budget?.limit.currencyCode ?? "USD");
    setPeriod(budget?.type ?? "BUDGET_INTERVAL_MONTH");
    setStartDate(budget?.startDate ?? "");
    setEndDate(budget?.endDate ?? "");
    setError("");
  }, [availableCategories, budget, open]);

  const pending = create.isPending || update.isPending;
  const custom = period === "BUDGET_CUSTOM";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const numericAmount = Number(amount);
            if (!categories.some((category) => category.id === categoryId))
              return setError("Select a valid category.");
            if (!Number.isFinite(numericAmount) || numericAmount <= 0)
              return setError("Budget amount must be greater than zero.");
            if (custom && (!startDate || !endDate))
              return setError("Custom budgets require a start and end date.");
            if (custom && startDate > endDate)
              return setError("End date must be on or after the start date.");

            const options = {
              onSuccess: () => {
                toast.success(budget ? "Budget updated" : "Budget created");
                onOpenChange(false);
              },
              onError: (mutationError: Error) =>
                setError(
                  mutationError.message || "Wallet could not save this budget.",
                ),
            };
            if (budget) {
              update.mutate(
                {
                  id: budget.id,
                  limit: { value: numericAmount, currencyCode: currency },
                  ...(custom ? { startDate, endDate } : {}),
                },
                options,
              );
            } else {
              create.mutate(
                {
                  categoryId,
                  limit: { value: numericAmount, currencyCode: currency },
                  type: period,
                  ...(custom ? { startDate, endDate } : {}),
                },
                options,
              );
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {budget ? "Edit budget" : "Create budget"}
            </DialogTitle>
            <DialogDescription>
              {apiMode
                ? "Set a monthly spending limit for a finance category."
                : budget
                  ? "Update the writable Wallet settings for this category budget."
                  : "Set a spending limit for an existing finance category."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <Label htmlFor="budget-category">Category</Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={Boolean(budget)}
              >
                <SelectTrigger id="budget-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {apiMode && !budget ? (
              <div className="flex gap-2">
                <Input
                  aria-label="New category"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder="New category"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!newCategory.trim() || createCategory.isPending}
                  onClick={() => createCategory.mutate(newCategory.trim())}
                >
                  Add category
                </Button>
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="budget-amount">Budget amount</Label>
                <FinanceAmountInput
                  id="budget-amount"
                  value={amount}
                  onValueChange={setAmount}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget-currency">Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value as CurrencyCode)}
                  disabled={Boolean(budget)}
                >
                  <SelectTrigger id="budget-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["USD", "EUR", "GBP", "COP"] as const).map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget-period">Period</Label>
              <Select
                value={period}
                onValueChange={(value) => setPeriod(value as WalletBudgetType)}
                disabled={Boolean(budget) || apiMode}
              >
                <SelectTrigger id="budget-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(apiMode
                    ? PERIODS.filter(
                        (item) => item.value === "BUDGET_INTERVAL_MONTH",
                      )
                    : PERIODS
                  ).map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {custom ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="budget-start">Start date</Label>
                  <Input
                    id="budget-start"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="budget-end">End date</Label>
                  <Input
                    id="budget-end"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                  />
                </div>
              </div>
            ) : null}
            {budget ? (
              <p className="text-xs text-muted-foreground">
                Wallet keeps category, currency, and period fixed after
                creation.
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <DialogFooter className={budget ? "sm:justify-between" : undefined}>
            {budget && onRequestDelete ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive"
                onClick={onRequestDelete}
              >
                Delete budget
              </Button>
            ) : null}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {budget ? "Save changes" : "Create budget"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
