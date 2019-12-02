import { apply } from '../../../fns/apply.fn'
import { Action } from '../../models/action.model'
import { Collection } from '../models/models'

export type UpdateAction<E, K> = Action & {
  type: 'UPDATE'
  collection: E
  id: string
  key: string
  payload: K
}
export const UPDATE = <T, E, K>(collectionState: Collection<T, E>, action: Action): Collection<T, E> =>
  apply(action as UpdateAction<E, K>, setAction =>
      setAction.collection === collectionState.collection
        ? ({
            collection: collectionState.collection,
            byId: {
              ...collectionState.byId,
              [setAction.id]: {
                ...collectionState.byId[setAction.id],
                [setAction.key]: setAction.payload
              }
            },
            allIds: collectionState.allIds
          })
        : collectionState
    )
