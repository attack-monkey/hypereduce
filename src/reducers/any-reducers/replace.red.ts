import { apply } from '../../fns/apply.fn'
import { Action } from '../models/action.model'

export const REPLACE = (location: string, fallback?: any) =>
<S, A extends Action>(state: S, action: A): S =>
  apply(
    action.location === location
      ? action.payload
      : state,
    newState =>
      newState === undefined
        || newState === null
          ? fallback
          : newState
  )
