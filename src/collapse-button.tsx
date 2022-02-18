import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { ButtonHTMLAttributes } from "react";

interface CollapseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isDragging?: boolean;
  isOverlay?: boolean;
  isCollapsed?: boolean;
}

export function CollapseButton({
  isDragging,
  isOverlay,
  isCollapsed,
  ...rest
}: CollapseButtonProps) {
  return (
    <button type="button" {...rest} className="dark:text-white">
      {isCollapsed ? (
        <ChevronRightIcon className="h-5 w-5" />
      ) : (
        <ChevronDownIcon className="h-5 w-5" />
      )}
    </button>
  );
}
