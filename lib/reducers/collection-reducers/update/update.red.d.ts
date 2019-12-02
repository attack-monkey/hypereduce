import { Action } from '../../models/action.model';
import { Collection } from '../models/models';
export declare type UpdateAction<E, K> = Action & {
    type: 'UPDATE';
    collection: E;
    id: string;
    key: string;
    payload: K;
};
export declare const UPDATE: <T, E, K>(collectionState: Collection<T, E>, action: Action) => Collection<T, E>;
