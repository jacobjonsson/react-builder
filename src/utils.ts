import { arrayMove } from "@dnd-kit/sortable";
import type { FlattenedItem, ITreeItem, TreeItems } from "./types";

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlattenedItem[],
  activeId: string,
  overId: string,
  dragOffset: number,
  indentationWidth: number
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({ previousItem, activeItem });
  const minDepth = getMinDepth({ nextItem, activeItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth({
  previousItem,
  activeItem,
}: {
  previousItem: FlattenedItem;
  activeItem: FlattenedItem;
}) {
  if (activeItem.supportsChildren) {
    return 0;
  }

  if (previousItem) {
    if (Array.isArray(previousItem.children)) {
      return previousItem.depth + 1;
    } else {
      return previousItem.depth;
    }
  }

  return 0;
}

function getMinDepth({
  nextItem,
  activeItem,
}: {
  nextItem: FlattenedItem;
  activeItem: FlattenedItem;
}) {
  if (activeItem.supportsChildren) {
    return activeItem.depth;
  } else if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

function flatten(
  items: TreeItems,
  parentId: string | null = null,
  depth = 0
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [
      ...acc,
      {
        ...item,
        parentId,
        depth,
        index,
        supportsChildren: Array.isArray(item.children),
      },
      ...(item.children ? flatten(item.children, item.id, depth + 1) : []),
    ];
  }, []);
}

export function flattenTree(items: TreeItems): FlattenedItem[] {
  return flatten(items);
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  const root = { id: "root", children: [] } as unknown as ITreeItem;
  const nodes: Record<string, ITreeItem> = { [root.id]: root };
  const items = flattenedItems.map((item) => ({
    ...item,
    ...(item.supportsChildren && { children: [] }),
  }));

  for (const item of items) {
    const { id, children, data } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, data, children };
    parent.children?.push(item);
  }

  return root.children || [];
}

export function findItem(items: ITreeItem[], itemId: string) {
  return items.find(({ id }) => id === itemId);
}

export function findItemDeep(
  items: TreeItems,
  itemId: string
): ITreeItem | undefined {
  for (const item of items) {
    const { id, children } = item;

    if (id === itemId) {
      return item;
    }

    if (children?.length) {
      const child = findItemDeep(children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}

function countChildren(items: ITreeItem[], count = 0): number {
  return items.reduce((acc, { children }) => {
    if (children?.length) {
      return countChildren(children, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount(items: TreeItems, id: string) {
  if (!id) {
    return 0;
  }

  const item = findItemDeep(items, id);

  return item && item.children ? countChildren(item.children) : 0;
}

export function removeChildrenOf(items: FlattenedItem[], ids: string[]) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children?.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}
