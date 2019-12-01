import { Action } from './fns/hype-reduce.fn';
export declare const connect: (key: string, fn: any) => void;
export declare const dispatch: (action: Action) => void;
export declare const getStore: () => any;
export declare const goto: (path: any) => void;
export declare const hypeReduce: (init: any, reduceObject: any) => void;
export declare const hypeReduceCore: <S, A extends Action>(state: S, action: A, pKey?: string | undefined) => (mirror: Record<string, any>) => any;