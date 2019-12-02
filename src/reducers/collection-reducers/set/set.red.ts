import { apply } from '../../../fns/apply.fn'
import { Action } from '../../models/action.model'
import { Collection } from '../models/models'

export type SetAction<T, E> = Action & {
  type: 'SET'
  collection: E
  id: string
  payload: T
}
export const SET = <T, E>(collectionState: Collection<T, E>, action: Action): Collection<T, E> =>
  apply(action as SetAction<T, E>, setAction =>
      setAction.collection === collectionState.collection
        ? ({
            collection: collectionState.collection,
            byId: { ...collectionState.byId, [setAction.id]: setAction.payload },
            allIds: collectionState.allIds
          })
        : collectionState
    )
