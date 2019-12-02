import { apply } from '../../../fns/apply.fn'
import { Action } from '../../models/action.model'
import { Collection } from '../models/models'

export type DeleteAction<E> = Action & {
  type: 'DELETE'
  collection: E
  id: string
}
export const DELETE = <E>(collectionState: Collection<any, E>, action: Action): Collection<any, E> =>
  apply(action as DeleteAction<E>, deleteAction =>
      deleteAction.collection === collectionState.collection
        ? apply(
            collectionState.allIds.filter(id => id !== deleteAction.id), allIds =>
              ({
                collection: collectionState.collection,
                byId: allIds.reduce((ac, id) => ({ ...ac, [id]: collectionState.byId[id] }), {}),
                allIds
              })
          )
        : collectionState
    )
