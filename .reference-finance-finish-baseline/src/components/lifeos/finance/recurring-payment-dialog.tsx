import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FREQUENCIES,
  type RecurringFrequency,
  type RecurringInput,
  type RecurringPayment,
} from "@/lib/finance/recurring-payments";
import type { FinanceSnapshot } from "@/lib/finance/models";
import { FinanceSelect } from "./finance-select";
import { FinanceDatePicker } from "./finance-date-picker";
import { FinanceAmountInput } from "./finance-amount-input";

export function RecurringPaymentDialog({
  payment,
  data,
  pending,
  error,
  onClose,
  onSave,
  onStatus,
  onDelete,
}: {
  payment?: RecurringPayment;
  data: FinanceSnapshot;
  pending: boolean;
  error: string;
  onClose: () => void;
  onSave: (input: RecurringInput) => void;
  onStatus: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(payment?.name ?? "");
  const [amount, setAmount] = useState(
    payment ? String(payment.amountMinor / 100) : "",
  );
  const [currency, setCurrency] = useState(
    payment?.currency ?? data.accounts[0]?.balance.currencyCode ?? "USD",
  );
  const [accountRef, setAccount] = useState(
    payment?.accountRef ?? data.accounts[0]?.id ?? "",
  );
  const [categoryRef, setCategory] = useState(
    payment?.categoryRef ?? data.categories[0]?.id ?? "",
  );
  const [frequency, setFrequency] = useState<RecurringFrequency>(
    payment?.frequency ?? "MONTHLY",
  );
  const [nextPaymentDate, setNextDate] = useState(
    payment?.nextPaymentDate ?? format(new Date(), "yyyy-MM-dd"),
  );
  const [startDate, setStart] = useState(payment?.startDate ?? "");
  const [endDate, setEnd] = useState(payment?.endDate ?? "");
  const [payee, setPayee] = useState(payment?.payee ?? "");
  const [notes, setNotes] = useState(payment?.notes ?? "");
  const [validation, setValidation] = useState("");
  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {payment ? "Edit recurring payment" : "Add recurring payment"}
          </DialogTitle>
          <DialogDescription>
            Plan a financial commitment in LifeOS.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setValidation("");
            const value = Number(amount);
            if (!name.trim()) return setValidation("Name is required.");
            if (
              !Number.isFinite(value) ||
              value <= 0 ||
              value * 100 > 2147483647 ||
              Math.abs(value * 100 - Math.round(value * 100)) > 0.00001
            )
              return setValidation(
                "Enter a positive amount with at most two decimal places.",
              );
            if (!data.accounts.some((a) => a.id === accountRef))
              return setValidation("Select a valid account.");
            if (!data.categories.some((c) => c.id === categoryRef))
              return setValidation("Select a valid category.");
            if (
              !nextPaymentDate ||
              (startDate && nextPaymentDate < startDate) ||
              (endDate && endDate < nextPaymentDate)
            )
              return setValidation(
                "Payment date must fall within the start and end dates.",
              );
            onSave({
              name: name.trim(),
              amountMinor: Math.round(value * 100),
              currency,
              accountRef,
              categoryRef,
              frequency,
              nextPaymentDate,
              startDate: startDate || null,
              endDate: endDate || null,
              payee: payee || null,
              notes: notes || null,
            });
          }}
        >
          <fieldset disabled={pending} className="space-y-4">
            <legend className="mb-3 text-xs tracking-wide text-muted-foreground uppercase">
              Payment details
            </legend>
            <div className="space-y-1.5">
              <Label htmlFor="recurring-name">Name</Label>
              <Input
                id="recurring-name"
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="recurring-amount">Amount</Label>
                <FinanceAmountInput
                  id="recurring-amount"
                  value={amount}
                  onValueChange={setAmount}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <FinanceSelect
                  ariaLabel="Currency"
                  value={currency}
                  onValueChange={setCurrency}
                  options={["USD", "EUR", "GBP", "COP"].map((c) => [c, c])}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Account</Label>
                <FinanceSelect
                  ariaLabel="Account"
                  value={accountRef}
                  label="Select account"
                  onValueChange={setAccount}
                  options={data.accounts.map((a) => [a.id, a.name])}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <FinanceSelect
                  ariaLabel="Category"
                  value={categoryRef}
                  label="Select category"
                  onValueChange={setCategory}
                  options={data.categories.map((c) => [c.id, c.name])}
                />
              </div>
            </div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Schedule
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Frequency</Label>
                <FinanceSelect
                  ariaLabel="Frequency"
                  value={frequency}
                  onValueChange={(v) => setFrequency(v as RecurringFrequency)}
                  options={FREQUENCIES.map(([v, l]) => [v, l])}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Next payment date</Label>
                <div role="group" aria-label="Next payment date">
                  <FinanceDatePicker
                    name="nextPaymentDate"
                    value={nextPaymentDate}
                    onChange={setNextDate}
                  />
                </div>
              </div>
              {(
                [
                  ["Start date", startDate, setStart],
                  ["End date", endDate, setEnd],
                ] as const
              ).map(([label, value, setter]) => (
                <div key={label} className="space-y-1.5">
                  <Label>{label} (optional)</Label>
                  {value ? (
                    <>
                      <FinanceDatePicker
                        name={label}
                        value={value}
                        onChange={setter}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setter("")}
                      >
                        Clear {label.toLowerCase()}
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full"
                      type="button"
                      variant="outline"
                      onClick={() => setter(nextPaymentDate)}
                    >
                      Set {label.toLowerCase()}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recurring-payee">Merchant/payee (optional)</Label>
              <Input
                id="recurring-payee"
                maxLength={120}
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recurring-notes">Notes (optional)</Label>
              <Textarea
                id="recurring-notes"
                maxLength={1000}
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            {validation || error ? (
              <p role="alert" className="text-sm text-destructive">
                {validation || error}
              </p>
            ) : null}
            {payment ? (
              <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onStatus}
                >
                  {payment.status === "ACTIVE"
                    ? "Pause recurring payment"
                    : "Resume recurring payment"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={onDelete}
                >
                  Delete recurring payment
                </Button>
              </div>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {pending
                  ? "Saving…"
                  : payment
                    ? "Save changes"
                    : "Add recurring payment"}
              </Button>
            </DialogFooter>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
