import type { Completion } from "@/types/completion";
import * as storage from "./storage";

const STORAGE_KEY = "completions";

export function getAllCompletions(): Completion[] {
  return storage.getAll<Completion>(STORAGE_KEY);
}

export function createCompletion(activityId: string, date: string): Completion {
  const now = new Date().toISOString();
  const completion: Completion = {
    id: crypto.randomUUID(),
    activityId,
    completedAt: date,
    createdAt: now,
    updatedAt: now,
  };
  return storage.create<Completion>(STORAGE_KEY, completion);
}

export function deleteCompletion(id: string): boolean {
  return storage.remove<Completion>(STORAGE_KEY, id);
}
