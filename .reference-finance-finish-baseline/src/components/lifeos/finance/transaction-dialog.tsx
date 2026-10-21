import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDataSource } from "@/lib/api";
import { apiFinanceRepository } from "@/lib/finance/api-repository";
import { useDialogOpener } from "@/hooks/use-dialog-opener";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FinanceRecord, FinanceSnapshot } from "@/lib/finance/models";
import { FinanceSelect } from "./finance-select";
import { FinanceDatePicker } from "./finance-date-picker";
import { FinanceAmountInput } from "./finance-amount-input";
import { FinanceField } from "./finance-field";

const payments: Array<[string, string]> = [
  ["card", "Card"],
  ["bank_transfer", "Bank transfer"],
  ["cash", "Cash"],
  ["direct_debit", "Direct debit"],
];
export function AddTransactionDialog({
  open,
  onOpenChange,
  data,
  onAdd,
  pending,
  preferredAccountId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: FinanceSnapshot;
  onAdd: (record: Omit<FinanceRecord, "id">) => void;
  pending: boolean;
  preferredAccountId?: string;
}) {
  const [type, setType] = useState<FinanceRecord["recordType"]>("expense");
  const dialogFocus = useDialogOpener();
  const [transferType, setTransferType] = useState<"internal" | "external">(
    "internal",
  );
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [account, setAccount] = useState(data.accounts[0]?.id ?? "");
  const [destination, setDestination] = useState(data.accounts[1]?.id ?? "");
  const [category, setCategory] = useState(data.categories[0]?.id ?? "");
  const [payment, setPayment] = useState("card");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const amountRef = useRef<HTMLInputElement>(null);
  const apiMode = getDataSource() === "api";
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState("");
  const createCategory = useMutation({
    mutationFn: (name: string) => apiFinanceRepository.createCategory(name),
    onSuccess: (created) => {
      setCategory(created.id);
      setNewCategory("");
      void queryClient.invalidateQueries({ queryKey: ["finances"] });
    },
    onError: (cause: Error) => setError(cause.message),
  });
  useEffect(() => {
    if (!open) return;
    setAccount(preferredAccountId ?? data.accounts[0]?.id ?? "");
    if (getDataSource() === "api")
      setCurrency(
        data.accounts.find((item) => item.id === preferredAccountId)?.balance
          .currencyCode ??
          data.accounts[0]?.balance.currencyCode ??
          "USD",
      );
  }, [data.accounts, open, preferredAccountId]);
  const accountOptions = data.accounts.map(
    (item) => [item.id, item.name] as [string, string],
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        {...dialogFocus}
        data-finance-transaction
        className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
          <DialogDescription>
            Record an expense, income, or transfer.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          aria-busy={pending}
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            const form = new FormData(event.currentTarget);
            const raw = Number(amount);
            const nextErrors: Record<string, string> = {};
            if (!Number.isFinite(raw) || raw <= 0)
              nextErrors.amount = "Enter an amount greater than 0.";
            if (!date) nextErrors.date = "Choose a date.";
            if (!account) nextErrors.account = "Choose an account.";
            if (type !== "transfer" && !category)
              nextErrors.category = "Choose a category.";
            if (
              (type !== "transfer" || transferType === "external") &&
              !String(form.get("counterparty") ?? "").trim()
            )
              nextErrors.counterparty = "Enter a counterparty.";
            setFieldErrors(nextErrors);
            if (Object.keys(nextErrors).length) {
              amountRef.current?.focus();
              return;
            }
            if (
              type === "transfer" &&
              transferType === "internal" &&
              account === destination
            ) {
              setError("From and To accounts must be different.");
              return;
            }
            const internalDestination = data.accounts.find(
              (item) => item.id === destination,
            );
            if (apiMode && type === "transfer" && transferType === "external") {
              setError("External transfers are not supported yet.");
              return;
            }
            if (
              apiMode &&
              data.accounts.find((item) => item.id === account)?.balance
                .currencyCode !== currency
            ) {
              setError("Transaction currency must match the account currency.");
              return;
            }
            onAdd({
              recordType: type,
              transferType: type === "transfer" ? transferType : undefined,
              destinationAccountId:
                type === "transfer" && transferType === "internal"
                  ? destination
                  : undefined,
              externalAccountLabel:
                type === "transfer" && transferType === "external"
                  ? String(form.get("externalAccountLabel") ?? "") || undefined
                  : undefined,
              amount: {
                value: type === "expense" ? -Math.abs(raw) : Math.abs(raw),
                currencyCode:
                  currency as FinanceRecord["amount"]["currencyCode"],
              },
              date,
              accountId: account,
              categoryId: type === "transfer" ? "transfer" : category,
              counterparty:
                type === "transfer" && transferType === "internal"
                  ? (internalDestination?.name ?? "Own account transfer")
                  : String(form.get("counterparty") ?? ""),
              paymentType: payment as FinanceRecord["paymentType"],
              labels: String(form.get("labels") ?? "")
                .split(",")
                .map((label) => label.trim())
                .filter(Boolean),
              note: String(form.get("note") ?? "") || undefined,
            });
          }}
        >
          <div
            className="finance-transaction-types grid grid-cols-3 gap-2"
            role="group"
            aria-label="Transaction type"
          >
            {(["expense", "income", "transfer"] as const).map((value) => (
              <Button
                key={value}
                type="button"
                aria-pressed={type === value}
                variant={type === value ? "default" : "outline"}
                onClick={() => setType(value)}
                className="capitalize"
              >
                {value}
              </Button>
            ))}
          </div>
          {type === "transfer" ? (
            <div
              data-finance-transfer-types
              className="grid grid-cols-2 rounded-md bg-muted p-1"
            >
              <Button
                type="button"
                size="sm"
                variant={transferType === "internal" ? "default" : "ghost"}
                onClick={() => setTransferType("internal")}
              >
                Own account
              </Button>
              {!apiMode ? (
                <Button
                  type="button"
                  size="sm"
                  variant={transferType === "external" ? "default" : "ghost"}
                  onClick={() => setTransferType("external")}
                >
                  External
                </Button>
              ) : null}
            </div>
          ) : null}
          <div className="finance-transaction-money grid gap-3 sm:grid-cols-3">
            <FinanceField
              label="Amount"
              error={fieldErrors.amount}
              errorId="transaction-amount-error"
            >
              <FinanceAmountInput
                aria-label="Amount"
                ref={amountRef}
                aria-invalid={Boolean(fieldErrors.amount)}
                aria-describedby={
                  fieldErrors.amount ? "transaction-amount-error" : undefined
                }
                className={
                  fieldErrors.amount
                    ? "border-destructive focus-visible:ring-destructive"
                    : undefined
                }
                name="amount"
                value={amount}
                onValueChange={(value) => {
                  setAmount(value);
                  if (Number(value) > 0)
                    setFieldErrors((current) => ({ ...current, amount: "" }));
                }}
                placeholder="0.00"
              />
            </FinanceField>
            <FinanceField label="Currency">
              <FinanceSelect
                name="currency"
                ariaLabel="Currency"
                value={currency}
                onValueChange={setCurrency}
                options={["USD", "EUR", "GBP", "COP"].map((item) => [
                  item,
                  item,
                ])}
              />
            </FinanceField>
            <FinanceField
              label="Date"
              error={fieldErrors.date}
              errorId="transaction-date-error"
            >
              <FinanceDatePicker
                ariaLabel="Date"
                name="date"
                value={date}
                onChange={setDate}
              />
            </FinanceField>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {type !== "transfer" || transferType === "external" ? (
              <FinanceField
                error={fieldErrors.counterparty}
                errorId="transaction-counterparty-error"
                label={
                  type === "transfer"
                    ? "Recipient / Counterparty"
                    : "Counterparty"
                }
              >
                <Input
                  name="counterparty"
                  aria-label={
                    type === "transfer"
                      ? "Recipient / Counterparty"
                      : "Counterparty"
                  }
                  aria-invalid={Boolean(fieldErrors.counterparty)}
                  aria-describedby={
                    fieldErrors.counterparty
                      ? "transaction-counterparty-error"
                      : undefined
                  }
                  className={
                    fieldErrors.counterparty
                      ? "border-destructive focus-visible:ring-destructive"
                      : undefined
                  }
                  onChange={() =>
                    setFieldErrors((current) => ({
                      ...current,
                      counterparty: "",
                    }))
                  }
                  placeholder="e.g. Carulla"
                />
              </FinanceField>
            ) : null}
            <FinanceField
              error={fieldErrors.account}
              errorId="transaction-account-error"
              label={type === "transfer" ? "From account" : "Account"}
            >
              <FinanceSelect
                name="account"
                ariaLabel={type === "transfer" ? "From account" : "Account"}
                value={account}
                onValueChange={(value) => {
                  setAccount(value);
                  if (apiMode)
                    setCurrency(
                      data.accounts.find((item) => item.id === value)?.balance
                        .currencyCode ?? "USD",
                    );
                }}
                options={accountOptions}
              />
            </FinanceField>
            {type === "transfer" && transferType === "internal" ? (
              <FinanceField label="To account">
                <FinanceSelect
                  ariaLabel="To account"
                  value={destination}
                  onValueChange={setDestination}
                  options={accountOptions}
                />
              </FinanceField>
            ) : null}
            {type === "transfer" && transferType === "external" ? (
              <FinanceField label="External bank/account">
                <Input
                  name="externalAccountLabel"
                  aria-label="External bank/account"
                  placeholder="Optional institution or account"
                />
              </FinanceField>
            ) : null}
          </div>
          {type !== "transfer" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <FinanceField
                label="Category"
                error={fieldErrors.category}
                errorId="transaction-category-error"
              >
                <FinanceSelect
                  name="category"
                  ariaLabel="Category"
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    setFieldErrors((current) => ({ ...current, category: "" }));
                  }}
                  options={data.categories.map((item) => [item.id, item.name])}
                />
              </FinanceField>
              <FinanceField label="Payment type">
                <FinanceSelect
                  name="payment"
                  ariaLabel="Payment type"
                  value={payment}
                  onValueChange={setPayment}
                  options={payments}
                />
              </FinanceField>
            </div>
          ) : transferType === "external" ? (
            <FinanceField label="Payment type">
              <FinanceSelect
                name="payment"
                ariaLabel="Payment type"
                value={payment}
                onValueChange={setPayment}
                options={payments}
              />
            </FinanceField>
          ) : null}
          {apiMode && type !== "transfer" ? (
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
          {!apiMode ? (
            <FinanceField label="Labels">
              <Input
                name="labels"
                aria-label="Labels"
                placeholder="Fixed, Work (comma separated)"
              />
            </FinanceField>
          ) : null}
          {!apiMode ? (
            <FinanceField label="Note">
              <Input
                aria-label="Note"
                name="note"
                placeholder="Optional note"
              />
            </FinanceField>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <DialogFooter data-finance-transaction-footer>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
