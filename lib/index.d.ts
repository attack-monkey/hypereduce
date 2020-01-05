import { Action } from './fns/hype-reduce.fn';
export declare const connect: (key: string, fn: any) => void;
export declare const disconnect: (key: string) => void;
export declare const dispatch: (...actions: Action[]) => void;
export declare const getStore: () => any;
export declare const getRoute: () => {
    segments: string[];
    queryString: {} | undefined;
};
export declare const goto: (path: any) => void;
export declare const hypeReduce: (init: any, reduceObject: any) => void;
export declare const getReducer: () => any;
export declare const hypeReduceCore: <S, A extends Action>(state: S, action: A, pKey?: string | undefined) => (mirror: Record<string, any>) => any;
export declare const ROUTE_CHANGE: <S>(state: S, action: import("./reducers/models/action.model").Action) => {
    segments: any;
    queryString: any;
};
export declare const REPLACE: <S, A extends import("./reducers/models/action.model").Action>(state: S, action: A) => S;
export declare const DELETE: <E>(collectionState: import("./reducers/collection-reducers/models/models").Collection<any>, action: import("./reducers/models/action.model").Action) => import("./reducers/collection-reducers/models/models").Collection<any>;
export declare const SET: <T, E>(collectionState: import("./reducers/collection-reducers/models/models").Collection<T>, action: import("./reducers/models/action.model").Action) => import("./reducers/collection-reducers/models/models").Collection<T>;
export declare const UPDATE: <T, E, K>(collectionState: import("./reducers/collection-reducers/models/models").Collection<T>, action: import("./reducers/models/action.model").Action) => import("./reducers/collection-reducers/models/models").Collection<T>;
