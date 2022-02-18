import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { SecondaryButton } from "./secondary-button";
import { Select } from "./select";
import { Repeat, WorkoutData } from "./types";

interface RepeatTypeFormProps {
  onSubmit: (data: Extract<WorkoutData, { type: "REPEAT" }>) => void;
  onBack: () => void;
}

export function RepeatTypeForm({ onSubmit, onBack }: RepeatTypeFormProps) {
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-1">
        <Label className="block text-sm font-semibold">Type</Label>
        <Select value={repeat.type} onChange={handleChangeRepeat}>
          <option value="ROUNDS">Rounds</option>
          <option value="TIME">Time</option>
          <option value="EMOM">Emom</option>
        </Select>
      </div>

      {repeat.type === "ROUNDS" && (
        <div className="space-y-1">
          <Label className="block text-sm font-semibold">Rounds</Label>
          <Input
            type="number"
            value={repeat.rounds}
            onChange={(evt) =>
              setRepeat((prev) => ({
                ...prev,
                rounds: Number(evt.target.value),
              }))
            }
          />
        </div>
      )}

      {repeat.type === "TIME" && (
        <div className="space-y-1">
          <Label className="block text-sm font-semibold">Time</Label>
          <Input
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
            <Label className="block text-sm font-semibold">Time</Label>
            <Input
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
            <Label className="block text-sm font-semibold">Rounds</Label>
            <Input
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

      <div className="flex gap-4">
        <SecondaryButton type="button" onClick={onBack}>
          Back
        </SecondaryButton>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
