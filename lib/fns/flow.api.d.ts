export declare type Fn = (...args: any[]) => any;
export interface FlowData<T> {
    type: string;
    payload?: T;
    step?: string;
}
declare type FlowHandler = (flow: FlowData<any>) => any;
interface FlowHandlerHashMap {
    [key: string]: FlowHandler;
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
export declare const displayFlowAndMap: (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => boolean;
export declare const displayBodyAndMap: (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => boolean;
export declare const displayAndMap: (msg: any) => (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => boolean;
export declare const wait: (duration: number) => (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => boolean;
export declare const fromRandom: (flow: FlowData<any>, cb: any) => boolean;
export declare const dispatchAsAction: (flow: FlowData<any>, cb: any) => boolean;
declare type Map = (mapFn: <A extends any>(a: A) => any) => (flow: FlowData<any>, cb: <F extends FlowData<any>>(f: F) => any) => true;
export declare const map: Map;
export declare const updateType: (newType: string) => (flow: any, cb: any) => boolean;
export declare const sequence: (stepHashMap: {
    [key: string]: Fn;
}) => (flow: FlowData<any>) => void;
export declare const registerFlowHandlers: (flowsObj: FlowHandlerHashMap) => void;
export declare const unregisterFlowHandlers: (flowsKeyArr: string[]) => void;
export declare const dispatchFlow: <T>(flow: FlowData<T>) => void;
export {};
