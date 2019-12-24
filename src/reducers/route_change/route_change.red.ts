import { Action } from '../models/action.model'

export const ROUTE_CHANGE = <S>(state: S, action: Action) => ({
  segments: action.segments || [],
  queryString: action.queryString || {}
})
