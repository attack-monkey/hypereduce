/**
 * Takes a value and a pure unary function.
 * The value is simply passed into function as the parameter.
 */

type Unary<A> = (a: A) => any
export const apply = <X>(x: X) => (f: Unary<X>) => f(x)
