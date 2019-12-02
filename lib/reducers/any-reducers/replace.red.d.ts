import { Action } from '../models/action.model';
export declare const REPLACE: (location: string, fallback?: any) => <S, A extends Action>(state: S, action: A) => S;
