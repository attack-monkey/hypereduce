type ApplyFn<T, RT> = (input: T) => RT
export const apply = <T, RT>(input: T, fn: ApplyFn<T, RT>): RT => fn(input)
