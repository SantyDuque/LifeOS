import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type {
  FinanceAccount,
  FinanceAccountReference,
} from "@/lib/finance/models";
import {
  getFinanceAccountReferences,
  useDeleteFinanceAccount,
} from "@/lib/queries";

export function DeleteAccountDialog({
  account,
  open,
  onOpenChange,
  onDeleted,
}: {
  account?: FinanceAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}) {
  const remove = useDeleteFinanceAccount();
  const [references, setReferences] = useState<FinanceAccountReference[]>();
  const [confirmedReferences, setConfirmedReferences] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !account) return;
    setReferences(undefined);
    setConfirmedReferences(false);
    setError("");
    getFinanceAccountReferences(account.id)
      .then(setReferences)
      .catch((referenceError: Error) =>
        setError(
          referenceError.message || "Wallet references could not be checked.",
        ),
      );
  }, [account, open]);

  const hasReferences = Boolean(references?.length);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete account?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                “{account?.name ?? "This account"}” will be removed from Wallet
                and LifeOS. This action cannot be undone.
              </p>
              {references === undefined && !error ? (
                <p>Checking Wallet references…</p>
              ) : null}
              {hasReferences ? (
                <div className="rounded-md border border-warning/30 bg-warning/10 p-3 text-foreground">
                  <p className="font-medium">
                    This account is currently referenced by:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {references?.map((reference) => (
                      <li key={reference.type}>
                        {reference.total} {reference.type}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-muted-foreground">
                    Deleting it may affect related Wallet financial data.
                  </p>
                </div>
              ) : null}
              {hasReferences && confirmedReferences ? (
                <p className="font-medium text-destructive">
                  Confirm once more to permanently delete this referenced
                  account.
                </p>
              ) : null}
              {error ? (
                <p className="text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {hasReferences && !confirmedReferences ? (
            <Button
              variant="destructive"
              onClick={() => setConfirmedReferences(true)}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="destructive"
              disabled={
                !account ||
                references === undefined ||
                Boolean(error) ||
                remove.isPending
              }
              onClick={() => {
                if (!account) return;
                remove.mutate(account.id, {
                  onSuccess: () => {
                    toast.success("Account deleted");
                    onDeleted();
                    onOpenChange(false);
                  },
                  onError: (mutationError) => setError(mutationError.message),
                });
              }}
            >
              Delete account
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
