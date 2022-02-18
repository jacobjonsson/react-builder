import clsx from "clsx";
import { LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ children, className, ...rest }: LabelProps) {
  return (
    <label
      {...rest}
      className={clsx(
        "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300",
        className
      )}
    >
      {children}
    </label>
  );
}
