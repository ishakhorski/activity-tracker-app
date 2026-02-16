export function getAll<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  return JSON.parse(raw) as T[];
}

export function getById<T extends { id: string }>(key: string, id: string): T | null {
  return getAll<T>(key).find((item) => item.id === id) ?? null;
}

export function create<T extends { id: string }>(key: string, item: T): T {
  const items = getAll<T>(key);
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
  return item;
}

export function update<T extends { id: string }>(key: string, id: string, data: Partial<T>): T | null {
  const items = getAll<T>(key);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...data } as T;
  localStorage.setItem(key, JSON.stringify(items));
  return items[index] as T;
}

export function remove<T extends { id: string }>(key: string, id: string): boolean {
  const items = getAll<T>(key);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(items));
  return true;
}
