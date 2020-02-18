import { apply } from '../src/fns/apply.fn'
import { display } from '../src/fns/display.fn'
import {
  dispatchAsAction, dispatchFlow, displayBodyAndMap, displayFlowAndMap, FlowData, fromRandom, map,
  registerFlowHandlers, sequence, updateType, wait
} from '../src/fns/flow.api'
import { pipe } from '../src/fns/pipe.fn'
import {
  connect, d, dispatch, dispatchAction, DStateNode, manageState
} from '../src/fns/state.api'
import { tick } from '../src/fns/tick.fn'

export const run = () => {

  // Set up a sequence
  const seq1 = sequence({
    fromRandom, // generates a random number and maps it to the flow's payload.
    map: map(v => Math.floor(v * 10)),      // Maps the flows payload to a new payload
    displayBodyAndMap,                      // logs the body (payload) of the flow
    displayFlowAndMap1: displayFlowAndMap,  // logs the whole flow
    updateType: updateType('INC'),          // Updates the type of the flow
    displayFlowAndMap2: displayFlowAndMap,  // Again - displays the full flow
    wait: wait(2000),                       // Wait 2 seconds
    dispatchAsAction // Dispatches the flow as an action
  })

  // Connect a flow to the sequence
  const RANDOMISER = (flow: FlowData<number>) => seq1(flow)

  registerFlowHandlers({
    RANDOMISER
  })

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
  // This lets manageState run for the first time,
  // emit any initial values, and only THEN run the application's main code.
  // `tick` simply lets us put something onto the end of the task queue.

  type In = number
  type Out1 = number
  type OutFinal = string
  type MyPipe = [
    (x: In) => Out1,
    (x: Out1) => OutFinal
  ]

  const inc = (x: number) => x + 1
  const myPipe = pipe<In, OutFinal, MyPipe>(inc, _ => display(`Got a new value ${_}`)
)

  tick(() => {
    connect<number>(
      'counter',
      myPipe
    )

    dispatchAction({ type: 'INC' }) // Note that this is being piped to produce a 3
    dispatchFlow({ type: 'RANDOMISER' }) // This is dispatching to a flow.
    // Note that any logging within the flow happens before the first connect.
    // That's because callbacks happen before the task on the queue is run.
  })

}
