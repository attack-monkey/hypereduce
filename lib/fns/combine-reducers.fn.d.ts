declare type Fn = (...args: any[]) => any;
export declare const combineReducers: <S, A>(state: S, action: A) => (fns: Record<string, Fn>) => any;
export {};
