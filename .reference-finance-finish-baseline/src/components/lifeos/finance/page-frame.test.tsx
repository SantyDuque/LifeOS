import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import type { FinanceSnapshot } from "@/lib/finance/models";
import { buildFinanceFixture } from "@/lib/finance/fixtures";
import { FinancePageFrame } from "./page-frame";
import { DesktopFinanceOverview } from "./overview-desktop";
const state = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@/lib/queries", () => ({
  financesQuery: {
    queryKey: ["finance-frame-test"],
    queryFn: () => state.fetch(),
  },
}));
vi.mock("@/components/lifeos/app-shell", () => ({
  AppShell: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));
vi.mock("./cash-flow-chart", () => ({ CashFlowChart: () => <div /> }));
afterEach(cleanup);
it("shows loading rather than invented totals until the real snapshot resolves", async () => {
  let resolve!: (data: FinanceSnapshot) => void;
  state.fetch.mockReturnValue(
    new Promise<FinanceSnapshot>((done) => {
      resolve = done;
    }),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <FinancePageFrame title="Finances" subtitle="Overview">
        {(data) => (
          <DesktopFinanceOverview
            data={data}
            period="Last 30 days"
            onPeriodChange={vi.fn()}
            onCategory={vi.fn()}
            onTransactions={vi.fn()}
            onAdd={vi.fn()}
          />
        )}
      </FinancePageFrame>
    </QueryClientProvider>,
  );
  expect(screen.getByRole("status", { name: "Loading module" })).toBeVisible();
  expect(
    screen.queryByRole("region", { name: "Financial totals" }),
  ).not.toBeInTheDocument();
  resolve(buildFinanceFixture());
  expect(
    await screen.findByRole("region", { name: "Financial totals" }),
  ).toHaveTextContent("$26,460.00");
  expect(state.fetch).toHaveBeenCalledOnce();
  client.clear();
});
