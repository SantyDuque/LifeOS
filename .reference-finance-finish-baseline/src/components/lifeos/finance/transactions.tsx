import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/lifeos/states";
import {
  CompactSummary,
  FilterSummaryPanel,
} from "@/components/lifeos/secondary-page";
import type { FinanceRecord, FinanceSnapshot } from "@/lib/finance/models";
import { formatMoney } from "@/lib/finance/selectors";
import { CategoryIcon, categoryOf, moneyValueClass } from "./shared";
import { cn } from "@/lib/utils";
import { FinanceSelect } from "./finance-select";
import { summarizeTransactions } from "@/lib/finance/transaction-activity";
import { getDataSource } from "@/lib/api";
import { apiFinanceRepository } from "@/lib/finance/api-repository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FinanceDatePicker } from "./finance-date-picker";
import { FinanceAmountInput } from "./finance-amount-input";
import { FinanceField } from "./finance-field";

const transactionColumns =
  "md:grid-cols-[6rem_minmax(11rem,1fr)_9rem_9rem_9rem_8rem]";

export function FinanceTransactions({
  data,
  records,
  initialCategory,
  onAdd,
}: {
  data: FinanceSnapshot;
  records: FinanceRecord[];
  initialCategory: string;
  onAdd: () => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [account, setAccount] = useState("");
  const [type, setType] = useState("");
  const [payment, setPayment] = useState("");
  const [selected, setSelected] = useState<FinanceRecord | null>(null);
  useEffect(() => {
    setCategory(initialCategory);
    if (!initialCategory) {
      setSearch("");
      setAccount("");
      setType("");
      setPayment("");
    }
  }, [initialCategory]);
  const filtered = useMemo(
    () =>
      records.filter(
        (record) =>
          (!search ||
            record.counterparty.toLowerCase().includes(search.toLowerCase())) &&
          (!category || record.categoryId === category) &&
          (!account || record.accountId === account) &&
          (!type || record.recordType === type) &&
          (!payment || record.paymentType === payment),
      ),
    [records, search, category, account, type, payment],
  );
  const summary = useMemo(() => summarizeTransactions(filtered), [filtered]);
  const mixedCurrencies =
    getDataSource() === "api" &&
    new Set(filtered.map((record) => record.amount.currencyCode)).size > 1;
  return (
    <div className="space-y-4">
      <FilterSummaryPanel
        filters={
          <>
            <div className="relative min-w-52 flex-1">
              <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search counterparty"
                className="pl-9"
              />
            </div>
            <Filter
              value={type}
              onChange={setType}
              label="All types"
              options={[
                ["expense", "Expense"],
                ["income", "Income"],
                ["transfer", "Transfer"],
              ]}
            />
            <Filter
              value={category}
              onChange={setCategory}
              label="All categories"
              options={data.categories.map((item) => [item.id, item.name])}
            />
            <Filter
              value={account}
              onChange={setAccount}
              label="All accounts"
              options={data.accounts.map((item) => [item.id, item.name])}
            />
            <Filter
              value={payment}
              onChange={setPayment}
              label="All payments"
              options={[
                ["card", "Card"],
                ["bank_transfer", "Bank transfer"],
                ["cash", "Cash"],
                ["direct_debit", "Direct debit"],
              ]}
            />
            <Button className="h-9" size="sm" onClick={onAdd}>
              Add
            </Button>
          </>
        }
      >
        <CompactSummary
          columns={4}
          items={[
            {
              label: "Income",
              value: mixedCurrencies
                ? "Multiple currencies"
                : formatMoney(summary.income),
            },
            {
              label: "Expenses",
              value: mixedCurrencies
                ? "Multiple currencies"
                : formatMoney(summary.expenses),
            },
            {
              label: "Net",
              value: mixedCurrencies
                ? "Multiple currencies"
                : formatMoney(summary.net, true),
              valueClassName: moneyValueClass(summary.net.value),
            },
            { label: "Transactions", value: String(summary.count) },
          ]}
        />
      </FilterSummaryPanel>
      <Panel className="overflow-x-auto p-0">
        <div
          data-slot="transaction-table-header"
          className={cn(
            "hidden gap-3 border-b border-border bg-surface-raised px-5 py-2.5 text-[10px] tracking-widest text-muted-foreground uppercase md:grid md:min-w-[54rem]",
            transactionColumns,
          )}
        >
          <span>Date</span>
          <span>Counterparty</span>
          <span>Category</span>
          <span>Account</span>
          <span>Payment</span>
          <span className="text-right">Amount</span>
        </div>
        {filtered.length ? (
          <div className="divide-y divide-border">
            {filtered.map((record) => {
              const cat = categoryOf(data.categories, record.categoryId);
              const acc = data.accounts.find(
                (item) => item.id === record.accountId,
              );
              return (
                <button
                  key={record.id}
                  className={cn(
                    "grid w-full grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none sm:px-5 md:min-w-[54rem]",
                    transactionColumns,
                  )}
                  onClick={() => setSelected(record)}
                >
                  <span className="text-[11px] text-muted-foreground">
                    {record.date}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-foreground">
                      {record.counterparty}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground md:hidden">
                      {cat.name} · {acc?.name ?? "Unknown account"}
                    </span>
                  </span>
                  <span className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
                    <CategoryIcon category={cat} className="size-3.5" />
                    <span className="truncate">{cat.name}</span>
                  </span>
                  <span className="hidden truncate text-xs text-muted-foreground md:block">
                    {acc?.name}
                  </span>
                  <span className="hidden text-xs text-muted-foreground capitalize md:block">
                    {record.paymentType.replace("_", " ")}
                  </span>
                  <span
                    className={cn(
                      "num whitespace-nowrap text-right text-sm font-medium",
                      record.recordType === "income" && "text-success",
                      moneyValueClass(record.amount.value),
                    )}
                  >
                    {formatMoney(record.amount, true)}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No transactions match your filters.
          </p>
        )}
      </Panel>
      <TransactionDetails
        record={selected}
        data={data}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
function Filter({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: Array<[string, string]>;
}) {
  return (
    <FinanceSelect
      value={value}
      onValueChange={onChange}
      label={label}
      options={[["", label], ...options]}
      className="w-auto min-w-28 text-xs text-muted-foreground"
    />
  );
}
function TransactionDetails({
  record,
  data,
  onClose,
}: {
  record: FinanceRecord | null;
  data: FinanceSnapshot;
  onClose: () => void;
}) {
  const apiMode = getDataSource() === "api";
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [recordType, setRecordType] = useState<"income" | "expense">("expense");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"amount" | "date" | "account" | "category", string>>
  >({});
  const amountRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setEditing(false);
    setDescription(record?.counterparty ?? "");
    setAmount(String(Math.abs(record?.amount.value ?? 0)));
    setDate(record?.date ?? "");
    setAccountId(record?.accountId ?? "");
    setCategoryId(record?.categoryId ?? "");
    setRecordType(record?.recordType === "income" ? "income" : "expense");
    setError("");
    setFieldErrors({});
  }, [record]);
  const update = useMutation({
    mutationFn: () =>
      apiFinanceRepository.updateRecord(record!.id, {
        amount: Number(amount),
        description,
        date,
        accountId,
        categoryId,
        recordType,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["finances"] });
      onClose();
    },
    onError: (cause: Error) => setError(cause.message),
  });
  const archive = useMutation({
    mutationFn: () => apiFinanceRepository.archiveRecord(record!.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["finances"] });
      onClose();
    },
    onError: (cause: Error) => setError(cause.message),
  });
  if (!record) return null;
  const category = categoryOf(data.categories, record.categoryId);
  const account = data.accounts.find((item) => item.id === record.accountId);
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction</DialogTitle>
          <DialogDescription>{record.counterparty}</DialogDescription>
        </DialogHeader>
        <p
          className={cn(
            "num text-center text-3xl",
            record.recordType === "income" && "text-success",
            moneyValueClass(record.amount.value),
          )}
        >
          {formatMoney(record.amount, true)}{" "}
          <span className="text-sm text-muted-foreground">
            {record.amount.currencyCode}
          </span>
        </p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          <dt className="text-muted-foreground">Date</dt>
          <dd className="text-right">{record.date}</dd>
          <dt className="text-muted-foreground">Type</dt>
          <dd className="text-right capitalize">{record.recordType}</dd>
          <dt className="text-muted-foreground">Payment</dt>
          <dd className="text-right capitalize">
            {record.paymentType.replace("_", " ")}
          </dd>
          <dt className="text-muted-foreground">Account</dt>
          <dd className="text-right">{account?.name}</dd>
          <dt className="text-muted-foreground">Category</dt>
          <dd className="text-right">{category.name}</dd>
          {record.labels.length ? (
            <>
              <dt className="text-muted-foreground">Labels</dt>
              <dd className="text-right">{record.labels.join(", ")}</dd>
            </>
          ) : null}
          {record.note ? (
            <>
              <dt className="text-muted-foreground">Note</dt>
              <dd className="text-right">{record.note}</dd>
            </>
          ) : null}
        </dl>
        {apiMode ? (
          <div className="mt-1 space-y-4 border-t border-border pt-4">
            {editing ? (
              <form
                noValidate
                data-slot="transaction-edit-grid"
                className="grid gap-x-4 gap-y-4 sm:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const nextErrors = {
                    ...(!(Number(amount) > 0)
                      ? { amount: "Enter an amount greater than zero." }
                      : {}),
                    ...(!date ? { date: "Select a date." } : {}),
                    ...(!accountId ? { account: "Select an account." } : {}),
                    ...(!categoryId
                      ? { category: "Select a category." }
                      : {}),
                  };
                  setFieldErrors(nextErrors);
                  if (Object.keys(nextErrors).length) {
                    setError("");
                    if (nextErrors.amount) amountRef.current?.focus();
                    return;
                  }
                  update.mutate();
                }}
              >
                <FinanceField label="Description">
                  <Input
                    aria-label="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    maxLength={500}
                  />
                </FinanceField>
                <FinanceField
                  label="Amount"
                  error={fieldErrors.amount}
                  errorId="edit-transaction-amount-error"
                >
                  <FinanceAmountInput
                    ref={amountRef}
                    aria-label="Amount"
                    aria-invalid={Boolean(fieldErrors.amount)}
                    aria-describedby={
                      fieldErrors.amount
                        ? "edit-transaction-amount-error"
                        : undefined
                    }
                    className={cn(
                      fieldErrors.amount && "border-destructive",
                    )}
                    value={amount}
                    onValueChange={(value) => {
                      setAmount(value);
                      if (Number(value) > 0)
                        setFieldErrors((current) => ({
                          ...current,
                          amount: undefined,
                        }));
                    }}
                  />
                </FinanceField>
                <FinanceField
                  label="Date"
                  error={fieldErrors.date}
                  errorId="edit-transaction-date-error"
                >
                  <FinanceDatePicker
                    name="edit-date"
                    value={date}
                    onChange={(value) => {
                      setDate(value);
                      if (value)
                        setFieldErrors((current) => ({
                          ...current,
                          date: undefined,
                        }));
                    }}
                  />
                </FinanceField>
                <FinanceField label="Type">
                  <FinanceSelect
                    ariaLabel="Transaction type"
                    value={recordType}
                    onValueChange={(value) =>
                      setRecordType(value as "income" | "expense")
                    }
                    options={[
                      ["expense", "Expense"],
                      ["income", "Income"],
                    ]}
                  />
                </FinanceField>
                <FinanceField
                  label="Account"
                  error={fieldErrors.account}
                  errorId="edit-transaction-account-error"
                >
                  <FinanceSelect
                    ariaLabel="Account"
                    value={accountId}
                    onValueChange={(value) => {
                      setAccountId(value);
                      if (value)
                        setFieldErrors((current) => ({
                          ...current,
                          account: undefined,
                        }));
                    }}
                    options={data.accounts.map((item) => [item.id, item.name])}
                  />
                </FinanceField>
                <FinanceField
                  label="Category"
                  error={fieldErrors.category}
                  errorId="edit-transaction-category-error"
                >
                  <FinanceSelect
                    ariaLabel="Category"
                    value={categoryId}
                    onValueChange={(value) => {
                      setCategoryId(value);
                      if (value)
                        setFieldErrors((current) => ({
                          ...current,
                          category: undefined,
                        }));
                    }}
                    label="Select category"
                    options={data.categories.map((item) => [
                      item.id,
                      item.name,
                    ])}
                  />
                </FinanceField>
                <div className="flex justify-end gap-2 sm:col-span-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={update.isPending}>
                    Save transaction
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end gap-2">
                {record.recordType !== "transfer" ? (
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                ) : null}
                <Button
                  variant="destructive"
                  disabled={archive.isPending}
                  onClick={() => archive.mutate()}
                >
                  Archive
                </Button>
              </div>
            )}
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
