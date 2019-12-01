declare type ApplyFn<T, RT> = (input: T) => RT;
export declare const apply: <T, RT>(input: T, fn: ApplyFn<T, RT>) => RT;
export {};
