import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/lifeos/app-shell";
import { ErrorState } from "@/components/lifeos/states";
import { ModuleDashboardSkeleton } from "@/components/lifeos/loading";
import { financesQuery } from "@/lib/queries";
import type { FinanceSnapshot } from "@/lib/finance/models";

export function FinancePageFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: (data: FinanceSnapshot) => ReactNode;
}) {
  const finance = useQuery(financesQuery);
  return (
    <AppShell title={title} subtitle={subtitle}>
      {finance.isPending ? (
        <ModuleDashboardSkeleton />
      ) : finance.isError ? (
        <ErrorState error={finance.error} onRetry={() => finance.refetch()} />
      ) : (
        children(finance.data)
      )}
    </AppShell>
  );
}
