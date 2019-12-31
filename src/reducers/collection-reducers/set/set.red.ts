import { apply } from '../../../fns/apply.fn'
import { Action } from '../../models/action.model'
import { Collection } from '../models/models'

export type SetAction<T, E> = Action & {
  id: string
  payload: T
}
export const SET = <T, E>(collectionState: Collection<T>, action: Action): Collection<T> =>
  apply(action as SetAction<T, E>, setAction =>
    ({
        byId: { ...collectionState.byId, [setAction.id]: setAction.payload },
        allIds: [ ...collectionState.allIds, setAction.id]
    })
  )
