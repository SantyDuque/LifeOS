import { useEffect, useRef, useState } from "react";
import type { FinanceAccount, FinanceRecord, FinanceSnapshot } from "@/lib/finance/models";
import { AccountDialog } from "./account-dialog";
import { AddTransactionDialog } from "./transaction-dialog";

export function AddTransactionFlow({ open, onOpenChange, data, pending, onAdd }: { open: boolean; onOpenChange: (open: boolean) => void; data: FinanceSnapshot; pending: boolean; onAdd: (record: Omit<FinanceRecord, "id">) => void }) {
  const [accountRequired, setAccountRequired] = useState(false);
  const [preferredAccountId, setPreferredAccountId] = useState<string>();
  const continuing = useRef(false);
  useEffect(() => {
    if (!open) { setAccountRequired(false); return; }
    setAccountRequired(data.accounts.length === 0);
  }, [data.accounts.length, open]);
  const created = (account: FinanceAccount) => {
    continuing.current = true;
    setPreferredAccountId(account.id);
  };
  useEffect(() => {
    if (!open || !continuing.current || data.accounts.length === 0) return;
    continuing.current = false;
    setAccountRequired(false);
  }, [data.accounts.length, open]);
  return <><AccountDialog open={open && accountRequired} onOpenChange={(next) => { if (!next && !continuing.current) onOpenChange(false); }} intro="Transactions need an account so LifeOS knows where the money belongs." onSaved={created} /><AddTransactionDialog open={open && !accountRequired && data.accounts.length > 0} onOpenChange={onOpenChange} data={data} preferredAccountId={preferredAccountId} pending={pending} onAdd={onAdd} /></>;
}
