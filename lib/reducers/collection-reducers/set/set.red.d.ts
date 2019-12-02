import { Action } from '../../models/action.model';
import { Collection } from '../models/models';
export declare type SetAction<T, E> = Action & {
    type: 'SET';
    collection: E;
    id: string;
    payload: T;
};
export declare const SET: <T, E>(collectionState: Collection<T, E>, action: Action) => Collection<T, E>;
