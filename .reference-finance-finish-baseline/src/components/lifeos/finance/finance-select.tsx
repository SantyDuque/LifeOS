import { LifeOSSelect } from "@/components/lifeos/lifeos-select";

export function FinanceSelect({
  value,
  onValueChange,
  options,
  label,
  name,
  className,
  ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<[string, string, boolean?]>;
  label?: string;
  name?: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <LifeOSSelect
      value={value}
      onValueChange={onValueChange}
      options={options.map(([option, optionLabel, disabled]) => ({
        value: option,
        label: optionLabel,
        disabled,
      }))}
      placeholder={label}
      name={name}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}
