import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { SecondaryButton } from "./secondary-button";
import { Select } from "./select";
import { Scoring, WorkoutData } from "./types";

export interface ExerciseTypeFormProps {
  onSubmit: (data: Extract<WorkoutData, { type: "EXERCISE" }>) => void;
  onBack: () => void;
}

export function ExerciseTypeForm({ onSubmit, onBack }: ExerciseTypeFormProps) {
  const [exercise, setExercise] = useState("");
  const [scoring, setScoring] = useState<Scoring>({ type: "REPS", reps: 8 });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ exercise, scoring, type: "EXERCISE" });
  }

  function handleChangeScoring(event: ChangeEvent<HTMLSelectElement>) {
    switch (event.target.value) {
      case "REPS":
        setScoring({ type: "REPS", reps: 8 });
        break;
      case "CALORIES":
        setScoring({ type: "CALORIES", calories: 10 });
        break;
      case "DISTANCE":
        setScoring({ type: "DISTANCE", distance: 20, metric: "meters" });
        break;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-1">
        <Label className="block text-sm font-semibold">Exercise</Label>
        <Input
          type="text"
          value={exercise}
          onChange={(evt) => setExercise(evt.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label className="block text-sm font-semibold">Scoring</Label>
        <Select value={scoring.type} onChange={handleChangeScoring}>
          <option value="REPS">Reps</option>
          <option value="CALORIES">Calories</option>
          <option value="DISTANCE">Distance</option>
        </Select>
      </div>

      {scoring.type === "REPS" && (
        <div className="space-y-1">
          <Label className="block text-sm font-semibold">Reps</Label>
          <Input
            type="text"
            value={scoring.reps}
            onChange={(evt) =>
              setScoring((prev) => ({
                ...prev,
                reps: Number(evt.target.value),
              }))
            }
          />
        </div>
      )}

      {scoring.type === "CALORIES" && (
        <div className="space-y-1">
          <Label className="block text-sm font-semibold">Calories</Label>
          <Input
            type="text"
            value={scoring.calories}
            onChange={(evt) =>
              setScoring((prev) => ({
                ...prev,
                calories: Number(evt.target.value),
              }))
            }
          />
        </div>
      )}

      {scoring.type === "DISTANCE" && (
        <>
          <div className="space-y-1">
            <Label className="block text-sm font-semibold">Distance</Label>
            <Input
              type="text"
              value={scoring.distance}
              onChange={(evt) =>
                setScoring((prev) => ({
                  ...prev,
                  distance: Number(evt.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-1">
            <Label className="block text-sm font-semibold">Metric</Label>
            <Input
              type="text"
              value={scoring.metric}
              onChange={(evt) =>
                setScoring((prev) => ({
                  ...prev,
                  metric: evt.target.value,
                }))
              }
            />
          </div>
        </>
      )}

      <div className="flex gap-4">
        <SecondaryButton type="button" onClick={onBack}>
          Back
        </SecondaryButton>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
