import { FormField } from "@/components/lifeos/form-field";

export function FinanceField({
  label,
  children,
  className,
  error,
  errorId,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
  errorId?: string;
}) {
  return <FormField label={label} className={className} error={error}>{children}{errorId ? <span id={errorId} className="sr-only">{error}</span> : null}</FormField>;
}
