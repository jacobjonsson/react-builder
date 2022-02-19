import { useReducer } from "react";
import { Block } from "./block";
import { IBlock, ITreeItem } from "./types";
import * as uuid from "uuid";
import produce from "immer";

const initialBlocks: IBlock[] = [
  {
    id: "block-a",
    name: "Block A",
    items: [
      {
        id: "item1",
        data: {
          type: "REPEAT",
          repeat: { type: "ROUNDS", rounds: 3 },
        },
        children: [
          {
            id: "item1.1",
            data: {
              type: "EXERCISE",
              exercise: "Back Squat",
              scoring: { type: "REPS", reps: 5 },
            },
          },
        ],
      },
    ],
  },
];

interface AppState {
  blocks: IBlock[];
}

type AppEvent =
  | {
      type: "ADD_BLOCK";
      originBlockId: string;
    }
  | {
      type: "UPDATE_ITEMS";
      items: ITreeItem[];
      blockId: string;
    }
  | {
      type: "UPDATE_BLOCK_NAME";
      name: string;
      blockId: string;
    }
  | {
      type: "REMOVE_BLOCK";
      blockId: string;
    };

const reducer = produce((draft: AppState, event: AppEvent) => {
  switch (event.type) {
    case "ADD_BLOCK": {
      const blockIndex = draft.blocks.findIndex(
        (block) => block.id === event.originBlockId
      );
      const newBlock: IBlock = {
        id: uuid.v4(),
        name: "New Block",
        items: [],
      };
      draft.blocks.splice(blockIndex + 1, 0, newBlock);
      break;
    }

    case "UPDATE_ITEMS": {
      const blockIndex = draft.blocks.findIndex(
        (block) => block.id === event.blockId
      );
      draft.blocks[blockIndex].items = event.items;
      break;
    }

    case "UPDATE_BLOCK_NAME": {
      const blockIndex = draft.blocks.findIndex(
        (block) => block.id === event.blockId
      );
      draft.blocks[blockIndex].name = event.name;
      break;
    }

    case "REMOVE_BLOCK": {
      const blockIndex = draft.blocks.findIndex(
        (block) => block.id === event.blockId
      );
      draft.blocks.splice(blockIndex, 1);
      break;
    }
  }
});

export function App() {
  const [state, dispatch] = useReducer(reducer, { blocks: initialBlocks });

  return (
    <div className="divide-y divide-gray-300">
      {state.blocks.map((block) => (
        <Block
          key={block.id}
          name={block.name}
          items={block.items}
          isRemovable={state.blocks.length > 1}
          setItems={(items) =>
            dispatch({ type: "UPDATE_ITEMS", items, blockId: block.id })
          }
          onAddBlock={() =>
            dispatch({ type: "ADD_BLOCK", originBlockId: block.id })
          }
          onNameChange={(name) =>
            dispatch({ type: "UPDATE_BLOCK_NAME", name, blockId: block.id })
          }
          onRemove={() => dispatch({ type: "REMOVE_BLOCK", blockId: block.id })}
        />
      ))}
    </div>
  );
}
