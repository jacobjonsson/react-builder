import type { MutableRefObject } from "react";

export interface IBlock {
  id: string;
  name: string;
  items: ITreeItem[];
}

export interface ITreeItem {
  id: string;
  data: WorkoutData;
  children?: ITreeItem[];
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

export type TreeItems = ITreeItem[];

export interface FlattenedItem extends ITreeItem {
  parentId: null | string;
  depth: number;
  index: number;
  supportsChildren: boolean;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
