import { mockCollection, mockCollectionProgress } from "./collection.mock";
import type { CollectionProgress, UserCollectionItem } from "./collection.types";

export async function getCollection(): Promise<UserCollectionItem[]> {
  return mockCollection;
}

export async function getCollectionProgress(): Promise<CollectionProgress> {
  return mockCollectionProgress;
}

