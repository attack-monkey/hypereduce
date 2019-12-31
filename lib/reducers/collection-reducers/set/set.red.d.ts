import { Action } from '../../models/action.model';
import { Collection } from '../models/models';
export declare type SetAction<T, E> = Action & {
    id: string;
    payload: T;
};
export declare const SET: <T, E>(collectionState: Collection<T>, action: Action) => Collection<T>;
