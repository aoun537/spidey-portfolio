import { useId } from "react";
import { cn } from "@/lib/cn";
import { FIELD_CONTROL } from "@/lib/styles";

type BaseProps = {
  label: string;
  placeholder: string;
  name: string;
  required?: boolean;
};

/** Single-line labelled input. */
export function Field({
  label,
  placeholder,
  name,
  type = "text",
  required = true,
}: BaseProps & { type?: "text" | "email" }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-bold tracking-wider text-gray-600 uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={FIELD_CONTROL}
      />
    </div>
  );
}

/** Multi-line labelled input. */
export function TextAreaField({
  label,
  placeholder,
  name,
  rows = 4,
  required = true,
}: BaseProps & { rows?: number }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-bold tracking-wider text-gray-600 uppercase"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={cn(FIELD_CONTROL, "resize-none")}
      />
    </div>
  );
}
