type CursorType = "auto" | "pointer" | "grab" | "grabbing" | "text";

export const setCursor = (cursor: CursorType) => {
  document.documentElement.style.cursor = cursor;
};

type ConditionalString = boolean | string;

/**
 * Utility function to conditionally join class names
 * @param classes - Array of class names (strings or undefined)
 * @returns A single string with all class names joined, excluding any undefined values
 */
export const cn = (...classes: (string | ConditionalString | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};
