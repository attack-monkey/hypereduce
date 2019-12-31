import { Action } from '../models/action.model'

export const REPLACE = <S, A extends Action>(state: S, action: A): S =>
  action.payload || state
