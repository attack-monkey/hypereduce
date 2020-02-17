import { display } from './src/fns/display.fn'
import { mustBeArrayOfNumbers, mustBeNumber } from './src/fns/parser.fns'
import { pipe } from './src/fns/pipe.fn'
import {
  connect, d, dispatch, DNode, DStateNode, manageState
} from './src/fns/state.fns'
import { tick } from './src/fns/tick.fn'

const INC = (state, action): number => state + (action.payload || 1)

// manageState places any connection emitions on to the task queue,
// so that state can fully resolve before emitting any values.
manageState({
  counter: d<number>({
    connects: ['counter'],
    init: 1,
    actions: {
      INC
    }
  })
})

// Since emissions have been placed onto the task queue,
// this means that any reachable synchronous code will run before the javaScript engine
// picks up the emission from the task queue.
// This means that any `connect`'s will be listening and fire on receiving the first emission.
// To resolve this, we need to add all of our reachable synchronous code onto the task queue too.
// This lets manageState run for the first time, emit any initial values, and only THEN run the application's main code.
// `tick` simply lets us put something onto the end of the task queue.

type In = number
type Out1 = number
type OutFinal = string
type MyPipe = [
  (x: In) => Out1,
  (x: Out1) => OutFinal
]

const myPipe = pipe<In, OutFinal, MyPipe>(_ => _ + 1, _ => display(`Got a new value ${_}`))
tick(() => {
  connect<number>(
    'counter',
    myPipe
  )

  dispatch({ type: 'INC' }) // Got a new value 2
  dispatch({ type: 'INC', payload: 2 }) // Got a new value 4
})
