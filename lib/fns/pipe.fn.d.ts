/**
 * A functional pipe function
 */
declare type ProtoPipe = <In, Out, F extends any[]>(...fA: F) => (n: In) => Out;
export declare const pipe: ProtoPipe;
export {};
