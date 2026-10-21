import { useEffect, useState } from "react";
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
  FinanceAccount,
  WalletCreatableAccountType,
} from "@/lib/finance/models";
import { WALLET_CREATABLE_ACCOUNT_TYPES } from "@/lib/finance/models";
import { getDataSource } from "@/lib/api";
import { FinanceAmountInput } from "./finance-amount-input";
import {
  useCreateFinanceAccount,
  useUpdateFinanceAccount,
} from "@/lib/queries";

const TYPE_LABELS: Record<WalletCreatableAccountType, string> = {
  General: "General",
  Cash: "Cash",
  CurrentAccount: "Checking / current",
  SavingAccount: "Savings",
  Insurance: "Insurance",
};

const walletTypeOf = (account: FinanceAccount): WalletCreatableAccountType => {
  if (
    account.walletAccountType &&
    WALLET_CREATABLE_ACCOUNT_TYPES.includes(
      account.walletAccountType as WalletCreatableAccountType,
    )
  ) {
    return account.walletAccountType as WalletCreatableAccountType;
  }
  if (account.type === "cash") return "Cash";
  if (account.type === "savings") return "SavingAccount";
  return "CurrentAccount";
};

export function AccountDialog({
  open,
  onOpenChange,
  account,
  intro,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: FinanceAccount;
  intro?: string;
  onSaved?: (account: FinanceAccount) => void;
}) {
  const create = useCreateFinanceAccount();
  const update = useUpdateFinanceAccount();
  const [name, setName] = useState("");
  const [accountType, setAccountType] =
    useState<WalletCreatableAccountType>("CurrentAccount");
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");
  const [balance, setBalance] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(account?.name ?? "");
    setAccountType(account ? walletTypeOf(account) : "CurrentAccount");
    setCurrencyCode(account?.balance.currencyCode ?? "USD");
    setBalance(account ? String(account.initialBalance?.value ?? "") : "0");
    setError("");
  }, [account, open]);

  const pending = create.isPending || update.isPending;
  const apiMode = getDataSource() === "api";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const cleanName = name.trim();
            const numericBalance = balance === "" ? undefined : Number(balance);
            if (!cleanName) return setError("Account name is required.");
            if (cleanName.length > 80)
              return setError("Account name must be 80 characters or fewer.");
            if (!apiMode && !account && numericBalance === undefined)
              return setError("Initial balance is required.");
            if (
              numericBalance !== undefined &&
              !Number.isFinite(numericBalance)
            )
              return setError("Enter a valid balance.");

            const options = {
              onSuccess: (saved: FinanceAccount) => {
                toast.success(account ? "Account updated" : "Account created");
                onSaved?.(saved);
                onOpenChange(false);
              },
              onError: (mutationError: Error) =>
                setError(
                  mutationError.message ||
                    "Wallet could not save this account.",
                ),
            };
            if (account) {
              update.mutate(
                {
                  id: account.id,
                  name: cleanName,
                  initialBalance: apiMode ? undefined : numericBalance,
                },
                options,
              );
            } else {
              create.mutate(
                {
                  name: cleanName,
                  accountType,
                  currencyCode,
                  initialBalance: apiMode ? 0 : numericBalance!,
                },
                options,
              );
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {account ? "Edit account" : "Add account"}
            </DialogTitle>
            <DialogDescription>
              {apiMode
                ? account
                  ? "Update your finance account."
                  : (intro ??
                    "Create an account to start tracking transactions.")
                : account
                  ? "Update the fields Wallet permits for this account."
                  : (intro ??
                    "Create an account in Wallet and make it available in LifeOS.")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <Label htmlFor="account-name">Account name</Label>
              <Input
                id="account-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                autoFocus
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="account-type">Account type</Label>
                <Select
                  value={accountType}
                  onValueChange={(value) =>
                    setAccountType(value as WalletCreatableAccountType)
                  }
                  disabled={Boolean(account)}
                >
                  <SelectTrigger id="account-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WALLET_CREATABLE_ACCOUNT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-currency">Currency</Label>
                <Select
                  value={currencyCode}
                  onValueChange={(value) =>
                    setCurrencyCode(value as CurrencyCode)
                  }
                  disabled={Boolean(account)}
                >
                  <SelectTrigger id="account-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["USD", "EUR", "GBP", "COP"] as const).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!apiMode ? (
              <div className="grid gap-2">
                <Label htmlFor="account-balance">
                  Initial balance{account ? " (optional)" : ""}
                </Label>
                <FinanceAmountInput
                  id="account-balance"
                  value={balance}
                  onValueChange={setBalance}
                />
              </div>
            ) : null}
            {account && !apiMode ? (
              <p className="text-xs text-muted-foreground">
                Wallet does not allow account type or currency to be changed
                after creation.
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {account ? "Save changes" : "Create account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
