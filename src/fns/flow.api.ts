import { display } from './display.fn'
import { dispatch } from './state.api'

export type Fn = (...args: any[]) => any

export interface FlowData<T> {
  type: string,
  payload?: T,
  step?: string
}

type FlowHandler = (flow: FlowData<any>) => any

interface FlowHandlerHashMap {
  [key: string]: FlowHandler
}

/**
 *
 * sequence allows asynchronous steps to run sequentially.
 *
 * A sequence runs each step one after the other until finsihsed.
 *
 * A step in the sequence can call next(flow) to pass the flow on to the next step in the sequence
 * OR
 * next(flow, sequence, 'stepN') to pass the flow into another sequence at a particular step.
 *
 * TODO: To run multiple steps in parallel, wrap the steps in an array ... eg.
 *
 * sequence({
 *  step1,
 *  step2,
 *  parallel1: [ // TODO <------------------
 *    step3a, step3b
 *  ],
 *  step4
 * })
 */

// displays the flow - but maps the flow unchanged
export const displayFlowAndMap = (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => {
  console.log(flow)
  cb(flow)
  return true
}
// displays the body (payload) of the flow - but maps the flow unchanged
export const displayBodyAndMap = (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => {
  console.log(flow.payload)
  cb(flow)
  return true
}

// displays a message - but maps the flow unchanged
export const displayAndMap = (msg: any) => (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => {
  console.log(msg)
  cb(flow)
  return true
}

// waits a duration but then maps the flow unchanged
export const wait = (duration: number) => (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => {
  setTimeout(() => cb(flow), duration)
  return true
}

// generates a random number and maps that to the output
export const fromRandom = (flow: FlowData<any>, cb) => {
  const r = Math.random()
  const newFlow = {
    ...flow, payload: r
  }
  cb(newFlow)
  return true
}

// dispatches the flow as if it were an action
export const dispatchAsAction = (flow: FlowData<any>, cb) => {
  dispatch(flow)
  cb(flow)
  return true
}

type Map = (mapFn: <A extends any>(a: A) => any) =>
  (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => true

// takes a mapping function that takes the flow's body and produces an output.
// the output is then wrapped back into a flow
export const map: Map = mapFn => (flow, cb) => {
  const newFlow = {
    ...flow, payload: mapFn(flow.payload)
  }
  cb(newFlow)
  return true
}

// updates the flow's type to the passed in string
export const updateType = (newType: string) => (flow, cb) => {
  const newFlow = { ...flow, type: newType }
  cb(newFlow)
  return true
}

export const sequence = (stepHashMap: { [key: string]: Fn }) => (flow: FlowData<any>) => {

  const runNextStep = (flow: any, upTo: number, stepsKeys: string[], ...steps: Fn[]) => {
    steps[upTo](flow, (newFlow: any, sequnceFn?: Fn, step?: string) => {
      const nextSequence = sequnceFn || sequence(stepHashMap)
      const defaultStep = stepsKeys.length > upTo + 1
        ? stepsKeys[upTo + 1]
        : 'complete'
      const newNewFlow = { ...newFlow, step: step || defaultStep }
      return nextSequence(newNewFlow)
    })
  }

  const testNextStep = (flow: any, stepsKeys: string[]) => {
    const step = flow.step || undefined // extract step if one exists
    // get the index of the step we are up to
    const upToStep1 = step
      ? stepsKeys.findIndex(el => el === step)
      : 0
    // if the step can't be found (-1) - then stop and log the fact
    const upTo = upToStep1 === -1
      ? (() => { console.error(`Step ${step} cannot be found`); return true })() && undefined
      : upToStep1
    // Run the step with the next function callback
    // The callback can take a sequence and a step for sequence / step jumping
    return upTo
  }

  const steps: Fn[] = Object.keys(stepHashMap).map((s: string) => stepHashMap[s])
  // Only run the next step if it's not set to complete and next step exists...
  const stepsKeys = Object.keys(stepHashMap) // create array of step names
  const upTo =
  flow && flow.step !== 'complete'
      ? testNextStep(flow, stepsKeys)
      : undefined
  upTo !== undefined && upTo !== false
    ? runNextStep(flow, upTo, stepsKeys, ...steps)
    : undefined
}

const flowHandlers: FlowHandlerHashMap = {}

export const registerFlowHandlers = (flowsObj: FlowHandlerHashMap) =>
  Object.keys(flowsObj)
    .forEach(
      key => flowHandlers[key] = flowHandlers[key]
        ? display(`Flow \'${key}'\ already has a value. You must unload this current flow to load a new one.`)
          && flowHandlers[key]
        : flowsObj[key]
    )

export const unregisterFlowHandlers = (flowsKeyArr: string[]) =>
  flowsKeyArr
    .forEach(
      key => { delete flowHandlers[key] }
    )

export const dispatchFlow = <T>(flow: FlowData<T>) => {
  try {
    flowHandlers[flow.type](flow)
  } catch (e) {
    throw new Error(`Flow ${flow.type} does not exist`)
  }
}
