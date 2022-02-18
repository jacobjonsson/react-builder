import { DocumentAddIcon } from "@heroicons/react/outline";
import { ButtonHTMLAttributes } from "react";

interface AddBlockButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function AddBlockButton(props: AddBlockButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className="flex justify-center items-center py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded w-full border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:text-gray-300 dark:focus:ring-text-gray-700"
    >
      <DocumentAddIcon className="w-5 h-5 mr-2" />
      Add block
    </button>
  );
}
