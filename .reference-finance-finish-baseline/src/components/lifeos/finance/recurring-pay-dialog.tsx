import { useState } from "react";
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
import type { FinanceSnapshot } from "@/lib/finance/models";
import type {
  RecurringPayment,
  RecurringPaymentRegistration,
} from "@/lib/finance/recurring-payments";
import { FinanceAmountInput } from "./finance-amount-input";
import { FinanceDatePicker } from "./finance-date-picker";
import { FinanceField } from "./finance-field";
import { FinanceSelect } from "./finance-select";

export function RecurringPayDialog({
  payment,
  data,
  pending,
  error,
  onClose,
  onConfirm,
}: {
  payment: RecurringPayment;
  data: FinanceSnapshot;
  pending: boolean;
  error: string;
  onClose: () => void;
  onConfirm: (input: RecurringPaymentRegistration) => void;
}) {
  const [amount, setAmount] = useState(String(payment.amountMinor / 100));
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [accountId, setAccountId] = useState(payment.accountRef);
  const [categoryId, setCategoryId] = useState(payment.categoryRef);
  const [description, setDescription] = useState(payment.payee || payment.name);
  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record recurring payment</DialogTitle>
          <DialogDescription>
            This records a LifeOS transaction. It does not initiate a bank or
            card payment.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm({
              dueDate: payment.nextOccurrenceDate!,
              paymentDate: date,
              amountMinor: Math.round(Number(amount) * 100),
              currency: payment.currency,
              accountId,
              categoryId,
              description: description.trim(),
            });
          }}
        >
          <FinanceField label="Description">
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              maxLength={500}
            />
          </FinanceField>
          <FinanceField label="Amount">
            <FinanceAmountInput
              value={amount}
              onValueChange={setAmount}
              required
            />
          </FinanceField>
          <FinanceField label="Payment date">
            <FinanceDatePicker
              name="paymentDate"
              value={date}
              onChange={setDate}
            />
          </FinanceField>
          <FinanceField label="Currency">
            <Input value={payment.currency} disabled />
          </FinanceField>
          <FinanceField label="Account">
            <FinanceSelect
              value={accountId}
              onValueChange={setAccountId}
              options={data.accounts.map((item) => [item.id, item.name])}
            />
          </FinanceField>
          <FinanceField label="Category">
            <FinanceSelect
              value={categoryId}
              onValueChange={setCategoryId}
              options={data.categories.map((item) => [item.id, item.name])}
            />
          </FinanceField>
          {error ? (
            <p role="alert" className="text-sm text-destructive sm:col-span-2">
              {error}
            </p>
          ) : null}
          <DialogFooter className="sm:col-span-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                pending ||
                !payment.nextOccurrenceDate ||
                !accountId ||
                !categoryId ||
                !description.trim() ||
                !Number(amount)
              }
            >
              {pending ? "Recording…" : "Record as paid"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
