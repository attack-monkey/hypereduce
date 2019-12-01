import { keys } from './keys.fn'

type Fn = (...args: any[]) => any

export const combineReducers = <S, A>(state: S, action: A) => (fns: Record<string, Fn>) =>
  keys(fns).reduce((ac: any, key: string) => ({ ...ac, [key]: fns[key]((state as any)[key], action) }), {})
