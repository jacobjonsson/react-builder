import { Dialog } from "@headlessui/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Repeat, Scoring, WorkoutData } from "./types";

export interface AddItemModalProps {
  onClose: () => void;
  onSubmit: (data: WorkoutData) => void;
}

export function AddItemModal({ onClose, onSubmit }: AddItemModalProps) {
  const [currenStep, setCurrentStep] = useState<
    "TYPE" | "REST" | "EXERCISE" | "REPEAT"
  >("TYPE");

  return (
    <Dialog open onClose={onClose} className="fixed inset-0">
      <div className="flex justify-center items-center min-h-full">
        <Dialog.Overlay className="bg-black fixed inset-0 opacity-50" />

        <div className="relative bg-white rounded p-4">
          {currenStep === "TYPE" && <TypeStep onSubmit={setCurrentStep} />}
          {currenStep === "REST" && <RestStep onSubmit={onSubmit} />}
          {currenStep === "EXERCISE" && <ExerciseStep onSubmit={onSubmit} />}
          {currenStep === "REPEAT" && <RepeatStep onSubmit={onSubmit} />}
        </div>
      </div>
    </Dialog>
  );
}

interface TypeStep {
  onSubmit: (type: "REST" | "EXERCISE" | "REPEAT") => void;
}

function TypeStep({ onSubmit }: TypeStep) {
  return (
    <>
      <Dialog.Title className="text-lg mb-4">Select type</Dialog.Title>

      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onSubmit("REST")}
          className="border border-gray-300 p-16 rounded"
        >
          Rest
        </button>
        <button
          type="button"
          onClick={() => onSubmit("EXERCISE")}
          className="border border-gray-300 p-16 rounded"
        >
          Work
        </button>
        <button
          type="button"
          onClick={() => onSubmit("REPEAT")}
          className="border border-gray-300 p-16 rounded"
        >
          Repeat
        </button>
      </div>
    </>
  );
}

interface ExerciseStepProps {
  onSubmit: (data: Extract<WorkoutData, { type: "EXERCISE" }>) => void;
}

function ExerciseStep({ onSubmit }: ExerciseStepProps) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-semibold">Exercise</label>
        <input
          type="text"
          value={exercise}
          onChange={(evt) => setExercise(evt.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-semibold">Scoring</label>
        <select
          value={scoring.type}
          onChange={handleChangeScoring}
          className="w-full"
        >
          <option value="REPS">Reps</option>
          <option value="CALORIES">Calories</option>
          <option value="DISTANCE">Distance</option>
        </select>
      </div>

      {scoring.type === "REPS" && (
        <div className="space-y-1">
          <label className="block text-sm font-semibold">Reps</label>
          <input
            type="text"
            value={scoring.reps}
            onChange={(evt) =>
              setScoring((prev) => ({
                ...prev,
                reps: Number(evt.target.value),
              }))
            }
            className="w-full"
          />
        </div>
      )}

      {scoring.type === "CALORIES" && (
        <div className="space-y-1">
          <label className="block text-sm font-semibold">Calories</label>
          <input
            type="text"
            value={scoring.calories}
            onChange={(evt) =>
              setScoring((prev) => ({
                ...prev,
                calories: Number(evt.target.value),
              }))
            }
            className="w-full"
          />
        </div>
      )}

      {scoring.type === "DISTANCE" && (
        <>
          <div className="space-y-1">
            <label className="block text-sm font-semibold">Distance</label>
            <input
              type="text"
              value={scoring.distance}
              onChange={(evt) =>
                setScoring((prev) => ({
                  ...prev,
                  distance: Number(evt.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold">Metric</label>
            <input
              type="text"
              value={scoring.metric}
              onChange={(evt) =>
                setScoring((prev) => ({
                  ...prev,
                  metric: evt.target.value,
                }))
              }
              className="w-full"
            />
          </div>
        </>
      )}

      <button type="submit" className="px-3 py-2 border border-gray-300 w-full">
        Submit
      </button>
    </form>
  );
}

interface RestStepProps {
  onSubmit: (data: Extract<WorkoutData, { type: "REST" }>) => void;
}

function RestStep({ onSubmit }: RestStepProps) {
  const [duration, setDuration] = useState(60);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ type: "REST", duration });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-semibold">Duration</label>
        <input
          type="text"
          value={duration}
          onChange={(evt) => setDuration(Number(evt.target.value))}
          className="w-full"
        />
      </div>

      <button type="submit" className="px-3 py-2 border border-gray-300 w-full">
        Submit
      </button>
    </form>
  );
}

interface RepeatStepProps {
  onSubmit: (data: Extract<WorkoutData, { type: "REPEAT" }>) => void;
}

function RepeatStep({ onSubmit }: RepeatStepProps) {
  const [repeat, setRepeat] = useState<Repeat>({ type: "ROUNDS", rounds: 3 });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ type: "REPEAT", repeat });
  }

  function handleChangeRepeat(event: ChangeEvent<HTMLSelectElement>) {
    switch (event.target.value) {
      case "ROUNDS":
        setRepeat({ type: "ROUNDS", rounds: 3 });
        break;
      case "TIME":
        setRepeat({ type: "TIME", time: 60 });
        break;
      case "EMOM":
        setRepeat({ type: "EMOM", time: 60, rounds: 3 });
        break;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-semibold">Type</label>
        <select
          value={repeat.type}
          onChange={handleChangeRepeat}
          className="w-full"
        >
          <option value="ROUNDS">Rounds</option>
          <option value="TIME">Time</option>
          <option value="EMOM">Emom</option>
        </select>
      </div>

      {repeat.type === "ROUNDS" && (
        <div className="space-y-1">
          <label className="block text-sm font-semibold">Rounds</label>
          <input
            type="number"
            value={repeat.rounds}
            onChange={(evt) =>
              setRepeat((prev) => ({
                ...prev,
                rounds: Number(evt.target.value),
              }))
            }
            className="w-full"
          />
        </div>
      )}

      {repeat.type === "TIME" && (
        <div className="space-y-1">
          <label className="block text-sm font-semibold">Time</label>
          <input
            type="number"
            value={repeat.time}
            onChange={(evt) =>
              setRepeat((prev) => ({
                ...prev,
                time: Number(evt.target.value),
              }))
            }
            className="w-full"
          />
        </div>
      )}

      {repeat.type === "EMOM" && (
        <>
          <div className="space-y-1">
            <label className="block text-sm font-semibold">Time</label>
            <input
              type="number"
              value={repeat.time}
              onChange={(evt) =>
                setRepeat((prev) => ({
                  ...prev,
                  time: Number(evt.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold">Rounds</label>
            <input
              type="number"
              value={repeat.rounds}
              onChange={(evt) =>
                setRepeat((prev) => ({
                  ...prev,
                  rounds: Number(evt.target.value),
                }))
              }
              className="w-full"
            />
          </div>
        </>
      )}

      <button type="submit" className="px-3 py-2 border border-gray-300 w-full">
        Submit
      </button>
    </form>
  );
}
