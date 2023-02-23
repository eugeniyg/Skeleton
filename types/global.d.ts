export {};

declare global {
    type Maybe<T> = T | null | undefined;
    interface Window { BetSdk?: any; }
}
