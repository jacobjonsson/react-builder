import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export interface SecondaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function SecondaryButton({
  className,
  children,
  ...rest
}: SecondaryButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
        className
      )}
    >
      {children}
    </button>
  );
}
