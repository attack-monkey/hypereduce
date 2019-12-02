import { apply } from '../../../fns/apply.fn'
import { Action } from '../../models/action.model'
import { Collection } from '../models/models'

export type InsertAction<T, E> = Action & {
  type: 'INSERT'
  collection: E
  id: string
  payload: T
}
export const INSERT = <T, E>(collectionState: Collection<T, E>, action: Action): Collection<T, E> =>
  apply(action as InsertAction<T, E>, insertAction =>
      insertAction.collection === collectionState.collection
        ? apply(insertAction.id, id =>
            ({
              collection: collectionState.collection,
              byId: { ...collectionState.byId, [id]: insertAction.payload },
              allIds: [ ...collectionState.allIds, id]
            })
          )
        : collectionState
    )
