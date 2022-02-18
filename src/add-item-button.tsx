import { PlusIcon } from "@heroicons/react/outline";
import { ButtonHTMLAttributes } from "react";

interface AddItemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function AddItemButton(props: AddItemButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className="flex justify-center items-center py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded w-full border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:text-gray-300 dark:focus:ring-text-gray-700"
    >
      <PlusIcon className="h-5 w-5 mr-2" />
      Add item
    </button>
  );
}
