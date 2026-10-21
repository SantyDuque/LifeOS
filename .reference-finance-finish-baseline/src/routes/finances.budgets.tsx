import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FinancePageFrame } from "@/components/lifeos/finance/page-frame";
import { FinanceBudgets } from "@/components/lifeos/finance/budgets";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/finances/budgets")({
  component: BudgetsPage,
});
function BudgetsPage() {
  return (
    <FinancePageFrame
      title="Budgets"
      subtitle="Limits, remaining room and monthly movement"
    >
      {(data) => (
        <div className="space-y-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/finances">
              <ArrowLeft className="size-3.5" /> Finances
            </Link>
          </Button>
          <FinanceBudgets data={data} />
        </div>
      )}
    </FinancePageFrame>
  );
}
