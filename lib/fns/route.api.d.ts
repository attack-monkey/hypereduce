/**
 * A group of functions responsible for managing route-changes and integrating them into
 * application state.
 *
 */
export declare const goto: (path: any) => void;
export declare const manageRoutes: () => void;
export declare const returnRouteObject: () => {
    segments: string[];
    queryString: {} | undefined;
};
