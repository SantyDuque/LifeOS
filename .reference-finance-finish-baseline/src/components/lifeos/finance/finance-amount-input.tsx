import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import {
  formatFinanceAmountInput,
  parseFinanceAmountInput,
} from "@/lib/finance/amount-input";

export const FinanceAmountInput = forwardRef<HTMLInputElement, Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
  value: string;
  onValueChange: (value: string) => void;
}>(function FinanceAmountInput({
  value,
  onValueChange,
  ...props
}, ref) {
  return (
    <Input
      {...props}
      ref={ref}
      type="text"
      inputMode="decimal"
      value={formatFinanceAmountInput(value)}
      onChange={(event) =>
        onValueChange(parseFinanceAmountInput(event.target.value))
      }
    />
  );
});
