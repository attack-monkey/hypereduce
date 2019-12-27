export interface Action {
    type: string;
    [key: string]: any;
}
export declare const getStore: () => any;
export declare const getReducer: () => any;
export declare const connect: (key: string, fn: any) => void;
export declare const disconnect: (key: string) => void;
export declare const dispatch: (...actions: Action[]) => void;
export declare const goto: (path: any) => void;
export declare const hypeReduce: (init: any, reduceObject: any) => void;
export declare const hypeReduceCore: <S, A extends Action>(state: S, action: A, pKey?: string | undefined) => (mirror: Record<string, any>) => any;
