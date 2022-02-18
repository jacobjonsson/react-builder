import { FormEvent, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { SecondaryButton } from "./secondary-button";
import { WorkoutData } from "./types";

interface RestTypeFormProps {
  onBack: () => void;
  onSubmit: (data: Extract<WorkoutData, { type: "REST" }>) => void;
}

export function RestTypeForm({ onSubmit, onBack }: RestTypeFormProps) {
  const [duration, setDuration] = useState(60);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ type: "REST", duration });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-1">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          type="text"
          value={duration}
          onChange={(evt) => setDuration(Number(evt.target.value))}
        />
      </div>

      <div className="flex gap-4">
        <SecondaryButton type="button" onClick={onBack}>
          Back
        </SecondaryButton>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
