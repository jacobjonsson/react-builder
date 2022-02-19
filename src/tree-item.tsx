import { forwardRef, HTMLAttributes } from "react";
import { WorkoutData } from "./types";
import clsx from "clsx";
import { HandleButton, HandleButtonProps } from "./handle-button";
import { RemoveButton } from "./remove-button";
import { DuplicateButton } from "./duplicate-button";
import { EditButton } from "./edit-button";
import { CollapseButton } from "./collapse-button";

export interface TreeItemProps extends HTMLAttributes<HTMLDivElement> {
  depth: number;
  handleProps?: HandleButtonProps;
  data: WorkoutData;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  isDragging?: boolean;
  isOverlay?: boolean;
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
      isCollapsible,
      isCollapsed,
      data,
      depth,
      style,
      isDragging,
      isOverlay: overlay,
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
        style={{ paddingLeft: `${32 * depth}px`, ...style }}
        {...rest}
      >
        <div
          ref={ref}
          className={clsx(
            "flex items-center justify-between border border-gray-300 p-4 rounded bg-white touch-none select-none dark:bg-gray-900",
            isDragging && "opacity-50",
            overlay && "shadow-2xl"
          )}
        >
          <div className="flex gap-2">
            <HandleButton
              {...handleProps}
              isDragging={isDragging}
              isOverlay={overlay}
            />

            {isCollapsible && (
              <CollapseButton isCollapsed={isCollapsed} onClick={onCollapse} />
            )}

            <div className="dark:text-white">
              {data.type === "EXERCISE" ? (
                <ExerciseDataDisplay data={data} />
              ) : data.type === "REPEAT" ? (
                <RepeatDataDisplay data={data} />
              ) : data.type === "REST" ? (
                <RestDataDisplay data={data} />
              ) : null}
            </div>
          </div>

          <div className="flex gap-2">
            <EditButton onClick={onEdit} />
            <DuplicateButton onClick={onDuplicate} />
            <RemoveButton onClick={onRemove} />
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
