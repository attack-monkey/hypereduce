import { die } from './die.fn'

export const isArray = (maybe: any): boolean => typeof maybe === 'object' && Array.isArray(maybe)
export const mustBeNumber = (maybe: any) => mustBe<number>('number')(maybe)
export const mustBeString = (maybe: any) => mustBe<string>('string')(maybe)
export const mustBeBoolean = (maybe: any) => mustBe<boolean>('boolean')(maybe)

export const is = (pType: string) => (maybe: any): boolean => typeof maybe === pType

export const mustBe = <T>(pType: string) => (maybe: any): T =>
  is(pType)(maybe)
    ? maybe as T
    : die(`${maybe} must be a ${pType}!`) as unknown as T

export const mustBeArrayOf =
  <Atype>(aType: string) => (maybe: any): Atype[] =>
    isArray(maybe) && maybe.every(item => typeof item === aType)
      ? maybe as Atype[]
      : die(`${maybe} must be an array of ${aType}`) as unknown as Atype[]

export const mustBeArrayOfNumbers = (maybe: any) => mustBeArrayOf<number>('number')(maybe)
export const mustBeArrayOfStrings = (maybe: any) => mustBeArrayOf<string>('string')(maybe)
export const mustBeArrayOfBooleans = (maybe: any) => mustBeArrayOf<boolean>('boolean')(maybe)
