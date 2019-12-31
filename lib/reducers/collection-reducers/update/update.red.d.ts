import { Action } from '../../models/action.model';
import { Collection } from '../models/models';
export declare type UpdateAction<K> = Action & {
    id: string;
    key: string;
    payload: K;
};
export declare const UPDATE: <T, E, K>(collectionState: Collection<T>, action: Action) => Collection<T>;
