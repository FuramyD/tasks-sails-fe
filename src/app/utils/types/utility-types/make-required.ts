

export type MakeRequired<T extends object, Keys extends keyof T = keyof T> = {
    [K in Exclude<keyof T, Keys>]?: T[K] | null;
} & Required<Pick<T, Keys>>;
