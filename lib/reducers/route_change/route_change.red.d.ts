import { Action } from '../models/action.model';
export declare const ROUTE_CHANGE: <S>(state: S, action: Action) => {
    segments: any;
    queryString: any;
};
