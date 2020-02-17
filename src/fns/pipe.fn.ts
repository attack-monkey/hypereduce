/**
 * A functional pipe function
 */

type ProtoPipe = <In, Out, F extends any[]>(...fA: F) => (n: In) => Out

export const pipe: ProtoPipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
