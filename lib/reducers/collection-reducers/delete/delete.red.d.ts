import { Action } from '../../models/action.model';
import { Collection } from '../models/models';
export declare type DeleteAction<E> = Action & {
    type: 'DELETE';
    collection: E;
    id: string;
};
export declare const DELETE: <E>(collectionState: Collection<any, E>, action: Action) => Collection<any, E>;
