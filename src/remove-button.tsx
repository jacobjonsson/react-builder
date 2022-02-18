import { XIcon } from "@heroicons/react/outline";
import { ButtonHTMLAttributes } from "react";

interface RemoveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isDragging?: boolean;
  isOverlay?: boolean;
}

export function RemoveButton({
  isDragging,
  isOverlay,
  ...rest
}: RemoveButtonProps) {
  return (
    <button type="button" {...rest} className="dark:text-white">
      <XIcon className="h-5 w-5" />
    </button>
  );
}
