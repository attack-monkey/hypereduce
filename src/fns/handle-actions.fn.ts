import { apply } from './apply.fn'
import { keys } from './keys.fn'

const handleActionsI = <S, A extends { type: string }>(action: A, state: S, fns: Record<string, any>, i: number): S =>
  apply(keys(fns).length - 1, lastIndex =>
    apply(keys(fns)[i], key =>
      apply(lastIndex === i, isLastIndex =>
        key === '_' // -> pass through
          ? fns[key](state, action)
          : action.type === key
            ? fns[key](state, action)
            : !isLastIndex
              ? handleActionsI(action, state, fns, i + 1)
              : state
      )))

export const handleActions = <S, A extends { type: string }>(state: S, action: A) =>
  (fns: Record<string, any>): any =>
    handleActionsI(action, state, fns, 0)
