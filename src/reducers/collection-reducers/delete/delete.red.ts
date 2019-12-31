import { apply } from '../../../fns/apply.fn'
import { Action } from '../../models/action.model'
import { Collection } from '../models/models'

export type DeleteAction<E> = Action & {
  id: string
}
export const DELETE = <E>(collectionState: Collection<any>, action: Action): Collection<any> =>
  apply(action as DeleteAction<E>, deleteAction =>
    apply(
      collectionState.allIds.filter(id => id !== deleteAction.id), allIds =>
      ({
        byId: allIds.reduce((ac, id) => ({ ...ac, [id]: collectionState.byId[id] }), {}),
        allIds
      })
    )
  )
