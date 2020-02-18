/**
 * A group of functions responsible for managing application state
 */
interface Action {
    type: string;
    payload?: any;
}
export declare type DStateNode<T> = (state: T, action: Action | undefined) => T;
export declare const fromDynamicState: (fn: <S>(state: S) => any) => any;
export declare const dynamicState: {
    subscribe: (fn: <S>(state: S) => any) => number;
    unsubscribe: (key: number) => boolean;
};
export declare const getConnections: (key: string) => any;
export declare const connect: <S>(key: string, fn: (s: S) => any) => void;
export declare const connectAndEmitCurrent: <S>(key: string, fn: (s: S) => any) => void;
export declare const disconnect: (key: string) => boolean;
export declare type ReducerFn<T> = (state: T, action: Action) => T;
export interface DNode<T> {
    init?: T;
    connects?: string[];
    _?: T;
    actions?: {
        [key: string]: ReducerFn<T>;
    };
}
export declare const d: <T>(node: DNode<T>) => (state: T, action: Action | undefined) => T | undefined;
export declare const manageState: <D>(input: D) => boolean;
export declare const dispatch: (action: Action) => boolean;
export declare const dispatchAction: (action: Action) => boolean;
export {};
