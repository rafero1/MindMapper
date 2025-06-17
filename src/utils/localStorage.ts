export function getBoolean(key: string) {
  const value = localStorage.getItem(key);
  if (value === null) {
    return null;
  }
  return value === "true" || value === "1";
}

export function setBoolean(key: string, value: boolean) {
  localStorage.setItem(key, value ? "true" : "false");
}
