import type { MutableRefObject } from "react";

export interface TreeItem {
  id: string;
  data: WorkoutData;
  children?: TreeItem[];
  collapsed?: boolean;
}

export type WorkoutData =
  | {
      type: "REST";
      duration: number;
    }
  | {
      type: "EXERCISE";
      exercise: string;
      scoring: Scoring;
    }
  | {
      type: "REPEAT";
      repeat: Repeat;
    };

export type Scoring =
  | {
      type: "REPS";
      reps: number;
    }
  | {
      type: "CALORIES";
      calories: number;
    }
  | {
      type: "DISTANCE";
      distance: number;
      metric: string;
    };

export type Repeat =
  | {
      type: "ROUNDS";
      rounds: number;
    }
  | {
      type: "TIME";
      time: number;
    }
  | {
      type: "EMOM";
      time: number;
      rounds: number;
    };

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: null | string;
  depth: number;
  index: number;
  supportsChildren: boolean;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
