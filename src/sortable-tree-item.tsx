import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";
import { TreeItem, TreeItemProps } from "./tree-item";

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true);

interface SortableTreeItemProps extends TreeItemProps {
  id: string;
}

export function SortableTreeItem({
  id,
  depth,
  ...rest
}: SortableTreeItemProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({ id, animateLayoutChanges });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      depth={depth}
      style={style}
      ghost={isDragging}
      {...rest}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
    />
  );
}
