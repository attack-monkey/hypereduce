/**
 * Value Emitting Function that produces a random number.
 * Generates one random number and emits it into the passed
 * in function. Synchronously just returns true to keep it pure.
 */
export declare const fromRandom: (f: (v: number) => any) => boolean;
