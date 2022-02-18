import { PencilAltIcon } from "@heroicons/react/outline";
import { ButtonHTMLAttributes } from "react";

interface EditButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isDragging?: boolean;
  isOverlay?: boolean;
}

export function EditButton({
  isDragging,
  isOverlay,
  ...rest
}: EditButtonProps) {
  return (
    <button type="button" {...rest} className="dark:text-white">
      <PencilAltIcon className="h-5 w-5" />
    </button>
  );
}
