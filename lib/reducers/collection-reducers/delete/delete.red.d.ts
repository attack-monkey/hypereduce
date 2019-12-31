import { Action } from '../../models/action.model';
import { Collection } from '../models/models';
export declare type DeleteAction<E> = Action & {
    id: string;
};
export declare const DELETE: <E>(collectionState: Collection<any>, action: Action) => Collection<any>;
