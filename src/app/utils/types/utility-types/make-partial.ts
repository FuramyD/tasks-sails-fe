

export type MakePartial<T extends object, Keys extends keyof T = keyof T> = Omit<T, Keys> & {
    [K in Keys]?: T[K] | null;
};
