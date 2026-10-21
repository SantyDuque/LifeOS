import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Bus,
  Clapperboard,
  CreditCard,
  HeartPulse,
  House,
  Landmark,
  PiggyBank,
  Receipt,
  Repeat,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  Wallet,
} from "lucide-react";
import type {
  FinanceAccountType,
  FinanceCategory,
  Money,
} from "@/lib/finance/models";
import { formatMoney } from "@/lib/finance/selectors";
import { cn } from "@/lib/utils";

export const moneyValueClass = (value: number) =>
  value < 0 ? "text-danger" : undefined;

const categoryIcons: Record<string, LucideIcon> = {
  housing: House,
  groceries: ShoppingCart,
  transport: Bus,
  dining: Utensils,
  health: HeartPulse,
  subscriptions: Repeat,
  entertainment: Clapperboard,
  income: Banknote,
  transfer: Receipt,
  shopping: ShoppingBag,
};
const accountIcons: Record<FinanceAccountType, LucideIcon> = {
  checking: Landmark,
  savings: PiggyBank,
  credit: CreditCard,
  cash: Banknote,
  investment: Wallet,
};
export function CategoryIcon({
  category,
  className,
}: {
  category: FinanceCategory;
  className?: string;
}) {
  const Icon = categoryIcons[category.id] ?? Receipt;
  return <Icon className={cn("size-4 text-muted-foreground", className)} />;
}
export function AccountIcon({
  type,
  className,
}: {
  type: FinanceAccountType;
  className?: string;
}) {
  const Icon = accountIcons[type];
  return <Icon className={cn("size-4 text-muted-foreground", className)} />;
}
export function MoneyText({
  money,
  signed,
  className,
}: {
  money: Money;
  signed?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("num", moneyValueClass(money.value), className)}>
      {formatMoney(money, signed)}
    </span>
  );
}
export function BudgetProgress({
  spent,
  limit,
}: {
  spent: Money;
  limit: Money;
}) {
  const percentage = limit.value
    ? Math.round((spent.value / limit.value) * 100)
    : 0;
  const state =
    percentage > 100
      ? "Over budget"
      : percentage >= 80
        ? "Approaching limit"
        : "On track";
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-3 text-xs">
        <span
          className={
            percentage > 100 ? "text-warning" : "text-muted-foreground"
          }
        >
          {state}
        </span>
        <span className="num text-muted-foreground">{percentage}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full",
            percentage > 100
              ? "bg-warning"
              : percentage >= 80
                ? "bg-primary"
                : "bg-success",
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
export const categoryOf = (categories: FinanceCategory[], id: string) =>
  categories.find((category) => category.id === id) ?? {
    id,
    name: "Uncategorized",
  };
