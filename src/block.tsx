import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TreeItems,
  SensorContext,
  FlattenedItem,
  WorkoutData,
  ITreeItem,
} from "./types";
import {
  buildTree,
  flattenTree,
  getProjection,
  removeChildrenOf,
} from "./utils";
import { sortableTreeKeyboardCoordinates } from "./keyboard-coordinates";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTreeItem } from "./sortable-tree-item";
import { createPortal } from "react-dom";
import { AddItemModal } from "./add-item-modal";
import * as uuid from "uuid";
import { AddItemButton } from "./add-item-button";
import { AddBlockButton } from "./add-block-button";
import produce from "immer";
import { XIcon } from "@heroicons/react/outline";

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const indentationWidth = 50;

interface BlockProps {
  name: string;
  items: ITreeItem[];
  setItems: (items: ITreeItem[]) => void;
  onAddBlock: () => void;
  onNameChange: (name: string) => void;
  onRemove: () => void;
  isRemovable: boolean;
}

export function Block({
  name,
  items,
  setItems,
  onAddBlock,
  onNameChange,
  onRemove,
  isRemovable,
}: BlockProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const [showModal, setShowModal] = useState<{
    open: boolean;
    parentId?: string;
  }>({ open: false, parentId: "" });

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children?.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth
        )
      : null;

  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });

  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indentationWidth)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);

    document.body.style.setProperty("cursor", "grabbing");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];
      const overTreeItem = clonedItems[overIndex];

      // We should slice the item from it's parent
      if (overTreeItem.parentId && activeTreeItem.supportsChildren) {
        const parentId = overTreeItem.parentId;
        for (let i = 0; i < clonedItems.length; i++) {
          const item = clonedItems[i];
          if (item.parentId === parentId && i >= overIndex) {
            clonedItems[i].parentId = activeId;
          }
        }
      }

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setItems(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);

    document.body.style.setProperty("cursor", "");
  }

  function handleCollapse(id: string) {
    const newItems = produce(items, (draft) => {
      const item = draft.findIndex(({ id: itemId }) => itemId === id);
      draft[item].collapsed = !draft[item].collapsed;
    });
    setItems(newItems);
  }

  function handleRemove(id: string) {
    const newItems: ITreeItem[] = [];
    for (const item of items) {
      if (item.id === id) {
        continue;
      }

      if (item.children?.length) {
        const newChildren = item.children.filter(
          ({ id: childId }) => childId !== id
        );
        newItems.push({ ...item, children: newChildren });
        continue;
      }

      newItems.push(item);
    }
    setItems(newItems);
  }

  function handleDuplicate(id: string) {
    const clonedItems: FlattenedItem[] = JSON.parse(
      JSON.stringify(flattenedItems)
    );
    const item = clonedItems.find((item) => item.id === id);
    const clonedItem: FlattenedItem = JSON.parse(JSON.stringify(item));
    clonedItem.id = uuid.v4();
    let index = clonedItems.findIndex(({ id: itemId }) => itemId === id);
    clonedItems.splice(index + 1, 0, clonedItem);

    const clonedChildren: FlattenedItem[] = [];
    for (const item of clonedItems) {
      if (item.parentId === id) {
        const cloned = JSON.parse(JSON.stringify(item));
        cloned.id = uuid.v4();
        cloned.parentId = clonedItem.id;
        clonedChildren.push(cloned);
      }
    }

    for (const child of clonedChildren.reverse()) {
      clonedItems.splice(index + 1, 0, child);
    }

    const newItems = buildTree(clonedItems);
    setItems(newItems);
  }

  function handleAddItem(data: WorkoutData) {
    const supportsChildren = data.type === "REPEAT";
    setItems([
      ...items,
      { id: uuid.v4(), data, children: supportsChildren ? [] : undefined },
    ]);
    setShowModal({ open: false });
  }

  function isLastItem(idx: number) {
    return idx === flattenedItems.length - 1;
  }

  function getItemSpacing(flattenedItem: FlattenedItem, idx: number) {
    if (isLastItem(idx)) {
      return "";
    }

    if (flattenedItem.parentId) {
      const siblings = flattenedItems.filter(
        (item) => item.parentId === flattenedItem.parentId
      );

      if (siblings.length > 0 && siblings.pop()?.id === flattenedItem.id) {
        return "mb-4";
      } else {
        return "mb-2";
      }
    }

    if (flattenedItem.collapsed) {
      return "mb-4";
    }

    if (flattenedItem.children && flattenedItem.children.length > 0) {
      return "mb-2";
    }

    return "mb-4";
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-4 justify-between items-center mb-4">
          <input
            className="bg-transparent border border-transparent text-gray-900 text-lg rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
          {isRemovable && (
            <button
              type="button"
              onClick={onRemove}
              className="p-2.5 rounded bg-red-600 text-white"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <SortableContext
          items={sortedIds}
          strategy={verticalListSortingStrategy}
        >
          {flattenedItems.map((item, idx) => (
            <SortableTreeItem
              key={item.id}
              id={item.id}
              data={item.data}
              depth={
                item.id === activeId && projected ? projected.depth : item.depth
              }
              isCollapsible={item.supportsChildren}
              isCollapsed={item.collapsed}
              onCollapse={() => handleCollapse(item.id)}
              onRemove={() => handleRemove(item.id)}
              onDuplicate={() => handleDuplicate(item.id)}
              className={getItemSpacing(item, idx)}
            />
          ))}
          {createPortal(
            <DragOverlay dropAnimation={dropAnimation} modifiers={undefined}>
              {activeId && activeItem && (
                <SortableTreeItem
                  id={activeId}
                  depth={activeItem.depth}
                  data={activeItem.data}
                  isCollapsible={activeItem.supportsChildren}
                  isCollapsed={activeItem.collapsed}
                  isOverlay
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </SortableContext>

        <div className="space-y-4 mt-8">
          <AddItemButton onClick={() => setShowModal({ open: true })} />

          <AddBlockButton onClick={onAddBlock} />
        </div>

        {showModal.open && (
          <AddItemModal
            onClose={() => setShowModal({ open: false })}
            onSubmit={handleAddItem}
          />
        )}
      </div>
    </DndContext>
  );
}
