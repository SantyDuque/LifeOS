import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FinancePageFrame } from "@/components/lifeos/finance/page-frame";
import { FinanceRecurring } from "@/components/lifeos/finance/recurring";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/finances/recurring")({
  component: RecurringPage,
});
function RecurringPage() {
  return (
    <FinancePageFrame
      title="Recurring payments"
      subtitle="Standing orders and upcoming commitments"
    >
      {(data) => (
        <div className="space-y-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/finances">
              <ArrowLeft className="size-3.5" /> Finances
            </Link>
          </Button>
          <FinanceRecurring data={data} />
        </div>
      )}
    </FinancePageFrame>
  );
}
