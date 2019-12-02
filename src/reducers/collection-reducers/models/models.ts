export interface Collection<T, E> {
  collection: E
  byId: Record<string, T>
  allIds: Array<keyof Record<string, T>>
}
