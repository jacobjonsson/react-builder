import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export interface HandleButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isDragging?: boolean;
  isOverlay?: boolean;
}

export function HandleButton({
  isDragging,
  isOverlay,
  ...rest
}: HandleButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={clsx(
        "cursor-grab dark:text-white",
        isDragging && "cursor-grabbing",
        isOverlay && "cursor-grabbing"
      )}
    >
      <svg viewBox="0 0 20 20" width="12" fill="currentColor" stroke="none">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
    </button>
  );
}
