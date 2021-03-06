/**
 * Takes a value and a pure unary function.
 * The value is simply passed into function as the parameter.
 */
declare type Unary<A> = (a: A) => any;
export declare const apply: <X>(x: X) => (f: Unary<X>) => any;
export {};
