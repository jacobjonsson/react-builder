import { DuplicateIcon } from "@heroicons/react/outline";
import { ButtonHTMLAttributes } from "react";

interface DuplicateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isDragging?: boolean;
  isOverlay?: boolean;
}

export function DuplicateButton({
  isDragging,
  isOverlay,
  ...rest
}: DuplicateButtonProps) {
  return (
    <button type="button" {...rest} className="dark:text-white">
      <DuplicateIcon className="h-5 w-5" />
    </button>
  );
}
