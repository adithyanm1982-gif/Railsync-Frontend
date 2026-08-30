export interface PopoverPosition {
  left: number;
  top: number;
}

export function positionPopover(
  anchor: { x: number; y: number },
  popoverSize: { width: number; height: number },
  containerSize: { width: number; height: number },
  offset = 14
): PopoverPosition {
  let left = anchor.x + offset;
  let top = anchor.y + offset;

  if (left + popoverSize.width > containerSize.width) left = anchor.x - popoverSize.width - offset;
  if (top + popoverSize.height > containerSize.height) top = anchor.y - popoverSize.height - offset;

  left = Math.max(8, left);
  top = Math.max(8, top);

  return { left, top };
}
