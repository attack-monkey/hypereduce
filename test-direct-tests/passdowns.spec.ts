import { display } from '../src/fns/display.fn'
import { pretty } from '../src/fns/pretty.fn'
import { connect, d, dispatch, DStateNode, manageState } from '../src/fns/state.api'

const DISABLE_FIELD1 = (state) => ({...state, enabled: false })
const ENABLE_FIELD1 = (state) => ({...state, enabled: true })
const SET_TEXT_FIELD_ONE = (state, action) => action.payload || state

export const run = () => {
  manageState({
    field1: d<{text: (string | DStateNode<string>), enabled: (boolean | DStateNode<boolean>) }>({
      connects: ['field1'],
      init: { text: 'hello', enabled: true },
      actions: {
        DISABLE_FIELD1,
        ENABLE_FIELD1
      },
      _: {
        text: d<string>({
          actions: {
            SET_TEXT_FIELD_ONE
          }
        }),
        enabled: d({}) // we can just set this to an empty object to pass back the current state,
      }
    })
  })

  connect('field1', _ => display(`GOT ${pretty(_)}`))
  dispatch({ type: 'SET_FIELD1', payload: 'YO!' })
  dispatch({ type: 'DISABLE_FIELD1' })
}
