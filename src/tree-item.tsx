import { forwardRef, HTMLAttributes } from "react";
import {
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PencilAltIcon,
  DuplicateIcon,
} from "@heroicons/react/outline";
import { WorkoutData } from "./types";
import clsx from "clsx";

export interface TreeItemProps extends HTMLAttributes<HTMLDivElement> {
  clone?: boolean;
  ghost?: boolean;
  depth: number;
  handleProps?: HTMLAttributes<HTMLButtonElement>;
  data: WorkoutData;
  collapsible?: boolean;
  collapsed?: boolean;
  onDuplicate?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  onCollapse?: () => void;
  wrapperRef?(node: HTMLDivElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      handleProps,
      wrapperRef,
      collapsible,
      collapsed,
      data,
      depth,
      style,
      ghost,
      clone,
      onEdit,
      onDuplicate,
      onRemove,
      onCollapse,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={wrapperRef}
        style={{ paddingLeft: `${50 * depth}px`, ...style }}
        {...rest}
      >
        <div
          ref={ref}
          className={clsx(
            "flex items-center justify-between border border-gray-300 p-4 rounded bg-white touch-none select-none",
            ghost && "opacity-50",
            clone && "shadow-2xl"
          )}
        >
          <div className="flex gap-2">
            <button type="button" {...handleProps} className="cursor-grab">
              <svg viewBox="0 0 20 20" width="12">
                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
              </svg>
            </button>

            {collapsible && (
              <button className="h-5 w-5" type="button" onClick={onCollapse}>
                {collapsed ? (
                  <ChevronRightIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </button>
            )}

            <span>
              {data.type === "EXERCISE" ? (
                <ExerciseDataDisplay data={data} />
              ) : data.type === "REPEAT" ? (
                <RepeatDataDisplay data={data} />
              ) : data.type === "REST" ? (
                <RestDataDisplay data={data} />
              ) : null}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="h-5 w-5 " type="button" onClick={onEdit}>
              <PencilAltIcon className="h-5 w-5" />
            </button>

            <button className="h-5 w-5 " type="button" onClick={onDuplicate}>
              <DuplicateIcon className="h-5 w-5" />
            </button>

            <button className="h-5 w-5 " type="button" onClick={onRemove}>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

TreeItem.displayName = "TreeItem";

interface ExerciseDataDisplayProps {
  data: Extract<WorkoutData, { type: "EXERCISE" }>;
}

function ExerciseDataDisplay({ data }: ExerciseDataDisplayProps) {
  let scoring = "";
  switch (data.scoring.type) {
    case "CALORIES": {
      scoring = `${data.scoring.calories} calories`;
      break;
    }

    case "DISTANCE": {
      scoring = `${data.scoring.distance} ${data.scoring.metric}`;
      break;
    }

    case "REPS": {
      scoring = `${data.scoring.reps} reps`;
      break;
    }
  }
  return (
    <>
      {data.exercise} for {scoring}
    </>
  );
}

interface RepeatDataDisplayProps {
  data: Extract<WorkoutData, { type: "REPEAT" }>;
}

function RepeatDataDisplay({ data }: RepeatDataDisplayProps) {
  let repeat = "";
  switch (data.repeat.type) {
    case "ROUNDS":
      repeat = `for ${data.repeat.rounds} rounds`;
      break;

    case "TIME":
      repeat = `for ${data.repeat.time} minutes`;
      break;

    case "EMOM":
      repeat = `every ${data.repeat.time} seconds for ${data.repeat.rounds} rounds`;
      break;
  }
  return <>Repeat {repeat}</>;
}

interface RestDataDisplayProps {
  data: Extract<WorkoutData, { type: "REST" }>;
}

function RestDataDisplay({ data }: RestDataDisplayProps) {
  return <>Rest for {data.duration} seconds</>;
}
