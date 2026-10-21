import { useState } from "react";
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
import type { FinanceBudget } from "@/lib/finance/models";
import { useDeleteFinanceBudget } from "@/lib/queries";

export function DeleteBudgetDialog({
  budget,
  categoryName,
  open,
  onOpenChange,
}: {
  budget?: FinanceBudget;
  categoryName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const remove = useDeleteFinanceBudget();
  const [error, setError] = useState("");
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setError("");
        onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {categoryName} budget?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the budget limit. Existing transactions and the
            category are not deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={!budget || remove.isPending}
            onClick={() => {
              if (!budget) return;
              remove.mutate(budget.id, {
                onSuccess: () => {
                  toast.success("Budget deleted");
                  onOpenChange(false);
                },
                onError: (mutationError) => setError(mutationError.message),
              });
            }}
          >
            Delete budget
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
