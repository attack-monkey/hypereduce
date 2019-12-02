import { Action } from '../../models/action.model';
import { Collection } from '../models/models';
export declare type InsertAction<T, E> = Action & {
    type: 'INSERT';
    collection: E;
    id: string;
    payload: T;
};
export declare const INSERT: <T, E>(collectionState: Collection<T, E>, action: Action) => Collection<T, E>;
