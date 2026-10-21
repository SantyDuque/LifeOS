import { useState } from "react";
import { Pencil, Plus, SlidersHorizontal } from "lucide-react";
import { Panel, PanelHeader } from "@/components/lifeos/states";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FinanceBudget, FinanceSnapshot } from "@/lib/finance/models";
import { formatMoney, sumMoney } from "@/lib/finance/selectors";
import { BudgetProgress, CategoryIcon, categoryOf } from "./shared";
import { BudgetDialog } from "./budget-dialog";
import { DeleteBudgetDialog } from "./delete-budget-dialog";
import { getDataSource } from "@/lib/api";

export function FinanceBudgets({ data }: { data: FinanceSnapshot }) {
  const [creating, setCreating] = useState(false);
  const [managing, setManaging] = useState(false);
  const [editing, setEditing] = useState<FinanceBudget>();
  const [deleting, setDeleting] = useState<FinanceBudget>();
  const limits = sumMoney(data.budgets.map((budget) => budget.limit));
  const spent = sumMoney(data.budgets.map((budget) => budget.spent));
  const remaining =
    limits && spent ? { ...limits, value: limits.value - spent.value } : null;
  const deletingCategory = deleting
    ? categoryOf(data.categories, deleting.categoryId).name
    : "Category";

  return (
    <div className="space-y-6">
      {data.budgets.length ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["Total budgeted", limits],
              ["Spent", spent],
              ["Remaining", remaining],
            ].map(([label, money]) => (
              <div key={String(label)} className="panel px-4 py-3">
                <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                  {String(label)}
                </p>
                <p className="num mt-1.5 text-xl">
                  {money && typeof money !== "string"
                    ? formatMoney(money)
                    : "Multiple currencies"}
                </p>
              </div>
            ))}
          </div>
          <Panel className="mb-0">
            <PanelHeader
              title="Category budgets"
              hint={getDataSource() === "api" ? "Saved monthly category budgets" : "Current period compared with last month"}
              action={
                managing ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setManaging(false)}
                  >
                    Done
                  </Button>
                ) : undefined
              }
            />
            <div className="grid gap-5 lg:grid-cols-2">
              {data.budgets.map((budget) => {
                const category = categoryOf(data.categories, budget.categoryId);
                const left = budget.limit.value - budget.spent.value;
                const delta = budget.previousSpent.value
                  ? Math.round(
                      ((budget.spent.value - budget.previousSpent.value) /
                        budget.previousSpent.value) *
                        100,
                    )
                  : 0;
                return (
                  <div
                    key={budget.id}
                    data-slot="budget-card"
                    className="relative rounded-md border border-border p-4"
                  >
                    <div
                      className={
                        managing
                          ? "mb-3 flex items-center gap-2 pr-8"
                          : "mb-3 flex items-center gap-2"
                      }
                    >
                      <CategoryIcon category={category} />
                      <p className="flex-1 text-sm">{category.name}</p>
                      {getDataSource() === "api" && budget.startDate ? <span className="text-xs text-muted-foreground">{budget.startDate.slice(0, 7)}</span> : null}
                      <span className="num text-xs text-muted-foreground">
                        {formatMoney(budget.spent)} /{" "}
                        {formatMoney(budget.limit)}
                      </span>
                    </div>
                    <BudgetProgress spent={budget.spent} limit={budget.limit} />
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>
                        {left >= 0
                          ? `${formatMoney({ ...budget.limit, value: left })} remaining`
                          : `${formatMoney({ ...budget.limit, value: Math.abs(left) })} over`}
                      </span>
                      <span>
                        {delta > 0 ? "+" : ""}
                        {delta}% vs last month
                      </span>
                    </div>
                    {managing ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 size-7 text-muted-foreground hover:text-foreground"
                        aria-label={`Edit ${category.name} budget`}
                        onClick={() => setEditing(budget)}
                      >
                        <Pencil />
                      </Button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Panel>
        </>
      ) : (
        <Panel>
          <PanelHeader title="Budgets" />
          <p className="text-sm text-muted-foreground">
            No budgets configured.
          </p>
        </Panel>
      )}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            data-slot="budget-fab"
            size="icon"
            className="fixed right-4 bottom-20 z-40 size-12 rounded-full shadow-lg transition-transform active:scale-95 sm:right-6 [&_svg]:size-6 lg:bottom-6"
            aria-label="Manage budgets"
          >
            <SlidersHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="end"
          sideOffset={8}
          className="min-w-44"
        >
          <DropdownMenuItem onSelect={() => setCreating(true)}>
            <Plus /> Create budget
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!data.budgets.length}
            onSelect={() => setManaging(true)}
          >
            <Pencil /> Edit budgets
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BudgetDialog
        open={creating}
        onOpenChange={setCreating}
        categories={data.categories}
        unavailableCategoryIds={data.budgets.map((budget) => budget.categoryId)}
      />
      <BudgetDialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(undefined)}
        budget={editing}
        categories={data.categories}
        onRequestDelete={() => {
          setDeleting(editing);
          setEditing(undefined);
        }}
      />
      <DeleteBudgetDialog
        budget={deleting}
        categoryName={deletingCategory}
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
      />
    </div>
  );
}
