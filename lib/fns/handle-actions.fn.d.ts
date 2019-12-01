export declare const handleActions: <S, A extends {
    type: string;
}>(state: S, action: A) => (fns: Record<string, any>) => any;
