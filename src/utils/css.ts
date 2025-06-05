type CursorType = "auto" | "pointer" | "grab" | "grabbing" | "text";

export const setCursor = (cursor: CursorType) => {
  document.documentElement.style.cursor = cursor;
};
