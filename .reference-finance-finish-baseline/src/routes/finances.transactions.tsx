import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FinancePageFrame } from "@/components/lifeos/finance/page-frame";
import { FinanceTransactions } from "@/components/lifeos/finance/transactions";
import { AddTransactionFlow } from "@/components/lifeos/finance/add-transaction-flow";
import { BackLink, SecondaryPage } from "@/components/lifeos/secondary-page";
import { useAddFinanceRecord } from "@/lib/queries";

export const Route = createFileRoute("/finances/transactions")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  component: TransactionsPage,
});
function TransactionsPage() {
  const { category } = Route.useSearch();
  const addRecord = useAddFinanceRecord();
  const [showAdd, setShowAdd] = useState(false);
  return (
    <FinancePageFrame
      title="Transactions"
      subtitle="Search and inspect financial activity"
    >
      {(data) => (
        <SecondaryPage>
          <BackLink to="/finances">Finances</BackLink>
          <FinanceTransactions
            data={data}
            records={data.records}
            initialCategory={category ?? ""}
            onAdd={() => setShowAdd(true)}
          />
          <AddTransactionFlow
            open={showAdd}
            onOpenChange={setShowAdd}
            data={data}
            pending={addRecord.isPending}
            onAdd={(record) =>
              addRecord.mutate(record, {
                onSuccess: () => {
                  setShowAdd(false);
                  toast.success("Transaction added");
                },
                onError: (error) => toast.error(error.message),
              })
            }
          />
        </SecondaryPage>
      )}
    </FinancePageFrame>
  );
}
