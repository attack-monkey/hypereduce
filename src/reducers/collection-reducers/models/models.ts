export interface Collection<T> {
  byId: Record<string, T>
  allIds: Array<keyof Record<string, T>>
}
