import { LifeOSDatePicker } from "@/components/lifeos/lifeos-date-picker";

export function FinanceDatePicker({
  value,
  onChange,
  name,
}: {
  value: string;
  onChange: (value: string) => void;
  name: string;
}) {
  return <LifeOSDatePicker value={value} onChange={onChange} name={name} />;
}
