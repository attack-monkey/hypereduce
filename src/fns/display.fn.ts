/**
 * Console.logs but also returns the passed in value - making it a psuedo-pure function
 */

export const display = (msg: any) => { console.log(msg); return msg }
