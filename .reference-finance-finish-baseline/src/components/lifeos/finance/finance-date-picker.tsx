import { LifeOSDatePicker } from "@/components/lifeos/lifeos-date-picker";

export function FinanceDatePicker({
  value,
  onChange,
  name,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  name: string;
  ariaLabel?: string;
}) {
  return (
    <LifeOSDatePicker
      value={value}
      onChange={onChange}
      name={name}
      ariaLabel={ariaLabel}
    />
  );
}
