export {};

declare global {
    type Maybe<T> = T | null | undefined;
    interface Window {
        BetSdk?: any;
        pwa?: {
            allowInstall: boolean;
            originalEvent: any;
            install: () => Promise<any>;
            onInit: (cb: () => void) => void
        }
    }
}
