import { apply } from '../../../fns/apply.fn'
import { Action } from '../../models/action.model'
import { Collection } from '../models/models'

export type UpdateAction<K> = Action & {
  id: string
  key: string
  payload: K
}
export const UPDATE = <T, E, K>(collectionState: Collection<T>, action: Action): Collection<T> =>
  apply(action as UpdateAction<K>, setAction =>
    ({
      byId: {
        ...collectionState.byId,
        [setAction.id]: {
          ...collectionState.byId[setAction.id],
          [setAction.key]: setAction.payload
        }
      },
      allIds: collectionState.allIds
    })
  )
