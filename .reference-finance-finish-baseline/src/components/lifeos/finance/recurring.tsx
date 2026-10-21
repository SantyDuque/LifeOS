import { useState } from "react";
import { CalendarClock, Pencil, Plus, Repeat } from "lucide-react";
import { toast } from "sonner";
import {
  Panel,
  PanelHeader,
  LoadingRows,
  ErrorState,
} from "@/components/lifeos/states";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { FinanceSnapshot } from "@/lib/finance/models";
import {
  FREQUENCIES,
  useRecurringPayments,
  type RecurringInput,
  type RecurringPayment,
} from "@/lib/finance/recurring-payments";
import { CategoryIcon, categoryOf } from "./shared";
import { RecurringPaymentDialog } from "./recurring-payment-dialog";
import { RecurringPayDialog } from "./recurring-pay-dialog";

const money = (amountMinor: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amountMinor / 100,
  );

export function FinanceRecurring({ data }: { data: FinanceSnapshot }) {
  const { query, create, update, remove, pay } = useRecurringPayments();
  const [managing, setManaging] = useState(false);
  const [editing, setEditing] = useState<RecurringPayment | "new">();
  const [deleting, setDeleting] = useState<RecurringPayment>();
  const [paying, setPaying] = useState<RecurringPayment>();
  const [error, setError] = useState("");
  const pending =
    create.isPending || update.isPending || remove.isPending || pay.isPending;
  const payment = editing && editing !== "new" ? editing : undefined;
  const items = (query.data?.items ?? []).filter(
    (item) => managing || (item.status === "ACTIVE" && item.nextOccurrenceDate),
  );
  const success = (message: string) => {
    toast.success(message);
    setEditing(undefined);
    setDeleting(undefined);
    setError("");
  };
  const fail = (e: Error) => setError(e.message);
  const open = (value: RecurringPayment | "new") => {
    setError("");
    setEditing(value);
  };
  const save = (input: RecurringInput) => {
    if (payment)
      update.mutate(
        { id: payment.id, ...input },
        {
          onSuccess: () => success("Recurring payment updated"),
          onError: fail,
        },
      );
    else
      create.mutate(input, {
        onSuccess: () => success("Recurring payment added"),
        onError: fail,
      });
  };
  return (
    <div className="space-y-6 pb-24 lg:pb-20">
      {query.isError ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : null}
      {query.isPending ? (
        <Panel>
          <LoadingRows rows={4} />
        </Panel>
      ) : query.data ? (
        <>
          <Panel>
            <div className="flex items-center gap-4">
              <span className="rounded-md border border-border p-2">
                <Repeat className="size-4 text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Monthly commitment
                </p>
                <p className="num mt-1 text-2xl" data-slot="monthly-commitment">
                  {query.data.monthlyCommitment.length
                    ? query.data.monthlyCommitment
                        .map((total) =>
                          money(total.amountMinor, total.currency),
                        )
                        .join(" + ")
                    : money(
                        0,
                        data.accounts[0]?.balance.currencyCode ?? "USD",
                      )}{" "}
                  / mo
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Active orders</p>
                <p className="num mt-1 text-lg" data-slot="active-orders">
                  {query.data.activeOrders}
                </p>
              </div>
            </div>
          </Panel>
          <Panel>
            <PanelHeader
              title="Upcoming"
              hint="Next expected payments"
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
            <div className="divide-y divide-border">
              {items.length ? (
                items.map((order) => {
                  const category = categoryOf(
                    data.categories,
                    order.categoryRef,
                  );
                  const account = data.accounts.find(
                    (item) => item.id === order.accountRef,
                  );
                  return (
                    <div
                      key={order.id}
                      data-slot="recurring-row"
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3"
                    >
                      <span className="rounded-md border border-border p-2">
                        <CalendarClock className="size-4 text-muted-foreground" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm">{order.name}</p>
                        <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                          <CategoryIcon
                            category={category}
                            className="size-3"
                          />
                          {category.name} ·{" "}
                          {account?.name ?? "Unavailable account"} ·{" "}
                          {FREQUENCIES.find(
                            ([value]) => value === order.frequency,
                          )?.[1].toLowerCase()}
                        </p>
                        {order.status === "PAUSED" ? (
                          <span className="text-xs text-muted-foreground">
                            Paused
                          </span>
                        ) : !order.nextOccurrenceDate ? (
                          <span className="text-xs text-muted-foreground">
                            Ended
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="num">
                            {money(order.amountMinor, order.currency)}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {order.nextOccurrenceDate ?? order.nextPaymentDate}
                          </p>
                        </div>
                        {managing ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground"
                            aria-label={`Edit ${order.name}`}
                            onClick={() => open(order)}
                          >
                            <Pencil />
                          </Button>
                        ) : order.status === "ACTIVE" &&
                          order.nextOccurrenceDate ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setError("");
                              setPaying(order);
                            }}
                          >
                            Pay
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-3 text-sm text-muted-foreground">
                  {managing
                    ? "No recurring payments."
                    : "No upcoming payments."}
                </p>
              )}
            </div>
          </Panel>
        </>
      ) : null}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            data-slot="recurring-fab"
            size="icon"
            className="fixed right-4 bottom-20 z-40 size-12 rounded-full shadow-lg transition-transform active:scale-95 sm:right-6 [&_svg]:size-6 lg:bottom-6"
            aria-label="Recurring payment actions"
          >
            <Repeat />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" sideOffset={8}>
          <DropdownMenuItem disabled={!query.data} onSelect={() => open("new")}>
            <Plus />
            Add recurring payment
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!query.data}
            onSelect={() => setManaging(true)}
          >
            <Pencil />
            Manage recurring payments
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {editing ? (
        <RecurringPaymentDialog
          key={typeof editing === "string" ? editing : editing.id}
          payment={payment}
          data={data}
          pending={pending}
          error={error}
          onClose={() => setEditing(undefined)}
          onSave={save}
          onStatus={() => {
            if (payment)
              update.mutate(
                {
                  id: payment.id,
                  status: payment.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
                },
                {
                  onSuccess: () =>
                    success(
                      payment.status === "ACTIVE"
                        ? "Recurring payment paused"
                        : "Recurring payment resumed",
                    ),
                  onError: fail,
                },
              );
          }}
          onDelete={() => {
            setDeleting(payment);
            setEditing(undefined);
            setError("");
          }}
        />
      ) : null}
      {paying ? (
        <RecurringPayDialog
          key={paying.id + paying.nextOccurrenceDate}
          payment={paying}
          data={data}
          pending={pay.isPending}
          error={error}
          onClose={() => setPaying(undefined)}
          onConfirm={(input) =>
            pay.mutate(
              { id: paying.id, ...input },
              {
                onSuccess: (result) => {
                  toast.success(
                    result.duplicate
                      ? "This occurrence was already recorded"
                      : "Recurring payment recorded",
                  );
                  setPaying(undefined);
                  setError("");
                },
                onError: fail,
              },
            )
          }
        />
      ) : null}
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && !pending && setDeleting(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete recurring payment?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.name} will be removed from recurring commitments.
              Existing transactions will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                deleting &&
                remove.mutate(deleting.id, {
                  onSuccess: () => success("Recurring payment deleted"),
                  onError: fail,
                })
              }
            >
              {pending ? "Deleting…" : "Delete recurring payment"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
