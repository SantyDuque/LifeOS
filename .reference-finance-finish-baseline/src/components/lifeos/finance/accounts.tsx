import { useState, type ReactNode } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Panel, PanelHeader } from "@/components/lifeos/states";
import type { FinanceAccount, FinanceSnapshot } from "@/lib/finance/models";
import { accountBalance, formatMoney } from "@/lib/finance/selectors";
import {
  AccountIcon,
  CategoryIcon,
  MoneyText,
  categoryOf,
  moneyValueClass,
} from "./shared";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountDialog } from "./account-dialog";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function FinanceAccounts({
  data,
  leadingAction,
  startCreating = false,
}: {
  data: FinanceSnapshot;
  leadingAction?: ReactNode;
  startCreating?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [editor, setEditor] = useState<FinanceAccount | "new" | null>(startCreating ? "new" : null);
  const [deleting, setDeleting] = useState<FinanceAccount>();
  const total = accountBalance(data.accounts);
  const accountRecords = selected
    ? data.records.filter((record) => record.accountId === selected)
    : [];
  return (
    <div className="space-y-6 pb-24 lg:pb-20">
      {leadingAction ? (
        <div className="flex items-center">{leadingAction}</div>
      ) : null}
      <Panel>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Net worth (liquid)</p>
            <p className={cn("num mt-1 text-2xl", total && moneyValueClass(total.value))}>
              {total ? formatMoney(total) : "Multiple currencies"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Original account currencies preserved
          </p>
        </div>
      </Panel>
      {data.accounts.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {data.accounts.map((account) => {
            const active = selected === account.id;
            const count = data.records.filter(
              (record) => record.accountId === account.id,
            ).length;
            return (
              <div
                key={account.id}
                data-slot="account-card"
                className={cn(
                  "panel relative transition-colors hover:border-border-strong",
                  active && "border-primary/50",
                )}
              >
                <button
                  type="button"
                  className="h-full w-full p-5 text-left"
                  onClick={() => setSelected(active ? null : account.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="rounded-md border border-border p-2">
                      <AccountIcon type={account.type} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {account.type} · {account.balance.currencyCode}
                      </p>
                    </div>
                    <MoneyText
                      money={account.balance}
                      className="text-lg"
                    />
                  </div>
                  <p className="mt-4 pr-10 text-xs text-muted-foreground">
                    {count} transactions
                  </p>
                </button>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 bottom-3 size-8 text-muted-foreground hover:text-foreground"
                      aria-label={`Manage ${account.name}`}
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setEditor(account)}>
                      <Pencil /> Edit account
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => setDeleting(account)}
                    >
                      <Trash2 /> Delete account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      ) : (
        <Panel>
          <p className="text-sm text-muted-foreground">
            No accounts available.
          </p>
        </Panel>
      )}
      {selected ? (
        <Panel>
          <PanelHeader
            title={`Recent · ${data.accounts.find((account) => account.id === selected)?.name ?? "Account"}`}
          />
          {accountRecords.length ? (
            <div className="divide-y divide-border">
              {accountRecords.slice(0, 8).map((record) => {
                const category = categoryOf(data.categories, record.categoryId);
                return (
                  <div key={record.id} className="flex items-center gap-3 py-3">
                    <CategoryIcon category={category} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{record.counterparty}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.date} · {category.name}
                      </p>
                    </div>
                    <MoneyText
                      money={record.amount}
                      signed
                      className={
                        record.recordType === "income" ? "text-success" : ""
                      }
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No transactions for this account.
            </p>
          )}
        </Panel>
      ) : null}
      <AccountDialog
        open={editor !== null}
        onOpenChange={(open) => !open && setEditor(null)}
        account={editor && editor !== "new" ? editor : undefined}
      />
      <DeleteAccountDialog
        account={deleting}
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        onDeleted={() => {
          if (selected === deleting?.id) setSelected(null);
        }}
      />
      <Button
        data-slot="account-fab"
        className="fixed right-4 bottom-20 z-40 h-12 rounded-full px-5 shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98] sm:right-6 lg:bottom-6"
        onClick={() => setEditor("new")}
        aria-label="Add account"
      >
        <Plus className="size-5" />
        Add account
      </Button>
    </div>
  );
}
