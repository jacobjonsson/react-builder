import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { ExerciseTypeForm } from "./exercise-type-form";
import { RepeatTypeForm } from "./repeat-type-form";
import { RestTypeForm } from "./rest-type-form";
import { WorkoutData } from "./types";

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
        <Dialog.Overlay className="bg-black fixed inset-0 opacity-50 " />

        <div
          className="relative bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col justify-center items-center"
          style={{ minWidth: "320px" }}
        >
          {currenStep === "TYPE" && <TypeStep onSubmit={setCurrentStep} />}
          {currenStep === "REST" && (
            <>
              <Dialog.Title className="mb-4 dark:text-gray-300 text-lg">
                Create rest item
              </Dialog.Title>
              <RestTypeForm
                onSubmit={onSubmit}
                onBack={() => setCurrentStep("TYPE")}
              />
            </>
          )}
          {currenStep === "EXERCISE" && (
            <>
              <Dialog.Title className="mb-4 dark:text-gray-300 text-lg">
                Create exercise item
              </Dialog.Title>
              <ExerciseTypeForm
                onSubmit={onSubmit}
                onBack={() => setCurrentStep("TYPE")}
              />
            </>
          )}
          {currenStep === "REPEAT" && (
            <>
              <Dialog.Title className="mb-4 dark:text-gray-300 text-lg">
                Create type item
              </Dialog.Title>
              <RepeatTypeForm
                onSubmit={onSubmit}
                onBack={() => setCurrentStep("TYPE")}
              />
            </>
          )}
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
      <Dialog.Title className="text-lg mb-4 dark:text-white">
        Select type
      </Dialog.Title>

      <div className="grid grid-cols-3 gap-4 dark:text-white">
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
